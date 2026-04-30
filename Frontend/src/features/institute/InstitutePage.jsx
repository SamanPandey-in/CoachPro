import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';
import { useGetInstituteQuery, useGetInstituteStatsQuery } from './instituteApi';

export default function InstitutePage() {
  const user = useSelector(selectCurrentUser);
  const instituteId = user?.institute_id;
  const { data: instituteData } = useGetInstituteQuery(instituteId, { skip: !instituteId });
  const { data: statsData } = useGetInstituteStatsQuery(instituteId, { skip: !instituteId });

  const institute = instituteData?.data;
  const stats = statsData?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-surface-900">Institute</h1>
        <p className="text-surface-500 text-sm mt-1">View the current institute profile and summary stats</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-6 space-y-3">
          <h2 className="text-base font-semibold text-surface-900">Profile</h2>
          <p className="text-sm text-surface-600"><span className="font-medium text-surface-900">Name:</span> {institute?.name || '—'}</p>
          <p className="text-sm text-surface-600"><span className="font-medium text-surface-900">Phone:</span> {institute?.phone || '—'}</p>
          <p className="text-sm text-surface-600"><span className="font-medium text-surface-900">Email:</span> {institute?.email || '—'}</p>
          <p className="text-sm text-surface-600"><span className="font-medium text-surface-900">Address:</span> {institute?.address || '—'}</p>
        </div>

        <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-6 space-y-3">
          <h2 className="text-base font-semibold text-surface-900">Stats</h2>
          <p className="text-sm text-surface-600">Students: {stats?.total_students ?? 0}</p>
          <p className="text-sm text-surface-600">Batches: {stats?.total_batches ?? 0}</p>
          <p className="text-sm text-surface-600">Teachers: {stats?.total_teachers ?? 0}</p>
          <p className="text-sm text-surface-600">Parents: {stats?.total_parents ?? 0}</p>
          <p className="text-sm text-surface-600">Devices: {stats?.total_devices ?? 0}</p>
          <p className="text-sm text-surface-600">Tests: {stats?.total_tests ?? 0}</p>
          <p className="text-sm text-surface-600">Reports: {stats?.total_reports ?? 0}</p>
        </div>
      </div>
    </div>
  );
}