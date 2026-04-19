import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const cwd = process.cwd();
const envPath = path.join(cwd, '.env');

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  return content
    .split(/\r?\n/)
    .filter((line) => line && !line.trim().startsWith('#') && line.includes('='))
    .reduce((acc, line) => {
      const idx = line.indexOf('=');
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      acc[key] = value;
      return acc;
    }, {});
}

const fileEnv = loadDotEnv(envPath);
const readEnv = (name, fallback = '') => process.env[name] || fileEnv[name] || fallback;

const supabaseUrl = readEnv('VITE_SUPABASE_URL');
const supabaseKey = readEnv('VITE_SUPABASE_PUBLISHABLE_KEY') || readEnv('VITE_SUPABASE_ANON_KEY');
const secretKey = readEnv('SUPABASE_SECRET_KEY');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY).');
  process.exit(1);
}

const defaultPassword = readEnv('COACHPRO_DEFAULT_PASSWORD', 'CoachPro@2026!');
const seedTag = readEnv('COACHPRO_ACCOUNT_TAG', '2026');

const accounts = [
  {
    role: 'admin',
    name: 'CoachPro Admin',
    email: readEnv('COACHPRO_ADMIN_EMAIL', `admin.${seedTag}@coachpro-demo.com`),
    password: readEnv('COACHPRO_ADMIN_PASSWORD', defaultPassword),
  },
  {
    role: 'teacher',
    name: 'CoachPro Teacher',
    email: readEnv('COACHPRO_TEACHER_EMAIL', `teacher.${seedTag}@coachpro-demo.com`),
    password: readEnv('COACHPRO_TEACHER_PASSWORD', defaultPassword),
  },
  {
    role: 'student',
    name: 'CoachPro Student',
    email: readEnv('COACHPRO_STUDENT_EMAIL', `student.${seedTag}@coachpro-demo.com`),
    password: readEnv('COACHPRO_STUDENT_PASSWORD', defaultPassword),
  },
];

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const adminClient = secretKey
  ? createClient(supabaseUrl, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

async function ensureAccountViaAdmin(account) {
  const output = {
    role: account.role,
    email: account.email,
    password: account.password,
    userId: null,
    created: false,
    canLogin: false,
    profileRole: null,
    notes: [],
  };

  const { data: listData, error: listErr } = await adminClient.auth.admin.listUsers();
  if (listErr) {
    output.notes.push(`Admin listUsers failed: ${listErr.message}`);
    return output;
  }

  const existingUser = (listData?.users || []).find((u) => u.email?.toLowerCase() === account.email.toLowerCase());
  let userId = existingUser?.id || null;

  if (!existingUser) {
    const { data: createData, error: createErr } = await adminClient.auth.admin.createUser({
      email: account.email,
      password: account.password,
      email_confirm: true,
      user_metadata: {
        name: account.name,
        role: account.role,
      },
    });

    if (createErr) {
      output.notes.push(`Admin createUser failed: ${createErr.message}`);
      return output;
    }

    output.created = Boolean(createData?.user?.id);
    userId = createData?.user?.id || null;
    output.notes.push(output.created ? 'Account created via admin API' : 'Admin create returned no user id');
  } else {
    output.notes.push('Account already exists (admin lookup)');
  }

  if (!userId) {
    output.notes.push('Missing user id after admin creation/lookup');
    return output;
  }
  output.userId = userId;

  const { error: profileUpsertErr } = await adminClient
    .from('profiles')
    .upsert(
      {
        id: userId,
        name: account.name,
        email: account.email,
        role: account.role,
      },
      { onConflict: 'id' }
    );

  if (profileUpsertErr) {
    output.notes.push(`Profile upsert failed: ${profileUpsertErr.message}`);
  } else {
    output.notes.push('Profile upserted via admin API');
  }

  const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
    email: account.email,
    password: account.password,
  });

  if (signInErr) {
    output.notes.push(`Login failed: ${signInErr.message}`);
    return output;
  }

  output.canLogin = true;
  output.notes.push('Login success');

  const { data: profileData, error: profileErr } = await supabase
    .from('profiles')
    .select('role, name, email')
    .eq('id', signInData.user.id)
    .single();

  if (profileErr) {
    output.notes.push(`Profile lookup failed: ${profileErr.message}`);
  } else {
    output.profileRole = profileData?.role || null;
    output.notes.push(`Profile role=${output.profileRole}`);
  }

  await supabase.auth.signOut();
  return output;
}

async function ensureDomainData(results) {
  const admin = results.find((r) => r.role === 'admin');
  const teacher = results.find((r) => r.role === 'teacher');
  const student = results.find((r) => r.role === 'student');

  if (!admin?.userId || !teacher?.userId || !student?.userId) {
    return { ok: false, message: 'Missing profile ids for admin/teacher/student bootstrap' };
  }

  const { data: batchRows, error: batchErr } = await adminClient
    .from('batches')
    .upsert(
      {
        name: 'Batch A',
        course: 'Foundation Program',
        start_date: '2026-04-01',
        end_date: '2026-12-31',
      },
      { onConflict: 'name' }
    )
    .select();

  if (batchErr) return { ok: false, message: `Batch bootstrap failed: ${batchErr.message}` };
  const batch = batchRows?.[0];
  if (!batch?.id) return { ok: false, message: 'Batch bootstrap returned no id' };

  const { data: teacherRows, error: teacherErr } = await adminClient
    .from('teachers')
    .upsert(
      {
        profile_id: teacher.userId,
        employee_id: 'TCH-2026-001',
        subject: 'Mathematics',
        qualification: 'M.Sc Mathematics',
        experience_yrs: 5,
        is_active: true,
      },
      { onConflict: 'profile_id' }
    )
    .select();

  if (teacherErr) return { ok: false, message: `Teacher bootstrap failed: ${teacherErr.message}` };
  const teacherRow = teacherRows?.[0];
  if (!teacherRow?.id) return { ok: false, message: 'Teacher bootstrap returned no id' };

  const { data: studentRows, error: studentErr } = await adminClient
    .from('students')
    .upsert(
      {
        profile_id: student.userId,
        batch_id: batch.id,
        roll_number: 'STU-2026-001',
        parent_name: 'Guardian Name',
        parent_phone: '9999999999',
        is_active: true,
      },
      { onConflict: 'profile_id' }
    )
    .select();

  if (studentErr) return { ok: false, message: `Student bootstrap failed: ${studentErr.message}` };
  const studentRow = studentRows?.[0];
  if (!studentRow?.id) return { ok: false, message: 'Student bootstrap returned no id' };

  const { data: subjectRows, error: subjectErr } = await adminClient
    .from('subjects')
    .upsert(
      {
        name: 'Mathematics',
        batch_id: batch.id,
        teacher_id: teacherRow.id,
      },
      { onConflict: 'name,batch_id' }
    )
    .select();

  if (subjectErr) return { ok: false, message: `Subject bootstrap failed: ${subjectErr.message}` };
  const subject = subjectRows?.[0];
  if (!subject?.id) return { ok: false, message: 'Subject bootstrap returned no id' };

  const { data: existingLecture, error: existingLectureErr } = await adminClient
    .from('lectures')
    .select('id')
    .eq('subject_id', subject.id)
    .eq('teacher_id', teacherRow.id)
    .eq('batch_id', batch.id)
    .eq('day_of_week', 0)
    .eq('start_time', '09:00')
    .limit(1);
  if (existingLectureErr) return { ok: false, message: `Lecture lookup failed: ${existingLectureErr.message}` };

  if (!existingLecture?.length) {
    const { error: lectureInsertErr } = await adminClient
      .from('lectures')
      .insert({
        subject_id: subject.id,
        teacher_id: teacherRow.id,
        batch_id: batch.id,
        day_of_week: 0,
        start_time: '09:00',
        end_time: '10:00',
        room: 'A-101',
        is_active: true,
      });
    if (lectureInsertErr) return { ok: false, message: `Lecture bootstrap failed: ${lectureInsertErr.message}` };
  }

  const { data: testRows, error: testErr } = await adminClient
    .from('tests')
    .insert({
      title: 'Weekly Mathematics Test',
      subject_id: subject.id,
      batch_id: batch.id,
      test_date: '2026-04-19',
      max_marks: 100,
      conducted_by: teacherRow.id,
    })
    .select();

  let testId = testRows?.[0]?.id;
  if (testErr) {
    const { data: existingTest, error: existingTestErr } = await adminClient
      .from('tests')
      .select('id')
      .eq('title', 'Weekly Mathematics Test')
      .eq('batch_id', batch.id)
      .order('id', { ascending: false })
      .limit(1);
    if (existingTestErr) return { ok: false, message: `Test bootstrap failed: ${testErr.message}` };
    testId = existingTest?.[0]?.id;
  }

  if (!testId) return { ok: false, message: 'Test bootstrap returned no id' };

  const { error: resultErr } = await adminClient
    .from('test_results')
    .upsert(
      {
        test_id: testId,
        student_id: studentRow.id,
        marks: 86,
        is_absent: false,
        uploaded_by: teacherRow.id,
      },
      { onConflict: 'test_id,student_id' }
    );
  if (resultErr) return { ok: false, message: `Test result bootstrap failed: ${resultErr.message}` };

  const { error: attendanceErr } = await adminClient
    .from('attendance')
    .upsert(
      {
        student_id: studentRow.id,
        subject_id: subject.id,
        date: '2026-04-19',
        status: 'present',
        marked_by: teacherRow.id,
      },
      { onConflict: 'student_id,subject_id,date' }
    );
  if (attendanceErr) return { ok: false, message: `Attendance bootstrap failed: ${attendanceErr.message}` };

  return {
    ok: true,
    message: `Domain rows ready (batch=${batch.id}, teacher=${teacherRow.id}, student=${studentRow.id}, subject=${subject.id}, test=${testId})`,
  };
}

async function ensureAccount(account) {
  const output = {
    role: account.role,
    email: account.email,
    password: account.password,
    created: false,
    canLogin: false,
    profileRole: null,
    notes: [],
  };

  const signUpWithRole = async () =>
    supabase.auth.signUp({
      email: account.email,
      password: account.password,
      options: {
        data: {
          name: account.name,
          role: account.role,
        },
      },
    });

  const signUpWithoutRole = async () =>
    supabase.auth.signUp({
      email: account.email,
      password: account.password,
      options: {
        data: {
          name: account.name,
        },
      },
    });

  let { data: signUpData, error: signUpErr } = await signUpWithRole();

  if (signUpErr && /Database error saving new user/i.test(signUpErr.message)) {
    output.notes.push('Role metadata signup failed, retrying without role metadata');
    ({ data: signUpData, error: signUpErr } = await signUpWithoutRole());
  }

  if (signUpErr) {
    if (/already registered|already exists|User already registered/i.test(signUpErr.message)) {
      output.notes.push('Account already exists');
    } else {
      output.notes.push(`Sign-up issue: ${signUpErr.message}`);
    }
  } else {
    output.created = Boolean(signUpData?.user?.id);
    output.notes.push(output.created ? 'Account created' : 'Sign-up returned no user id');
  }

  await supabase.auth.signOut();

  const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
    email: account.email,
    password: account.password,
  });

  if (signInErr) {
    output.notes.push(`Login failed: ${signInErr.message}`);
    return output;
  }

  output.canLogin = true;
  output.notes.push('Login success');

  const { data: profileData, error: profileErr } = await supabase
    .from('profiles')
    .select('role, name, email')
    .eq('id', signInData.user.id)
    .single();

  if (profileErr) {
    output.notes.push(`Profile lookup failed: ${profileErr.message}`);
  } else {
    output.profileRole = profileData?.role || null;
    output.notes.push(`Profile role=${output.profileRole}`);

    if (output.profileRole !== account.role) {
      const { error: roleUpdateErr } = await supabase
        .from('profiles')
        .update({ role: account.role, name: account.name })
        .eq('id', signInData.user.id);

      if (roleUpdateErr) {
        output.notes.push(`Role update failed: ${roleUpdateErr.message}`);
      } else {
        const { data: updatedProfile, error: updatedProfileErr } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', signInData.user.id)
          .single();

        if (updatedProfileErr) {
          output.notes.push(`Role verify failed: ${updatedProfileErr.message}`);
        } else {
          output.profileRole = updatedProfile?.role || output.profileRole;
          output.notes.push(`Profile role updated to ${output.profileRole}`);
        }
      }
    }
  }

  await supabase.auth.signOut();
  return output;
}

async function main() {
  console.log('Creating CoachPro login accounts...');
  console.log(`Supabase URL: ${supabaseUrl}`);
  console.log(`Mode: ${adminClient ? 'admin API' : 'public signup'}`);

  const results = [];
  for (const account of accounts) {
    const result = adminClient
      ? await ensureAccountViaAdmin(account)
      : await ensureAccount(account);
    results.push(result);
    const status = result.canLogin ? 'READY' : 'NOT READY';
    console.log(`- ${account.role.toUpperCase()}: ${status} (${account.email})`);
  }

  if (adminClient) {
    const bootstrap = await ensureDomainData(results);
    console.log(`\nBootstrap: ${bootstrap.ok ? 'OK' : 'FAILED'} - ${bootstrap.message}`);
    if (!bootstrap.ok) {
      process.exitCode = 2;
    }
  }

  console.log('\nCredentials:');
  for (const r of results) {
    console.log(`${r.role}: ${r.email} | ${r.password}`);
  }

  console.log('\nDetails:');
  console.log(JSON.stringify(results, null, 2));

  const loginReadyCount = results.filter((r) => r.canLogin).length;
  if (loginReadyCount !== results.length) {
    process.exitCode = 2;
  }
}

main().catch((err) => {
  console.error('Account creation script failed:', err.message);
  process.exit(1);
});
