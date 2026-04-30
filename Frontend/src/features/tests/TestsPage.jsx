import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { useCreateTestMutation, useGetTestsQuery } from './testsApi';

export default function TestsPage() {
  const { data, isLoading } = useGetTestsQuery();
  const [createTest, { isLoading: creatingTest }] = useCreateTestMutation();
  const [form, setForm] = useState({ batch_id: '', title: '', test_date: '', max_marks: '100' });

  const tests = data?.data || [];

  const handleSubmit = async (event) => {
    event.preventDefault();
    await createTest({
      ...form,
      max_marks: Number(form.max_marks || 100),
    }).unwrap();
    setForm({ batch_id: '', title: '', test_date: '', max_marks: '100' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-surface-900">Tests & Marks</h1>
          <p className="text-surface-500 text-sm mt-1">Create tests and manage student marks</p>
        </div>
        <button className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
          Create Test
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form className="bg-white rounded-xl border border-surface-200 shadow-sm p-6 space-y-3" onSubmit={handleSubmit}>
          <h2 className="text-base font-semibold text-surface-900">Create Test</h2>
          <input className="input-field" placeholder="Batch ID" value={form.batch_id} onChange={(event) => setForm((current) => ({ ...current, batch_id: event.target.value }))} />
          <input className="input-field" placeholder="Test title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
          <input className="input-field" type="date" value={form.test_date} onChange={(event) => setForm((current) => ({ ...current, test_date: event.target.value }))} />
          <input className="input-field" type="number" placeholder="Max marks" value={form.max_marks} onChange={(event) => setForm((current) => ({ ...current, max_marks: event.target.value }))} />
          <button className="btn-primary" disabled={creatingTest}>Save test</button>
        </form>

        <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-surface-900 mb-4">Recent Tests</h2>
          {isLoading ? (
            <p className="text-sm text-surface-500">Loading tests...</p>
          ) : tests.length ? (
            <div className="space-y-3">
              {tests.map((test) => (
                <div key={test.id} className="rounded-lg border border-surface-200 px-4 py-3">
                  <p className="text-sm font-medium text-surface-900">{test.title}</p>
                  <p className="text-xs text-surface-500 mt-1">{test.batch_name} · {test.test_date} · Max {test.max_marks}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-surface-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-6 h-6 text-surface-400" />
                </div>
                <p className="text-surface-600">No tests found</p>
                <p className="text-sm text-surface-500 mt-1">Create a test to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
