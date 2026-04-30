import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated } from './features/auth/authSlice';
import { AuthGuard } from './features/auth/authGuard';
import AdminLayout from './shared/components/layout/AdminLayout';
import TeacherLayout from './shared/components/layout/TeacherLayout';
import ParentLayout from './shared/components/layout/ParentLayout';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import UnauthorizedPage from './features/auth/pages/UnauthorizedPage';
import DashboardPage from './features/dashboard/DashboardPage';
import StudentsPage from './features/students/StudentsPage';
import BatchesPage from './features/batches/BatchesPage';
import AttendancePage from './features/attendance/AttendancePage';
import TestsPage from './features/tests/TestsPage';
import AnalyticsPage from './features/analytics/AnalyticsPage';
import ReportsPage from './features/reports/ReportsPage';
import BiometricPage from './features/biometric/BiometricPage';
import InstitutePage from './features/institute/InstitutePage';
import TeacherDashboardPage from './features/teacher/pages/TeacherDashboardPage';
import TeacherAttendancePage from './features/teacher/pages/TeacherAttendancePage';
import TeacherBatchesPage from './features/teacher/pages/TeacherBatchesPage';
import TeacherMarksPage from './features/teacher/pages/TeacherMarksPage';
import ParentDashboardPage from './features/parent/pages/ParentDashboardPage';
import ParentChildProfilePage from './features/parent/pages/ParentChildProfilePage';
import ParentAttendancePage from './features/parent/pages/ParentAttendancePage';
import ParentResultsPage from './features/parent/pages/ParentResultsPage';
import ParentNotificationsPage from './features/parent/pages/ParentNotificationsPage';

function ProtectedRoute({ children, allowedRoles }) {
  return (
    <AuthGuard allowedRoles={allowedRoles}>
      {children}
    </AuthGuard>
  );
}

function AppContent() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  // Redirect authenticated users to their dashboard based on role
  if (isAuthenticated && location.pathname === '/') {
    if (['admin', 'owner', 'super_admin'].includes(user?.role)) {
      return <Navigate to="/admin" replace />;
    } else if (user?.role === 'teacher') {
      return <Navigate to="/teacher" replace />;
    } else if (user?.role === 'parent') {
      return <Navigate to="/parent" replace />;
    }
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/" element={isAuthenticated ? <Navigate to="/admin" replace /> : <Navigate to="/login" replace />} />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin', 'owner', 'super_admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="batches" element={<BatchesPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="tests" element={<TestsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="biometric" element={<BiometricPage />} />
        <Route path="institute" element={<InstitutePage />} />
        <Route path="settings" element={<InstitutePage />} />
      </Route>

      {/* Teacher Routes */}
      <Route
        path="/teacher/*"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TeacherDashboardPage />} />
        <Route path="batches" element={<TeacherBatchesPage />} />
        <Route path="attendance" element={<TeacherAttendancePage />} />
        <Route path="marks" element={<TeacherMarksPage />} />
      </Route>

      {/* Parent Routes */}
      <Route
        path="/parent/*"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ParentDashboardPage />} />
        <Route path="child-profile" element={<ParentChildProfilePage />} />
        <Route path="attendance" element={<ParentAttendancePage />} />
        <Route path="results" element={<ParentResultsPage />} />
        <Route path="notifications" element={<ParentNotificationsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
