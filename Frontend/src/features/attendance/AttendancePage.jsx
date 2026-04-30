import { BadgeCheck, ClipboardList, Sparkles } from 'lucide-react';
import PlaceholderPage from '../../shared/components/PlaceholderPage';

export default function AttendancePage() {
  return (
    <PlaceholderPage
      title="Attendance"
      description="Track daily attendance and quickly spot gaps with a clear working surface."
      actions={<button className="btn-primary"><BadgeCheck className="w-4 h-4" /> Mark Attendance</button>}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="metric-card">
          <ClipboardList className="w-5 h-5 text-brand-600 mb-3" />
          <p className="text-sm font-semibold text-surface-900">Daily marking</p>
          <p className="text-sm text-surface-500 mt-1">Open a batch, mark present, absent, late, or excused in one pass.</p>
        </div>
        <div className="metric-card">
          <BadgeCheck className="w-5 h-5 text-success mb-3" />
          <p className="text-sm font-semibold text-surface-900">Biometric sync</p>
          <p className="text-sm text-surface-500 mt-1">Manual overrides stay easy when the device needs correction.</p>
        </div>
        <div className="metric-card">
          <Sparkles className="w-5 h-5 text-gold mb-3" />
          <p className="text-sm font-semibold text-surface-900">Visibility</p>
          <p className="text-sm text-surface-500 mt-1">Heatmaps and summaries help identify patterns early.</p>
        </div>
      </div>
    </PlaceholderPage>
  );
}
