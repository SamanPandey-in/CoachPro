import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../features/auth/authSlice';
import { Bell, Sparkles } from 'lucide-react';

export default function Topbar() {
  const user = useSelector(selectCurrentUser);
  const currentTime = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <header className="h-16 bg-white/80 border-b border-surface-200 flex items-center justify-between px-6 shrink-0 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-surface-200 bg-surface-50 px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-surface-500">Live</span>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-surface-900">CoachOps</h2>
          <p className="text-xs text-surface-500">Updated {currentTime}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2.5 text-surface-600 hover:bg-surface-100 rounded-xl transition-all duration-200 active:scale-[0.96]">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-surface-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-surface-900 flex items-center gap-1 justify-end">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              {user?.name}
            </p>
            <p className="text-xs text-surface-500 capitalize">{user?.role}</p>
          </div>
          <div className="w-9 h-9 bg-linear-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-sm font-medium text-white shadow-lg shadow-brand-500/20">
            {user?.name?.[0]?.toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
