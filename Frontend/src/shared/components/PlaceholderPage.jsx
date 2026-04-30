export default function PlaceholderPage({ title, description, actions, children }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-surface-900">{title}</h1>
          <p className="text-surface-500 text-sm mt-1">{description}</p>
        </div>
        {actions}
      </div>

      <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-6">
        {children || (
          <div className="flex items-center justify-center py-12 text-sm text-surface-500">
            No data yet.
          </div>
        )}
      </div>
    </div>
  );
}