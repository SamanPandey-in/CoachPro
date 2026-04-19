import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCheck, BarChart3, Calendar,
  FileText, BookOpen, ClipboardList, TrendingUp, Bell,
  Award, GraduationCap, LogOut, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const NAV = {
  admin: [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Students', icon: Users, path: '/admin/students' },
    { name: 'Teachers', icon: UserCheck, path: '/admin/teachers' },
    { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { name: 'Attendance', icon: Calendar, path: '/admin/attendance' },
    { name: 'Tests & Marks', icon: FileText, path: '/admin/tests' },
    { name: 'Notifications', icon: Bell, path: '/admin/notifications' },
  ],
  teacher: [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/teacher/dashboard' },
    { name: 'My Students', icon: Users, path: '/teacher/students' },
    { name: 'Upload Marks', icon: Award, path: '/teacher/upload-marks' },
    { name: 'Assignments', icon: ClipboardList, path: '/teacher/assignments' },
    { name: 'Lectures', icon: BookOpen, path: '/teacher/lectures' },
    { name: 'Timetable', icon: Calendar, path: '/teacher/timetable' },
    { name: 'Notifications', icon: Bell, path: '/teacher/notifications' },
  ],
  student: [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
    { name: 'My Results', icon: TrendingUp, path: '/student/performance' },
    { name: 'Attendance', icon: Calendar, path: '/student/attendance' },
    { name: 'Assignments', icon: ClipboardList, path: '/student/assignments' },
    { name: 'Study Goals', icon: Award, path: '/student/progress' },
    { name: 'Notifications', icon: Bell, path: '/student/notifications' },
  ],
};

const Sidebar = ({ role }) => {
  const items = NAV[role] || [];
  const { logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-60 bg-surface dark:bg-surface-dark border-r border-border dark:border-border-dark h-screen sticky top-0 flex flex-col">
      <div className="px-5 py-5 border-b border-border dark:border-border-dark">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
            CoachPro
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-0.5">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-colors duration-150
                  ${isActive
                    ? 'bg-brand-muted dark:bg-brand-muted-dark text-brand dark:text-brand-light'
                    : 'text-text-muted dark:text-text-muted-dark hover:bg-border dark:hover:bg-border-dark hover:text-text-primary dark:hover:text-text-primary-dark'
                  }
                `}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-3 py-4 border-t border-border dark:border-border-dark space-y-1">
        <button
          onClick={toggle}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted dark:text-text-muted-dark hover:bg-border dark:hover:bg-border-dark transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-danger dark:text-danger-dark hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
