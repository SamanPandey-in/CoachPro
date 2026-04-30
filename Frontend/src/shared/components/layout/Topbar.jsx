import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../features/auth/authSlice';
import { Bell, Sparkles } from 'lucide-react';

export default function Topbar() {
  const user = useSelector(selectCurrentUser);
  const currentTime = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <header className="h-16 bg-white/55 border-b border-white/40 flex items-center justify-between px-6 shrink-0 backdrop-blur-3xl shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-white/50 bg-white/65 px-3 py-1.5 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-surface-500">Live</span>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-surface-900">CoachOps</h2>
          <p className="text-xs text-surface-500">Updated {currentTime}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2.5 text-surface-600 hover:bg-white/65 rounded-2xl transition-all duration-200 active:scale-[0.96] backdrop-blur-xl border border-white/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.68)]">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-white/40">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-surface-900 flex items-center gap-1 justify-end">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              {user?.name}
            </p>
            <p className="text-xs text-surface-500 capitalize">{user?.role}</p>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium text-white shadow-lg shadow-brand-500/20 ring-1 ring-white/25"
            style={{ background: 'linear-gradient(135deg, #60A5FA 0%, #1D4ED8 55%, #172554 100%)' }}
          >
            {user?.name?.[0]?.toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
