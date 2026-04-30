import { useState } from 'react';
import { useGenerateStudentReportMutation, useGetStudentReportsQuery } from './reportsApi';
import { FileText, Sparkles, Download } from 'lucide-react';
import toast from 'react-hot-toast';

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
    try {
      await toast.promise(generateReport({ studentId, month, year }).unwrap(), {
        loading: 'Generating report...',
        success: 'Report generated',
        error: 'Could not generate report',
      });
    } catch {
      // toast already shown
    }
  };

  return (
    <div className="page-shell">
      <div className="page-hero flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="hero-chip mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Parent-ready summaries
          </div>
          <h1 className="text-2xl font-semibold text-surface-900">Reports</h1>
          <p className="text-surface-500 text-sm mt-1">Generate and review student reports</p>
        </div>
        <button className="btn-secondary"><Download className="w-4 h-4" /> Export later</button>
      </div>

      <div className="panel">
        <form className="grid gap-3 md:grid-cols-4" onSubmit={handleGenerate}>
          <input className="input-field" placeholder="Student ID" value={studentId} onChange={(event) => setStudentId(event.target.value)} />
          <input className="input-field" placeholder="Month" value={month} onChange={(event) => setMonth(event.target.value)} />
          <input className="input-field" placeholder="Year" value={year} onChange={(event) => setYear(event.target.value)} />
          <button className="btn-primary justify-center" disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate report'}
          </button>
        </form>
      </div>

      <div className="panel">
        <h2 className="text-base font-semibold text-surface-900 mb-4">Saved Reports</h2>
        {!studentId ? (
          <div className="empty-state">
            <FileText className="w-5 h-5 text-brand-600 mb-3" />
            <p className="text-sm font-medium text-surface-900">Enter a student ID</p>
            <p className="mt-1 text-sm text-surface-500">Once you generate a report, this area will show the saved history.</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            <div className="h-4 w-40 rounded-full skeleton" />
            <div className="h-16 rounded-2xl skeleton" />
            <div className="h-16 rounded-2xl skeleton" />
          </div>
        ) : reports.length ? (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="rounded-2xl border border-surface-200 px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
                <p className="text-sm font-medium text-surface-900">{report.report_type}</p>
                <p className="text-xs text-surface-500 mt-1">Generated {new Date(report.generated_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FileText className="w-5 h-5 text-brand-600 mb-3" />
            <p className="text-sm font-medium text-surface-900">No reports found</p>
            <p className="mt-1 text-sm text-surface-500">Generate the first monthly report to populate this panel.</p>
          </div>
        )}
      </div>
    </div>
  );
}