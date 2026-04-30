import { BookOpen } from 'lucide-react';

export default function BatchesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-surface-900">Batches</h1>
          <p className="text-surface-500 text-sm mt-1">Manage all batches and classes</p>
        </div>
        <button className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
          Add Batch
        </button>
      </div>

      <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-surface-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-surface-400" />
            </div>
            <p className="text-surface-600">No batches found</p>
            <p className="text-sm text-surface-500 mt-1">Create a batch to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
}
