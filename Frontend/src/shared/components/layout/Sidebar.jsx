import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectCurrentUser } from '../../../features/auth/authSlice';
import {
  LayoutDashboard, Users, BookOpen, ClipboardList,
  BarChart3, Bell, Settings, LogOut, GraduationCap, Fingerprint
} from 'lucide-react';

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/batches', label: 'Batches', icon: BookOpen },
  { to: '/admin/attendance', label: 'Attendance', icon: ClipboardList },
  { to: '/admin/tests', label: 'Tests & Marks', icon: GraduationCap },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/biometric', label: 'Biometric', icon: Fingerprint },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const TEACHER_NAV = [
  { to: '/teacher', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/teacher/batches', label: 'My Batches', icon: BookOpen },
  { to: '/teacher/attendance', label: 'Attendance', icon: ClipboardList },
  { to: '/teacher/marks', label: 'Marks Entry', icon: GraduationCap },
];

const PARENT_NAV = [
  { to: '/parent', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/parent/child-profile', label: 'Child Profile', icon: Users },
  { to: '/parent/attendance', label: 'Attendance', icon: ClipboardList },
  { to: '/parent/results', label: 'Results', icon: GraduationCap },
  { to: '/parent/notifications', label: 'Notifications', icon: Bell },
];

export default function Sidebar({ role = 'admin' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  const NAV_MAP = { admin: ADMIN_NAV, owner: ADMIN_NAV, super_admin: ADMIN_NAV, teacher: TEACHER_NAV, parent: PARENT_NAV };
  const nav = NAV_MAP[role] || ADMIN_NAV;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-surface-900 text-white flex flex-col shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-surface-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-white">CoachOps</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-surface-400 hover:bg-surface-700 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="border-t border-surface-700 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-sm font-medium">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-surface-400 truncate capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-surface-400 hover:text-white hover:bg-surface-700 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
