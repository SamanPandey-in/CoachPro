import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import PageHeader from '../../components/UI/PageHeader';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingState from '../../components/UI/LoadingState';
import ErrorState from '../../components/UI/ErrorState';
import Modal from '../../components/UI/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { studentService } from '../../services/students';
import { assignmentService } from '../../services/assignments';

const StudentAssignments = () => {
  const { profile } = useAuth();
  const [student, setStudent] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [tab, setTab] = useState('all');
  const [selected, setSelected] = useState(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAssignments = async (studentObj) => {
    const rows = await assignmentService.getForStudent(studentObj.id, studentObj.batch_id);
    setAssignments(rows || []);
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const s = await studentService.getMyProfile(profile.id);
        setStudent(s);
        await loadAssignments(s);
      } catch (err) {
        setError(err.message || 'Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };

    if (profile?.id) load();
  }, [profile?.id]);

  const filtered = useMemo(() => {
    const now = new Date();
    return assignments.filter((a) => {
      const status = a.my_submission?.status || 'pending';
      const overdue = new Date(a.due_date) < now && status !== 'submitted';
      if (tab === 'all') return true;
      if (tab === 'pending') return status === 'pending' && !overdue;
      if (tab === 'submitted') return status === 'submitted';
      if (tab === 'overdue') return overdue;
      return true;
    });
  }, [assignments, tab]);

  const submitAssignment = async () => {
    if (!selected || !student) return;
    try {
      await assignmentService.submit(selected.id, student.id, submissionUrl);
      setSelected(null);
      setSubmissionUrl('');
      await loadAssignments(student);
    } catch (err) {
      setError(err.message || 'Failed to submit assignment');
    }
  };

  if (loading) return <LoadingState role="student" />;
  if (error) return <ErrorState role="student" message={error} />;

  return (
    <Layout role="student">
      <div className="space-y-6">
        <PageHeader title="Assignments" subtitle="All assignments for your batch with submit workflow" />

        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'submitted', 'overdue'].map((k) => (
            <Button key={k} variant={tab === k ? 'primary' : 'ghost'} onClick={() => setTab(k)}>
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 && (
            <Card><p className="text-sm text-text-muted dark:text-text-muted-dark">No assignments in this filter.</p></Card>
          )}
          {filtered.map((a) => {
            const status = a.my_submission?.status || 'pending';
            return (
              <Card key={a.id}>
                <h3 className="font-semibold mb-1">{a.title}</h3>
                <p className="text-sm text-text-muted dark:text-text-muted-dark mb-2">{a.subjects?.name || '-'}</p>
                <p className="text-sm mb-3">Due: {new Date(a.due_date).toLocaleString()}</p>
                <p className="text-xs text-text-muted dark:text-text-muted-dark mb-3">Status: {status}</p>
                {status !== 'submitted' && (
                  <Button size="sm" onClick={() => setSelected(a)}>Submit</Button>
                )}
              </Card>
            );
          })}
        </div>

        <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Submit Assignment">
          <div className="space-y-3">
            <p className="text-sm text-text-muted dark:text-text-muted-dark">{selected?.title}</p>
            <input
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              placeholder="Submission link"
              className="w-full h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setSelected(null)}>Cancel</Button>
              <Button onClick={submitAssignment} disabled={!submissionUrl.trim()}>Submit</Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default StudentAssignments;
