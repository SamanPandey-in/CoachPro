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
const readEnv = (name, fallback) => process.env[name] || fileEnv[name] || fallback;

const supabaseUrl = readEnv('VITE_SUPABASE_URL');
const supabaseKey = readEnv('VITE_SUPABASE_PUBLISHABLE_KEY') || readEnv('VITE_SUPABASE_ANON_KEY');
const adminEmail = readEnv('TEST_ADMIN_EMAIL');
const adminPassword = readEnv('TEST_ADMIN_PASSWORD');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY).');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const result = {
  connected: false,
  signedIn: false,
  role: null,
  seeded: {
    batch: null,
    subject: null,
    test: null,
    notification: null,
  },
  checks: [],
};

function addCheck(name, ok, details = '') {
  result.checks.push({ name, ok, details });
  const symbol = ok ? 'PASS' : 'FAIL';
  console.log(`[${symbol}] ${name}${details ? ` - ${details}` : ''}`);
}

async function selectOne(table, orderBy = 'id') {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order(orderBy, { ascending: false })
    .limit(1);

  if (error) throw error;
  return data?.[0] || null;
}

async function main() {
  console.log('--- Supabase Smoke Test ---');
  console.log(`Project URL: ${supabaseUrl}`);
  console.log(`Key type: ${supabaseKey.startsWith('sb_publishable_') ? 'publishable' : 'legacy anon'}`);

  const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
  addCheck('Supabase reachable', !sessionErr, sessionErr?.message || 'auth session endpoint responded');
  result.connected = !sessionErr;

  if (!adminEmail || !adminPassword) {
    addCheck('Admin credentials configured', false, 'Set TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD in Frontend/.env');
    console.log('\nSkipping write/seed checks because admin credentials are missing.');
    console.log('Add TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD and rerun npm run smoke:supabase.');
    process.exitCode = 2;
    return;
  }

  const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });

  if (signInErr) {
    addCheck('Admin sign-in', false, signInErr.message);
    process.exitCode = 1;
    return;
  }

  addCheck('Admin sign-in', true, signInData.user?.email || 'signed in');
  result.signedIn = true;

  const { data: myProfile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', signInData.user.id)
    .single();

  if (profileErr) {
    addCheck('Read own profile', false, profileErr.message);
    process.exitCode = 1;
    return;
  }

  result.role = myProfile.role;
  addCheck('Read own profile', true, `role=${myProfile.role}`);

  if (myProfile.role !== 'admin') {
    addCheck('Admin role required for seed', false, `current role=${myProfile.role}`);
    process.exitCode = 1;
    return;
  }

  const batchName = 'Smoke Batch 2026';
  const subjectName = 'Smoke Mathematics';
  const testTitle = 'Smoke Weekly Test';

  const { data: batchRows, error: batchErr } = await supabase
    .from('batches')
    .upsert(
      {
        name: batchName,
        course: 'Smoke Verification Course',
        start_date: '2026-04-01',
        end_date: '2026-12-31',
      },
      { onConflict: 'name' }
    )
    .select();

  if (batchErr) {
    addCheck('Seed batch', false, batchErr.message);
    process.exitCode = 1;
    return;
  }

  const batch = batchRows?.[0] || (await selectOne('batches'));
  result.seeded.batch = batch?.id || null;
  addCheck('Seed batch', !!batch, batch ? `id=${batch.id}` : 'batch missing after upsert');

  const { data: subjectRows, error: subjectErr } = await supabase
    .from('subjects')
    .upsert(
      {
        name: subjectName,
        batch_id: batch.id,
        teacher_id: null,
      },
      { onConflict: 'name,batch_id' }
    )
    .select();

  if (subjectErr) {
    addCheck('Seed subject', false, subjectErr.message);
    process.exitCode = 1;
    return;
  }

  const subject = subjectRows?.[0] || (await selectOne('subjects'));
  result.seeded.subject = subject?.id || null;
  addCheck('Seed subject', !!subject, subject ? `id=${subject.id}` : 'subject missing after upsert');

  const { data: existingTest, error: existingTestErr } = await supabase
    .from('tests')
    .select('*')
    .eq('title', testTitle)
    .eq('batch_id', batch.id)
    .limit(1);

  if (existingTestErr) {
    addCheck('Check existing test', false, existingTestErr.message);
    process.exitCode = 1;
    return;
  }

  let test = existingTest?.[0] || null;
  if (!test) {
    const { data: insertedTest, error: testErr } = await supabase
      .from('tests')
      .insert({
        title: testTitle,
        subject_id: subject.id,
        batch_id: batch.id,
        test_date: '2026-04-19',
        max_marks: 100,
        conducted_by: null,
      })
      .select()
      .single();

    if (testErr) {
      addCheck('Seed test', false, testErr.message);
      process.exitCode = 1;
      return;
    }
    test = insertedTest;
  }

  result.seeded.test = test?.id || null;
  addCheck('Seed test', !!test, test ? `id=${test.id}` : 'test not found/inserted');

  const noticeTitle = 'Smoke Verification Notification';
  const { data: existingNotice, error: noticeFetchErr } = await supabase
    .from('notifications')
    .select('*')
    .eq('title', noticeTitle)
    .limit(1);

  if (noticeFetchErr) {
    addCheck('Check existing notification', false, noticeFetchErr.message);
    process.exitCode = 1;
    return;
  }

  let notification = existingNotice?.[0] || null;
  if (!notification) {
    const { data: insertedNotice, error: noticeInsertErr } = await supabase
      .from('notifications')
      .insert({
        title: noticeTitle,
        body: 'Seeded by smoke test to verify notifications pipeline.',
        sent_by: signInData.user.id,
        target_role: null,
        target_batch_id: null,
      })
      .select()
      .single();

    if (noticeInsertErr) {
      addCheck('Seed notification', false, noticeInsertErr.message);
      process.exitCode = 1;
      return;
    }
    notification = insertedNotice;
  }

  result.seeded.notification = notification?.id || null;
  addCheck('Seed notification', !!notification, notification ? `id=${notification.id}` : 'notification not found/inserted');

  const { error: signOutErr } = await supabase.auth.signOut();
  addCheck('Sign out', !signOutErr, signOutErr?.message || 'ok');

  console.log('\nSmoke summary:');
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error('Smoke test crashed:', err.message);
  process.exit(1);
});
