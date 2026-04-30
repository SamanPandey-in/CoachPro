import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { Users, BookOpen, UserCheck, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { useGetDashboardStatsQuery } from './dashboardApi';

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
  const { data, isLoading, isError } = useGetDashboardStatsQuery();
  const stats = data?.data;

  return (
    <div className="page-shell">
      <div className="page-hero flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="hero-chip mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Live institute overview
          </div>
          <h1 className="text-2xl font-semibold text-surface-900">Dashboard</h1>
          <p className="text-surface-500 text-sm mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/students" className="btn-secondary">Open students <ArrowRight className="w-4 h-4" /></Link>
          <Link to="/admin/attendance" className="btn-primary">Mark attendance <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={isLoading ? '…' : stats?.total_students} icon={Users} color="blue" />
        <StatCard label="Active Batches" value={isLoading ? '…' : stats?.total_batches} icon={BookOpen} color="green" />
        <StatCard label="Today's Attendance" value={isLoading ? '…' : `${stats?.today_attendance_pct ?? 0}%`} icon={UserCheck} color="purple" />
        <StatCard label="Teachers" value={isLoading ? '…' : stats?.total_teachers} icon={TrendingUp} color="orange" />
      </div>

      <div className="panel">
        <h2 className="text-base font-semibold text-surface-900 mb-4">Welcome, {user?.name}!</h2>
        {isError ? (
          <p className="text-sm text-red-600">Unable to load dashboard statistics.</p>
        ) : (
          <div className="space-y-3 text-surface-600 text-sm">
            <p>CoachOps is now connected to the live backend. Use the sidebar to navigate to students, batches, attendance, tests, analytics, reports, and institute settings.</p>
            <p>Today’s attendance rate: <span className="font-medium text-surface-900">{stats?.today_attendance_pct ?? 0}%</span></p>
          </div>
        )}
      </div>
    </div>
  );
}
