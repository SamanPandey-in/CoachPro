import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated } from './features/auth/authSlice';
import { AuthGuard } from './features/auth/authGuard';
import AdminLayout from './shared/components/layout/AdminLayout';
import LoginPage from './features/auth/pages/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import StudentsPage from './features/students/StudentsPage';
import BatchesPage from './features/batches/BatchesPage';
import AttendancePage from './features/attendance/AttendancePage';
import TestsPage from './features/tests/TestsPage';

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
      </Route>

      {/* Teacher Routes */}
      <Route
        path="/teacher/*"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
      </Route>

      {/* Parent Routes */}
      <Route
        path="/parent/*"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
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
