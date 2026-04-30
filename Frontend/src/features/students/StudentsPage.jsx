import { BadgePlus, Sparkles, Users } from 'lucide-react';
import PlaceholderPage from '../../shared/components/PlaceholderPage';

export default function StudentsPage() {
  return (
    <PlaceholderPage
      title="Students"
      description="Manage student profiles, enrollment, and parent links from one place."
      actions={<button className="btn-primary"><BadgePlus className="w-4 h-4" /> Add Student</button>}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="metric-card">
          <Users className="w-5 h-5 text-brand-600 mb-3" />
          <p className="text-sm font-semibold text-surface-900">Profiles</p>
          <p className="text-sm text-surface-500 mt-1">Searchable student records with attendance and marks context.</p>
        </div>
        <div className="metric-card">
          <Sparkles className="w-5 h-5 text-gold mb-3" />
          <p className="text-sm font-semibold text-surface-900">Parent linking</p>
          <p className="text-sm text-surface-500 mt-1">Connect parents and guardians with clear primary-contact control.</p>
        </div>
        <div className="metric-card">
          <Users className="w-5 h-5 text-success mb-3" />
          <p className="text-sm font-semibold text-surface-900">Enrollment flow</p>
          <p className="text-sm text-surface-500 mt-1">Add students to batches without leaving the screen.</p>
        </div>
      </div>
    </PlaceholderPage>
  );
}
