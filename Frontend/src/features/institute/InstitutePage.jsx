import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';
import { useGetInstituteQuery, useGetInstituteStatsQuery } from './instituteApi';
import { Building2, Sparkles } from 'lucide-react';

export default function InstitutePage() {
  const user = useSelector(selectCurrentUser);
  const instituteId = user?.institute_id;
  const { data: instituteData } = useGetInstituteQuery(instituteId, { skip: !instituteId });
  const { data: statsData } = useGetInstituteStatsQuery(instituteId, { skip: !instituteId });

  const institute = instituteData?.data;
  const stats = statsData?.data;

  return (
    <div className="page-shell">
      <div className="page-hero">
        <div className="hero-chip mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Tenant profile
        </div>
        <h1 className="text-2xl font-semibold text-surface-900">Institute</h1>
        <p className="text-surface-500 text-sm mt-1">View the current institute profile and summary stats</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel space-y-3">
          <h2 className="text-base font-semibold text-surface-900 flex items-center gap-2"><Building2 className="w-4 h-4 text-brand-600" /> Profile</h2>
          <p className="text-sm text-surface-600"><span className="font-medium text-surface-900">Name:</span> {institute?.name || '—'}</p>
          <p className="text-sm text-surface-600"><span className="font-medium text-surface-900">Phone:</span> {institute?.phone || '—'}</p>
          <p className="text-sm text-surface-600"><span className="font-medium text-surface-900">Email:</span> {institute?.email || '—'}</p>
          <p className="text-sm text-surface-600"><span className="font-medium text-surface-900">Address:</span> {institute?.address || '—'}</p>
        </div>

        <div className="panel space-y-3">
          <h2 className="text-base font-semibold text-surface-900">Stats</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="metric-card p-4"><p className="text-xs text-surface-500">Students</p><p className="text-xl font-semibold text-surface-900">{stats?.total_students ?? 0}</p></div>
            <div className="metric-card p-4"><p className="text-xs text-surface-500">Batches</p><p className="text-xl font-semibold text-surface-900">{stats?.total_batches ?? 0}</p></div>
            <div className="metric-card p-4"><p className="text-xs text-surface-500">Teachers</p><p className="text-xl font-semibold text-surface-900">{stats?.total_teachers ?? 0}</p></div>
            <div className="metric-card p-4"><p className="text-xs text-surface-500">Parents</p><p className="text-xl font-semibold text-surface-900">{stats?.total_parents ?? 0}</p></div>
            <div className="metric-card p-4"><p className="text-xs text-surface-500">Devices</p><p className="text-xl font-semibold text-surface-900">{stats?.total_devices ?? 0}</p></div>
            <div className="metric-card p-4"><p className="text-xs text-surface-500">Tests</p><p className="text-xl font-semibold text-surface-900">{stats?.total_tests ?? 0}</p></div>
          </div>
          <div className="metric-card p-4"><p className="text-xs text-surface-500">Reports</p><p className="text-xl font-semibold text-surface-900">{stats?.total_reports ?? 0}</p></div>
        </div>
      </div>
    </div>
  );
}