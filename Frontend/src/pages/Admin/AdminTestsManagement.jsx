import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import PageHeader from '../../components/UI/PageHeader';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import DataTable from '../../components/UI/DataTable';
import Modal from '../../components/UI/Modal';
import LoadingState from '../../components/UI/LoadingState';
import ErrorState from '../../components/UI/ErrorState';
import { testService } from '../../services/tests';
import { supabase } from '../../lib/supabase';

const initialTest = {
  title: '',
  subject_id: '',
  batch_id: '',
  test_date: '',
  max_marks: 100,
};

const AdminTestsManagement = () => {
  const [activeTab, setActiveTab] = useState('tests');
  const [tests, setTests] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState('');
  const [results, setResults] = useState([]);
  const [draftMarks, setDraftMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testForm, setTestForm] = useState(initialTest);

  const loadBase = async () => {
    try {
      setLoading(true);
      const [testsData, subjectRes, batchRes] = await Promise.all([
        testService.getAll(),
        supabase.from('subjects').select('id, name').order('name', { ascending: true }),
        supabase.from('batches').select('id, name').order('name', { ascending: true }),
      ]);
      if (subjectRes.error) throw subjectRes.error;
      if (batchRes.error) throw batchRes.error;
      setTests(testsData || []);
      setSubjects(subjectRes.data || []);
      setBatches(batchRes.data || []);
      if (testsData?.length) setSelectedTestId(String(testsData[0].id));
    } catch (err) {
      setError(err.message || 'Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBase();
  }, []);

  useEffect(() => {
    const loadResults = async () => {
      if (!selectedTestId) return;
      try {
        const res = await supabase
          .from('test_results')
          .select('id, marks, is_absent, student_id, students(roll_number, profiles(name))')
          .eq('test_id', Number(selectedTestId))
          .order('student_id', { ascending: true });
        if (res.error) throw res.error;
        setResults(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load test results');
      }
    };
    loadResults();
  }, [selectedTestId]);

  const saveTest = async () => {
    try {
      await testService.create({
        ...testForm,
        subject_id: Number(testForm.subject_id),
        batch_id: Number(testForm.batch_id),
        max_marks: Number(testForm.max_marks),
      });
      setIsModalOpen(false);
      setTestForm(initialTest);
      await loadBase();
    } catch (err) {
      setError(err.message || 'Failed to create test');
    }
  };

  const saveOverrides = async () => {
    try {
      const updates = Object.entries(draftMarks).map(([id, marks]) => ({
        id: Number(id),
        marks: Number(marks),
      }));

      if (!updates.length) return;

      const res = await supabase.from('test_results').upsert(updates, { onConflict: 'id' });
      if (res.error) throw res.error;
      setDraftMarks({});
    } catch (err) {
      setError(err.message || 'Failed to override marks');
    }
  };

  const selectedTest = useMemo(() => tests.find((t) => String(t.id) === String(selectedTestId)), [tests, selectedTestId]);

  if (loading) return <LoadingState role="admin" />;
  if (error) return <ErrorState role="admin" message={error} />;

  return (
    <Layout role="admin">
      <div className="space-y-6">
        <PageHeader
          title="Tests & Marks"
          subtitle="Create tests and manage result overrides"
          action={<Button onClick={() => setIsModalOpen(true)}>Create Test</Button>}
        />

        <div className="flex gap-2">
          <Button variant={activeTab === 'tests' ? 'primary' : 'ghost'} onClick={() => setActiveTab('tests')}>Tests</Button>
          <Button variant={activeTab === 'results' ? 'primary' : 'ghost'} onClick={() => setActiveTab('results')}>Results</Button>
        </div>

        {activeTab === 'tests' ? (
          <Card>
            <DataTable
              columns={[
                { key: 'title', label: 'Title' },
                { key: 'subject', label: 'Subject', render: (r) => r.subjects?.name || '-' },
                { key: 'batch', label: 'Batch', render: (r) => r.batches?.name || '-' },
                { key: 'test_date', label: 'Date' },
                { key: 'max_marks', label: 'Max Marks' },
              ]}
              rows={tests}
              emptyMessage="No tests created yet"
            />
          </Card>
        ) : (
          <Card>
            <div className="mb-4 flex items-center gap-3">
              <select
                value={selectedTestId}
                onChange={(e) => setSelectedTestId(e.target.value)}
                className="h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
              >
                {tests.map((t) => (
                  <option key={t.id} value={t.id}>{t.title} ({t.test_date})</option>
                ))}
              </select>
              <div className="text-sm text-text-muted dark:text-text-muted-dark">
                Max marks: {selectedTest?.max_marks ?? '-'}
              </div>
            </div>

            <DataTable
              columns={[
                { key: 'roll', label: 'Roll No', render: (r) => r.students?.roll_number || '-' },
                { key: 'name', label: 'Name', render: (r) => r.students?.profiles?.name || '-' },
                {
                  key: 'marks',
                  label: 'Marks',
                  render: (r) => (
                    <input
                      type="number"
                      min="0"
                      max={selectedTest?.max_marks || 100}
                      value={draftMarks[r.id] ?? r.marks ?? ''}
                      onChange={(e) => setDraftMarks((p) => ({ ...p, [r.id]: e.target.value }))}
                      className="h-9 w-24 px-2 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
                    />
                  ),
                },
                { key: 'is_absent', label: 'Absent', render: (r) => (r.is_absent ? 'Yes' : 'No') },
              ]}
              rows={results}
              emptyMessage="No uploaded results for this test"
            />

            <div className="mt-4 flex justify-end">
              <Button onClick={saveOverrides}>Save Overrides</Button>
            </div>
          </Card>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Test">
          <div className="space-y-3">
            <input
              value={testForm.title}
              onChange={(e) => setTestForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Test title"
              className="w-full h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            />
            <select
              value={testForm.subject_id}
              onChange={(e) => setTestForm((p) => ({ ...p, subject_id: e.target.value }))}
              className="w-full h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select
              value={testForm.batch_id}
              onChange={(e) => setTestForm((p) => ({ ...p, batch_id: e.target.value }))}
              className="w-full h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            >
              <option value="">Select Batch</option>
              {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <input
              type="date"
              value={testForm.test_date}
              onChange={(e) => setTestForm((p) => ({ ...p, test_date: e.target.value }))}
              className="w-full h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            />
            <input
              type="number"
              min="1"
              value={testForm.max_marks}
              onChange={(e) => setTestForm((p) => ({ ...p, max_marks: e.target.value }))}
              placeholder="Max marks"
              className="w-full h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={saveTest} disabled={!testForm.title || !testForm.subject_id || !testForm.batch_id || !testForm.test_date}>Create</Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default AdminTestsManagement;
