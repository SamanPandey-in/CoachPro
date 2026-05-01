import { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  Building2,
  CheckCircle2,
  Copy,
  Download,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  KeyRound,
  MessageSquare,
  Sparkles,
  Upload,
  UserPlus2,
  Users,
  CircleAlert,
} from 'lucide-react';
import { selectCurrentUser } from '../auth/authSlice';
import {
  useCreateInstituteUserMutation,
  useExportInstituteUsersMutation,
  useGetInstituteQuery,
  useGetInstituteStatsQuery,
  useGetInstituteUsersQuery,
  useImportInstituteUsersMutation,
} from './instituteApi';

const EMPTY_USER_FORM = {
  name: '',
  email: '',
  role: 'teacher',
  phone: '',
  password: '',
};

const EMPTY_IMPORT_FORM = {
  role: 'teacher',
  text: '',
};

const DOWNLOAD_CONTENT_TYPES = {
  csv: 'text/csv',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const roleLabel = (role) => {
  if (role === 'teacher') return 'Teacher';
  if (role === 'student') return 'Student';
  if (role === 'owner') return 'Owner';
  return role || 'Member';
};

export default function InstitutePage() {
  const user = useSelector(selectCurrentUser);
  const instituteId = user?.institute_id;
  const canManageUsers = ['owner', 'super_admin'].includes(user?.role);
  const [userForm, setUserForm] = useState(EMPTY_USER_FORM);
  const [importForm, setImportForm] = useState(EMPTY_IMPORT_FORM);
  const [selectedFile, setSelectedFile] = useState(null);
  const [createdCredential, setCreatedCredential] = useState(null);
  const [importResult, setImportResult] = useState(null);

  const { data: instituteData } = useGetInstituteQuery(instituteId, { skip: !instituteId });
  const { data: statsData } = useGetInstituteStatsQuery(instituteId, { skip: !instituteId });
  const { data: usersData, isLoading: usersLoading } = useGetInstituteUsersQuery(
    { instituteId, role: 'all' },
    { skip: !instituteId || !canManageUsers }
  );

  const [createUser, { isLoading: creatingUser }] = useCreateInstituteUserMutation();
  const [importUsers, { isLoading: importingUsers }] = useImportInstituteUsersMutation();
  const [exportUsers, { isLoading: exportingUsers }] = useExportInstituteUsersMutation();

  const institute = instituteData?.data;
  const stats = statsData?.data;
  const users = usersData?.data || [];
  const teacherCount = users.filter((entry) => entry.role === 'teacher').length;
  const studentCount = users.filter((entry) => entry.role === 'student').length;

  const handleCreateUser = async (event) => {
    event.preventDefault();
    if (!instituteId) return;

    try {
      const response = await toast.promise(
        createUser({ instituteId, ...userForm }).unwrap(),
        {
          loading: 'Creating login account...',
          success: 'User created',
          error: (error) => error?.data?.error?.message || 'Unable to create user',
        }
      );

      setCreatedCredential(response?.data || null);
      setUserForm(EMPTY_USER_FORM);
    } catch {
      // toast already shown
    }
  };

  const handleImportUsers = async (event) => {
    event.preventDefault();
    if (!instituteId) return;

    const formData = new FormData();
    formData.append('role', importForm.role);
    if (importForm.text.trim()) {
      formData.append('text', importForm.text);
    }
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      const response = await toast.promise(
        importUsers({ instituteId, formData }).unwrap(),
        {
          loading: 'Importing users...',
          success: 'Import complete',
          error: (error) => error?.data?.error?.message || 'Unable to import users',
        }
      );

      setImportResult(response?.data || null);
      setSelectedFile(null);
      setImportForm((current) => ({ ...current, text: '' }));
    } catch {
      // toast already shown
    }
  };

  const handleExportUsers = async (format) => {
    if (!instituteId) return;

    try {
      const blob = await toast.promise(
        exportUsers({ instituteId, format }).unwrap(),
        {
          loading: `Preparing ${format.toUpperCase()} export...`,
          success: `${format.toUpperCase()} export ready`,
          error: 'Unable to export users',
        }
      );

      downloadBlob(blob, `coachops-users.${format}`);
    } catch {
      // toast already shown
    }
  };

  return (
    <div className="page-shell">
      <div className="page-hero flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="hero-chip mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Owner control center
          </div>
          <h1 className="text-2xl font-semibold text-surface-900">Institute</h1>
          <p className="text-surface-500 text-sm mt-1">
            Manage the institute profile, issue logins, and keep user data moving between sheets, screenshots, and exported files.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="badge">Students: {stats?.total_students ?? 0}</span>
          <span className="badge">Teachers: {stats?.total_teachers ?? 0}</span>
          <span className="badge">Accounts: {users.length}</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="panel space-y-4">
          <h2 className="text-base font-semibold text-surface-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-600" /> Profile
          </h2>
          <p className="text-sm text-surface-600"><span className="font-medium text-surface-900">Name:</span> {institute?.name || '—'}</p>
          <p className="text-sm text-surface-600"><span className="font-medium text-surface-900">Phone:</span> {institute?.phone || '—'}</p>
          <p className="text-sm text-surface-600"><span className="font-medium text-surface-900">Email:</span> {institute?.email || '—'}</p>
          <p className="text-sm text-surface-600"><span className="font-medium text-surface-900">Address:</span> {institute?.address || '—'}</p>
          <div className="grid gap-3 sm:grid-cols-2 pt-2">
            <div className="metric-card p-4">
              <p className="text-xs text-surface-500">Live teachers</p>
              <p className="text-xl font-semibold text-surface-900">{teacherCount}</p>
            </div>
            <div className="metric-card p-4">
              <p className="text-xs text-surface-500">Live students</p>
              <p className="text-xl font-semibold text-surface-900">{studentCount}</p>
            </div>
          </div>
        </div>

        <div className="panel space-y-4">
          <h2 className="text-base font-semibold text-surface-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-600" /> User access
          </h2>
          <p className="text-sm text-surface-500">
            Owners can generate login accounts from one form or from imported files. Passwords are generated automatically when you leave them blank.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button className="btn-secondary justify-center" type="button" onClick={() => handleExportUsers('csv')} disabled={exportingUsers}>
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button className="btn-secondary justify-center" type="button" onClick={() => handleExportUsers('xlsx')} disabled={exportingUsers}>
              <FileSpreadsheet className="w-4 h-4" /> Export XLSX
            </button>
          </div>
          <div className="rounded-2xl border border-brand-200 bg-brand-50/70 p-4 text-sm text-brand-900">
            <p className="font-semibold flex items-center gap-2">
              <KeyRound className="w-4 h-4" /> Password pattern
            </p>
            <p className="mt-1">Spreadsheet and OCR imports use <span className="font-semibold">firstname@lastname</span> when first and last names are available.</p>
          </div>
        </div>
      </div>

      {canManageUsers ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <form className="panel space-y-4" onSubmit={handleCreateUser}>
            <div className="flex items-center gap-2">
              <div className="rounded-2xl bg-brand-50 p-2 text-brand-700">
                <UserPlus2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-surface-900">Create a single login</h2>
                <p className="text-sm text-surface-500">Add a teacher or student and generate the password automatically if you leave it blank.</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-surface-700">Name</label>
                <input
                  className="input-field"
                  value={userForm.name}
                  onChange={(event) => setUserForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Jane Doe"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-surface-700">Email</label>
                <input
                  className="input-field"
                  type="email"
                  value={userForm.email}
                  onChange={(event) => setUserForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="jane@school.com"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-surface-700">Role</label>
                <select
                  className="input-field"
                  value={userForm.role}
                  onChange={(event) => setUserForm((current) => ({ ...current, role: event.target.value }))}
                >
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-surface-700">Phone</label>
                <input
                  className="input-field"
                  value={userForm.phone}
                  onChange={(event) => setUserForm((current) => ({ ...current, phone: event.target.value }))}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-surface-700">Password override</label>
              <input
                className="input-field"
                value={userForm.password}
                onChange={(event) => setUserForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="Leave blank to auto-generate"
              />
            </div>

            <button className="btn-primary" type="submit" disabled={creatingUser}>
              <CheckCircle2 className="w-4 h-4" /> Create account
            </button>

            {createdCredential ? (
              <div className="rounded-2xl border border-success/20 bg-success/5 p-4 text-sm text-surface-700">
                <p className="font-semibold text-surface-900">Latest credentials</p>
                <p className="mt-1">{createdCredential.name} · {createdCredential.email}</p>
                <p className="mt-1 font-mono text-surface-900">Password: {createdCredential.temp_password}</p>
              </div>
            ) : null}
          </form>

          <form className="panel space-y-4" onSubmit={handleImportUsers}>
            <div className="flex items-center gap-2">
              <div className="rounded-2xl bg-brand-50 p-2 text-brand-700">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-surface-900">Import from sheet, screenshot, or text</h2>
                <p className="text-sm text-surface-500">Upload a CSV/XLSX file, drop a WhatsApp screenshot, or paste copied cells and messages.</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-surface-700">Default role</label>
                <select
                  className="input-field"
                  value={importForm.role}
                  onChange={(event) => setImportForm((current) => ({ ...current, role: event.target.value }))}
                >
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-surface-700">Upload file</label>
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-surface-300 bg-surface-50/80 px-4 py-3 text-sm text-surface-600 transition-all duration-200 hover:bg-white">
                  <span className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-brand-600" />
                    {selectedFile?.name || 'Choose CSV, XLSX, or screenshot'}
                  </span>
                  <ImageIcon className="w-4 h-4 text-surface-400" />
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx,.xls,image/*"
                    onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-surface-700">Paste copied cells, sheet text, or WhatsApp OCR text</label>
              <textarea
                className="input-field min-h-40"
                value={importForm.text}
                onChange={(event) => setImportForm((current) => ({ ...current, text: event.target.value }))}
                placeholder={
                  'name,email,role\nJohn Doe,john@school.com,teacher\nJane Smith,jane@school.com,student\n\nOr paste text copied from Google Sheets or a WhatsApp screenshot OCR.'
                }
              />
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-surface-500">
              <span className="badge"><FileText className="w-3.5 h-3.5" /> CSV/Excel</span>
              <span className="badge"><ImageIcon className="w-3.5 h-3.5" /> Screenshot OCR</span>
              <span className="badge"><MessageSquare className="w-3.5 h-3.5" /> WhatsApp text</span>
            </div>

            <button className="btn-primary" type="submit" disabled={importingUsers}>
              <Upload className="w-4 h-4" /> Import users
            </button>

            {importResult ? (
              <div className="space-y-3 rounded-2xl border border-brand-200 bg-brand-50/50 p-4 text-sm text-surface-700">
                <p className="font-semibold text-surface-900">Import summary</p>
                <p>Created: {importResult.summary?.created ?? 0} · Failed: {importResult.summary?.failed ?? 0}</p>
                {importResult.created?.length ? (
                  <div className="space-y-2">
                    {importResult.created.slice(0, 4).map((entry) => (
                      <div key={entry.id} className="rounded-xl border border-white/70 bg-white/80 p-3">
                        <p className="font-medium text-surface-900">{entry.name} <span className="text-surface-500">({roleLabel(entry.role)})</span></p>
                        <p className="text-xs text-surface-500">{entry.email}</p>
                        <p className="mt-1 font-mono text-surface-900">{entry.temp_password}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {importResult.errors?.length ? (
                  <div className="space-y-2 rounded-xl border border-warning/20 bg-warning/5 p-3">
                    <p className="font-medium text-surface-900 flex items-center gap-2"><CircleAlert className="w-4 h-4 text-warning" /> Import issues</p>
                    {importResult.errors.slice(0, 4).map((entry) => (
                      <p key={`${entry.row}-${entry.email}`} className="text-xs text-surface-600">Row {entry.row}: {entry.email || 'unknown'} · {entry.message}</p>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </form>
        </div>
      ) : (
        <div className="panel flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-surface-900">User management is owner-only</p>
            <p className="text-sm text-surface-500">This section stays hidden for teacher and parent roles to keep the app focused.</p>
          </div>
        </div>
      )}

      <div className="panel space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-surface-900">Current accounts</h2>
            <p className="text-sm text-surface-500">These are the active teacher and student accounts for the institute.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-surface-500">
            <span className="badge">Teachers: {teacherCount}</span>
            <span className="badge">Students: {studentCount}</span>
          </div>
        </div>

        {canManageUsers ? (
          usersLoading ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <div className="h-28 rounded-2xl skeleton" />
              <div className="h-28 rounded-2xl skeleton" />
              <div className="h-28 rounded-2xl skeleton" />
            </div>
          ) : users.length ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {users.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-surface-200 bg-white/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-surface-900">{entry.name}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-brand-600">{roleLabel(entry.role)}</p>
                    </div>
                    <button
                      type="button"
                      className="btn-ghost px-2 py-2 text-xs"
                      onClick={async () => {
                        await navigator.clipboard.writeText(`${entry.email}`);
                        toast.success('Email copied');
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-surface-600 break-all">{entry.email}</p>
                  <p className="text-xs text-surface-500">{entry.phone || 'No phone'} · {entry.is_active ? 'Active' : 'Inactive'}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Users className="w-5 h-5 text-brand-600 mb-3" />
              <p className="text-sm font-medium text-surface-900">No accounts yet</p>
              <p className="mt-1 text-sm text-surface-500">Create the first teacher or student account from the panel above.</p>
            </div>
          )
        ) : (
          <div className="empty-state">
            <Users className="w-5 h-5 text-brand-600 mb-3" />
            <p className="text-sm font-medium text-surface-900">Owner-only view</p>
            <p className="mt-1 text-sm text-surface-500">Ask an institute owner to issue accounts or import the spreadsheet on this screen.</p>
          </div>
        )}
      </div>
    </div>
  );
}
