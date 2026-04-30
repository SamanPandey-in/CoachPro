import { useGetWeakStudentsQuery } from './analyticsApi';

export default function AnalyticsPage() {
  const { data, isLoading, isError } = useGetWeakStudentsQuery();
  const weakStudents = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-surface-900">Analytics</h1>
        <p className="text-surface-500 text-sm mt-1">Weak student detection and performance signals</p>
      </div>

      <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-surface-900 mb-4">At-Risk Students</h2>
        {isLoading ? (
          <p className="text-sm text-surface-500">Loading analytics...</p>
        ) : isError ? (
          <p className="text-sm text-red-600">Unable to load analytics.</p>
        ) : weakStudents.length ? (
          <div className="space-y-3">
            {weakStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between rounded-lg border border-surface-200 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-surface-900">{student.name}</p>
                  <p className="text-xs text-surface-500">Attendance {student.attendance_pct ?? 0}% · Marks {student.average_marks ?? 0}%</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-surface-500">No weak students found.</p>
        )}
      </div>
    </div>
  );
}