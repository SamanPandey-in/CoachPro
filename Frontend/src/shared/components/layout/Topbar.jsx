import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../features/auth/authSlice';
import { Bell, User } from 'lucide-react';

export default function Topbar() {
  const user = useSelector(selectCurrentUser);

  return (
    <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-surface-900">CoachOps</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-surface-600 hover:bg-surface-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-surface-200">
          <div className="text-right">
            <p className="text-sm font-medium text-surface-900">{user?.name}</p>
            <p className="text-xs text-surface-500 capitalize">{user?.role}</p>
          </div>
          <div className="w-9 h-9 bg-brand-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
            {user?.name?.[0]?.toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
