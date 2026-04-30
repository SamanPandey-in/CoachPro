import { BadgePlus, BookOpen, Sparkles } from 'lucide-react';
import PlaceholderPage from '../../shared/components/PlaceholderPage';

export default function BatchesPage() {
  return (
    <PlaceholderPage
      title="Batches"
      description="Plan classes, assign teachers, and keep schedules easy to scan."
      actions={<button className="btn-primary"><BadgePlus className="w-4 h-4" /> Add Batch</button>}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="metric-card">
          <BookOpen className="w-5 h-5 text-brand-600 mb-3" />
          <p className="text-sm font-semibold text-surface-900">Schedule view</p>
          <p className="text-sm text-surface-500 mt-1">See timings, rooms, and capacity at a glance.</p>
        </div>
        <div className="metric-card">
          <Sparkles className="w-5 h-5 text-gold mb-3" />
          <p className="text-sm font-semibold text-surface-900">Teacher assignment</p>
          <p className="text-sm text-surface-500 mt-1">Attach a teacher and subject without losing context.</p>
        </div>
        <div className="metric-card">
          <BookOpen className="w-5 h-5 text-success mb-3" />
          <p className="text-sm font-semibold text-surface-900">Capacity tracking</p>
          <p className="text-sm text-surface-500 mt-1">Keep batch strength under control before it becomes a problem.</p>
        </div>
      </div>
    </PlaceholderPage>
  );
}
