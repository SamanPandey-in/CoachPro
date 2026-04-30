export default function PlaceholderPage({ title, description, actions, children }) {
  return (
    <div className="page-shell">
      <div className="page-hero flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="hero-chip mb-3">CoachOps module</div>
          <h1 className="text-2xl font-semibold text-surface-900">{title}</h1>
          <p className="text-surface-500 text-sm mt-1 max-w-2xl">{description}</p>
        </div>
        {actions}
      </div>

      <div className="panel">
        {children || (
          <div className="empty-state">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4">
              •
            </div>
            <p className="text-sm font-medium text-surface-900">Nothing to show yet</p>
            <p className="mt-1 text-sm text-surface-500 max-w-md">This section is ready for real data, actions, and richer workflows once the next module lands.</p>
          </div>
        )}
      </div>
    </div>
  );
}