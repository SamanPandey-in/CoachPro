import { useState } from 'react';
import { useGenerateStudentReportMutation, useGetStudentReportsQuery } from './reportsApi';

export default function ReportsPage() {
  const [studentId, setStudentId] = useState('');
  const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const { data, isLoading } = useGetStudentReportsQuery(studentId, { skip: !studentId });
  const [generateReport, { isLoading: isGenerating }] = useGenerateStudentReportMutation();

  const reports = data?.data || [];

  const handleGenerate = async (event) => {
    event.preventDefault();
    if (!studentId) return;
    await generateReport({ studentId, month, year }).unwrap();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-surface-900">Reports</h1>
        <p className="text-surface-500 text-sm mt-1">Generate and review student reports</p>
      </div>

      <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-6">
        <form className="grid gap-3 md:grid-cols-4" onSubmit={handleGenerate}>
          <input className="input-field" placeholder="Student ID" value={studentId} onChange={(event) => setStudentId(event.target.value)} />
          <input className="input-field" placeholder="Month" value={month} onChange={(event) => setMonth(event.target.value)} />
          <input className="input-field" placeholder="Year" value={year} onChange={(event) => setYear(event.target.value)} />
          <button className="btn-primary justify-center" disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate report'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-surface-900 mb-4">Saved Reports</h2>
        {!studentId ? (
          <p className="text-sm text-surface-500">Enter a student ID to load reports.</p>
        ) : isLoading ? (
          <p className="text-sm text-surface-500">Loading reports...</p>
        ) : reports.length ? (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="rounded-lg border border-surface-200 px-4 py-3">
                <p className="text-sm font-medium text-surface-900">{report.report_type}</p>
                <p className="text-xs text-surface-500 mt-1">Generated {new Date(report.generated_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-surface-500">No reports found.</p>
        )}
      </div>
    </div>
  );
}