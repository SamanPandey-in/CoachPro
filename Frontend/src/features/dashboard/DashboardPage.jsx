import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { Users, BookOpen, UserCheck, TrendingUp } from 'lucide-react';

function StatCard({ label, value, icon: Icon, color = 'blue' }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-surface-500">{label}</p>
          <p className="text-2xl font-bold text-surface-900 mt-1">{value ?? '—'}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const user = useSelector(selectCurrentUser);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-surface-900">Dashboard</h1>
        <p className="text-surface-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value="0" icon={Users} color="blue" />
        <StatCard label="Active Batches" value="0" icon={BookOpen} color="green" />
        <StatCard label="Today's Attendance" value="0%" icon={UserCheck} color="purple" />
        <StatCard label="Teachers" value="0" icon={TrendingUp} color="orange" />
      </div>

      <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-surface-900 mb-4">Welcome, {user?.name}!</h2>
        <p className="text-surface-600 text-sm">
          CoachOps is now configured per the master guide. Use the sidebar to navigate to students, batches, attendance, and other modules.
        </p>
      </div>
    </div>
  );
}
