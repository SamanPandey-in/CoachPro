import { useGetWeakStudentsQuery } from './analyticsApi';
import { AlertTriangle, Sparkles } from 'lucide-react';

export default function AnalyticsPage() {
  const { data, isLoading, isError } = useGetWeakStudentsQuery();
  const weakStudents = data?.data || [];

  return (
    <div className="page-shell">
      <div className="page-hero">
        <div className="hero-chip mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Pattern detection
        </div>
        <h1 className="text-2xl font-semibold text-surface-900">Analytics</h1>
        <p className="text-surface-500 text-sm mt-1">Weak student detection and performance signals</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="badge">At-risk students: {weakStudents.length}</span>
          <span className="badge">Attendance + marks combined</span>
          <span className="badge">Refreshes in real time</span>
        </div>
      </div>

      <div className="panel">
        <h2 className="text-base font-semibold text-surface-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          At-Risk Students
        </h2>
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 w-40 rounded-full skeleton" />
            <div className="h-16 rounded-2xl skeleton" />
            <div className="h-16 rounded-2xl skeleton" />
          </div>
        ) : isError ? (
          <p className="text-sm text-red-600">Unable to load analytics.</p>
        ) : weakStudents.length ? (
          <div className="space-y-3">
            {weakStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between rounded-2xl border border-surface-200 px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
                <div>
                  <p className="text-sm font-medium text-surface-900">{student.name}</p>
                  <p className="text-xs text-surface-500">Attendance {student.attendance_pct ?? 0}% · Marks {student.average_marks ?? 0}%</p>
                </div>
                <span className="badge-brand">Needs attention</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="text-sm font-medium text-surface-900">No weak students found</p>
            <p className="mt-1 text-sm text-surface-500">Attendance and marks are currently healthy across the selected scope.</p>
          </div>
        )}
      </div>
    </div>
  );
}