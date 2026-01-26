import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppProviders from './AppProviders';
import { withAuth } from './hoc/withAuth';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Lazy load pages for better performance
const Landing = lazy(() => import('./pages/Landing/Landing'));
const Login = lazy(() => import('./pages/Login/Login'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const AdminStudents = lazy(() => import('./pages/Admin/AdminStudents'));
const AdminTeachers = lazy(() => import('./pages/Admin/AdminTeachers'));
const AdminAnalytics = lazy(() => import('./pages/Admin/AdminAnalytics'));
const AdminAttendance = lazy(() => import('./pages/Admin/AdminAttendance'));
const AdminTestsManagement = lazy(() => import('./pages/Admin/AdminTestsManagement'));
const AdminAIInsights = lazy(() => import('./pages/Admin/AdminAIInsights'));
const AdminNotifications = lazy(() => import('./pages/Admin/AdminNotifications'));

// Teacher Pages
const TeacherDashboard = lazy(() => import('./pages/Teacher/TeacherDashboard'));
const TeacherMyStudents = lazy(() => import('./pages/Teacher/TeacherMyStudents'));
const TeacherUploadMarks = lazy(() => import('./pages/Teacher/TeacherUploadMarks'));
const TeacherAssignments = lazy(() => import('./pages/Teacher/TeacherAssignments'));
const TeacherLectures = lazy(() => import('./pages/Teacher/TeacherLectures'));
const TeacherTimetable = lazy(() => import('./pages/Teacher/TeacherTimetable'));
const TeacherNotifications = lazy(() => import('./pages/Teacher/TeacherNotifications'));

// Student Pages
const StudentDashboard = lazy(() => import('./pages/Student/StudentDashboard'));
const StudentPerformance = lazy(() => import('./pages/Student/StudentPerformance'));
const StudentAttendance = lazy(() => import('./pages/Student/StudentAttendance'));
const StudentTests = lazy(() => import('./pages/Student/StudentTests'));
const StudentAssignments = lazy(() => import('./pages/Student/StudentAssignments'));
const StudentProgress = lazy(() => import('./pages/Student/StudentProgress'));
const StudentNotifications = lazy(() => import('./pages/Student/StudentNotifications'));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen bg-dark flex items-center justify-center">
    <LoadingSpinner size="xl" />
  </div>
);

// Protected route wrappers
const ProtectedAdminDashboard = withAuth(AdminDashboard, ['admin']);
const ProtectedAdminStudents = withAuth(AdminStudents, ['admin']);
const ProtectedAdminTeachers = withAuth(AdminTeachers, ['admin']);
const ProtectedAdminAnalytics = withAuth(AdminAnalytics, ['admin']);
const ProtectedAdminAttendance = withAuth(AdminAttendance, ['admin']);
const ProtectedAdminTests = withAuth(AdminTestsManagement, ['admin']);
const ProtectedAdminAI = withAuth(AdminAIInsights, ['admin']);
const ProtectedAdminNotifications = withAuth(AdminNotifications, ['admin']);

const ProtectedTeacherDashboard = withAuth(TeacherDashboard, ['teacher']);
const ProtectedTeacherStudents = withAuth(TeacherMyStudents, ['teacher']);
const ProtectedTeacherMarks = withAuth(TeacherUploadMarks, ['teacher']);
const ProtectedTeacherAssignments = withAuth(TeacherAssignments, ['teacher']);
const ProtectedTeacherLectures = withAuth(TeacherLectures, ['teacher']);
const ProtectedTeacherTimetable = withAuth(TeacherTimetable, ['teacher']);
const ProtectedTeacherNotifications = withAuth(TeacherNotifications, ['teacher']);

const ProtectedStudentDashboard = withAuth(StudentDashboard, ['student']);
const ProtectedStudentPerformance = withAuth(StudentPerformance, ['student']);
const ProtectedStudentAttendance = withAuth(StudentAttendance, ['student']);
const ProtectedStudentTests = withAuth(StudentTests, ['student']);
const ProtectedStudentAssignments = withAuth(StudentAssignments, ['student']);
const ProtectedStudentProgress = withAuth(StudentProgress, ['student']);
const ProtectedStudentNotifications = withAuth(StudentNotifications, ['student']);

function App() {
  return (
    <AppProviders>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedAdminDashboard />} />
          <Route path="/admin/students" element={<ProtectedAdminStudents />} />
          <Route path="/admin/teachers" element={<ProtectedAdminTeachers />} />
          <Route path="/admin/analytics" element={<ProtectedAdminAnalytics />} />
          <Route path="/admin/attendance" element={<ProtectedAdminAttendance />} />
          <Route path="/admin/tests" element={<ProtectedAdminTests />} />
          <Route path="/admin/ai-insights" element={<ProtectedAdminAI />} />
          <Route path="/admin/notifications" element={<ProtectedAdminNotifications />} />

          {/* Teacher Routes */}
          <Route path="/teacher/dashboard" element={<ProtectedTeacherDashboard />} />
          <Route path="/teacher/students" element={<ProtectedTeacherStudents />} />
          <Route path="/teacher/upload-marks" element={<ProtectedTeacherMarks />} />
          <Route path="/teacher/assignments" element={<ProtectedTeacherAssignments />} />
          <Route path="/teacher/lectures" element={<ProtectedTeacherLectures />} />
          <Route path="/teacher/timetable" element={<ProtectedTeacherTimetable />} />
          <Route path="/teacher/notifications" element={<ProtectedTeacherNotifications />} />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={<ProtectedStudentDashboard />} />
          <Route path="/student/performance" element={<ProtectedStudentPerformance />} />
          <Route path="/student/attendance" element={<ProtectedStudentAttendance />} />
          <Route path="/student/tests" element={<ProtectedStudentTests />} />
          <Route path="/student/assignments" element={<ProtectedStudentAssignments />} />
          <Route path="/student/progress" element={<ProtectedStudentProgress />} />
          <Route path="/student/notifications" element={<ProtectedStudentNotifications />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppProviders>
  );
}

export default App;
