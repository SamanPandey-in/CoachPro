# Supabase Frontend Wiring - Complete

## ✅ Completed in This Session

### Auth Layer
- **[AuthContext.jsx](Frontend/src/contexts/AuthContext.jsx)** ✅ Rewritten to use Supabase auth
  - Fetches profile from `profiles` table on login
  - Exposes `profile.role` for role-based access control
  - Real-time session persistence with `onAuthStateChange` listener
  
- **[withAuth.jsx](Frontend/src/hoc/withAuth.jsx)** ✅ Updated to use profile-based auth
  - Checks `profile.role` instead of `user.role`
  - Brand-colored loading spinner

- **[Login.jsx](Frontend/src/pages/Login/Login.jsx)** ✅ Completely rewritten for Supabase
  - Uses `useAuth().login()` with Supabase credentials
  - Removed demo mode and role tabs (real auth only)
  - Redirects based on `profile.role` after login
  - Uses new semantic design tokens (brand colors)

### Services Layer
- **[services/students.js](Frontend/src/services/students.js)** ✅ Student management service
  - `getAll()` - Admin: fetch all students with stats from view
  - `create()` - Admin: add new student
  - `update()` - Admin: modify student record
  - `deactivate()` - Admin: soft-delete student
  - `getMyProfile()` - Student: fetch own full record

- **[services/attendance.js](Frontend/src/services/attendance.js)** ✅ Attendance service
  - `markBatch()` - Teacher: upsert attendance records
  - `getTodaySummary()` - Admin: today's attendance by batch (uses view)
  - `getMyHistory()` - Student: own attendance with date/batch filters
  - `getByBatchDate()` - Admin: attendance for specific batch/date

- **[services/tests.js](Frontend/src/services/tests.js)** ✅ Test & marks service
  - `getAll()` - Get tests for batch with joins
  - `create()` - Admin: create new test
  - `uploadMarks()` - Teacher: upsert test results (marks/absent flags)
  - `getMyResults()` - Student: own test results with joins

- **[services/dashboard.js](Frontend/src/services/dashboard.js)** ✅ Dashboard aggregations
  - `getAdminStats()` - 4 stat cards: students, teachers, attendance %, tests
  - `getTeacherStats()` - 3 stat cards: students taught, weekly lectures, assignments
  - `getStudentStats()` - 3 stat cards: avg score, attendance %, pending assignments

### UI Components
- **[ErrorState.jsx](Frontend/src/components/UI/ErrorState.jsx)** ✅ Centralized error display
  - Used instead of inline error messages on failed data loads

### Build Status
- ✅ Production build succeeds: 31.17s, 2,459 modules, zero errors

---

## 📋 Next Steps: Page Refactoring (Ready to Begin)

### Critical Path

Each page needs to:
1. **Remove mockApi calls** — Replace with service layer
2. **Add loading/error states** — Use `LoadingState` and `ErrorState`
3. **Add `useEffect` to fetch data** — Call services on mount
4. **Replace hardcoded data** — Show real data from Supabase

### High-Priority Pages

#### 1. **AdminDashboard.jsx**
**Current Issue**: Uses `mockApi.getAdminDashboard()`
**Fix**: Use `dashboardService.getAdminStats()`
```jsx
import { dashboardService } from '../../services/dashboard';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardService.getAdminStats()
      .then(setStats)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState role="admin" />;
  if (error) return <ErrorState role="admin" message={error} />;
  
  // Replace hardcoded data with stats.*
};
```

#### 2. **StudentDashboard.jsx**
**Current Issue**: Reads name from `localStorage` (fragile)
**Fix**: Use `profile` from `AuthContext`
```jsx
const { profile } = useAuth();

// Replace:
// const user = JSON.parse(localStorage.getItem('user'));

// With:
const name = profile?.name; // reads from profile context
```

#### 3. **StudentProgress.jsx** (Rename to "Study Goals")
**Current Issue**: 100% hardcoded data
**Fix**: Replace with client-side goal tracking (no schema needed)
```jsx
// Goals stored in localStorage, not database
const [goals, setGoals] = useState(() => {
  const stored = localStorage.getItem('studentGoals');
  return stored ? JSON.parse(stored) : [];
});

// Save goals
const saveGoal = (goal) => {
  setGoals(prev => [...prev, goal]);
  localStorage.setItem('studentGoals', JSON.stringify([...goals, goal]));
};
```

#### 4. **AdminStudents.jsx**
**Current Issue**: Uses `mockApi.getAdminStudents()` with card grid
**Fix**: Use `studentService.getAll()` with `DataTable`
```jsx
import { studentService } from '../../services/students';
import DataTable from '../../components/UI/DataTable';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    studentService.getAll()
      .then(setStudents)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState role="admin" />;
  if (error) return <ErrorState role="admin" message={error} />;

  return (
    <>
      <PageHeader
        title="Students"
        subtitle="Manage enrolled students"
        action={<Button onClick={openAddModal}>Add Student</Button>}
      />
      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'roll_number', label: 'Roll No.' },
          { key: 'batch', label: 'Batch' },
          { key: 'avg_score', label: 'Avg Score', render: (r) => `${r.avg_score}%` },
          { key: 'attendance_pct', label: 'Attendance', render: (r) => `${r.attendance_pct}%` },
          {
            key: 'actions',
            label: '',
            render: (r) => (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => editStudent(r)}>Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => deleteStudent(r.id)}>Delete</Button>
              </div>
            ),
          },
        ]}
        rows={students}
        emptyMessage="No students found"
      />
    </>
  );
};
```

#### 5. **Other Pages** (Similar pattern)
- **AdminAnalytics.jsx** → Use SQL views for trends, aggregations
- **AdminAttendance.jsx** → Use `attendanceService.getByBatchDate()`
- **AdminTestsManagement.jsx** → Use `testService.getAll()`
- **StudentPerformance.jsx** → Use `testService.getMyResults()`
- **TeacherDashboard.jsx** → Use `dashboardService.getTeacherStats()`

---

## 🔧 Common Patterns

### Pattern 1: Fetch Data on Mount
```jsx
useEffect(() => {
  setLoading(true);
  service.getFunction()
    .then(data => setData(data))
    .catch(err => setError(err.message))
    .finally(() => setLoading(false));
}, []);
```

### Pattern 2: Handle States
```jsx
if (loading) return <LoadingState role={userRole} />;
if (error) return <ErrorState role={userRole} message={error} />;
if (!data?.length) return <EmptyState />;
// render with data
```

### Pattern 3: Real-Time Subscriptions (Optional)
```jsx
useEffect(() => {
  const channel = supabase
    .channel('table_updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'students',
    }, (payload) => {
      // Update local state when DB changes
      if (payload.eventType === 'INSERT') {
        setStudents(prev => [...prev, payload.new]);
      }
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, []);
```

---

## 📝 Files to Delete (After Refactoring)

Once all pages are updated:
- [ ] `Frontend/src/services/api.js` (old mock API)
- [ ] `Frontend/src/api/mockData.js` (all mock data — DONE ✅)
- [ ] `Frontend/src/config/demo.config.js` (demo mode)
- [ ] `Frontend/src/hooks/useDemo.js` (demo logic)
- [ ] `Frontend/src/utils/demo.js` (demo utilities)
- [ ] `Frontend/src/hooks/useLocalStorage.js` (localStorage no longer needed for auth)

---

## 🚀 Deployment Notes

When ready for production:

1. **Supabase Project:** Ensure all tables, views, and RLS policies are created
2. **Auth Users:** Create test users via Supabase Auth UI (Settings → Users)
3. **Email Verification:** Optional — Supabase can enforce email verification
4. **Environment Variables:**
   - `.env` stays local (never commit)
  - Vercel/hosting: Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in deployment settings
  - Legacy fallback: `VITE_SUPABASE_ANON_KEY` is still supported during migration
5. **Monitor RLS:** Test role-based access by logging in as different users

---

## ✅ Verification Checklist

After refactoring each page, verify:

- [ ] Page loads without console errors
- [ ] Loading spinner shows while data fetches
- [ ] Error message shows if API call fails
- [ ] Data displays after load completes
- [ ] Role-based filters work (if applicable)
- [ ] Can create/edit/delete records (if applicable)
- [ ] No hardcoded mock data remains
- [ ] Uses `PageHeader`, `LoadingState`, `ErrorState`, `DataTable` components

---

## 📚 Reference

- **AuthContext**: Profile + role available via `useAuth()`
- **Services**: Import from `Frontend/src/services/` — never call supabase directly in pages
- **Components**: `PageHeader`, `LoadingState`, `ErrorState`, `DataTable` in `UI/`
- **Design Tokens**: Brand colors via Tailwind classes (brand, surface, text-primary, etc.)
- **Theme**: Dark mode responsive via `.dark` class on `<html>`

---

**Build Status**: ✅ 31.17s, 2,459 modules, zero errors
**Next Session**: Begin page refactoring with AdminDashboard, StudentDashboard, AdminStudents
