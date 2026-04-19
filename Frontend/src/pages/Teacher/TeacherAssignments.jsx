import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import PageHeader from '../../components/UI/PageHeader';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import LoadingState from '../../components/UI/LoadingState';
import ErrorState from '../../components/UI/ErrorState';
import Modal from '../../components/UI/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { teacherService } from '../../services/teachers';
import { assignmentService } from '../../services/assignments';
import { supabase } from '../../lib/supabase';

const initialForm = {
  title: '',
  description: '',
  due_date: '',
  subject_id: '',
  batch_id: '',
};

const TeacherAssignments = () => {
  const { profile } = useAuth();
  const [teacherId, setTeacherId] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [batches, setBatches] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  const loadAssignments = async (id) => {
    const data = await assignmentService.getForTeacher(id);
    setAssignments(data || []);
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const teacher = await teacherService.getByProfile(profile.id);
        setTeacherId(teacher.id);

        const [subRes, batchRes] = await Promise.all([
          supabase.from('subjects').select('id, name').eq('teacher_id', teacher.id),
          supabase.from('batches').select('id, name').order('name', { ascending: true }),
        ]);
        if (subRes.error) throw subRes.error;
        if (batchRes.error) throw batchRes.error;
        setSubjects(subRes.data || []);
        setBatches(batchRes.data || []);

        await loadAssignments(teacher.id);
      } catch (err) {
        setError(err.message || 'Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };

    if (profile?.id) load();
  }, [profile?.id]);

  const createAssignment = async () => {
    try {
      await assignmentService.create({
        ...form,
        subject_id: Number(form.subject_id),
        batch_id: Number(form.batch_id),
        created_by: teacherId,
      });
      setIsModalOpen(false);
      setForm(initialForm);
      await loadAssignments(teacherId);
    } catch (err) {
      setError(err.message || 'Failed to create assignment');
    }
  };

  if (loading) return <LoadingState role="teacher" />;
  if (error) return <ErrorState role="teacher" message={error} />;

  return (
    <Layout role="teacher">
      <div className="space-y-6">
        <PageHeader
          title="Assignments"
          subtitle="Create and track submissions for your classes"
          action={<Button onClick={() => setIsModalOpen(true)}>Create Assignment</Button>}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {assignments.length === 0 && (
            <Card><p className="text-sm text-text-muted dark:text-text-muted-dark">No assignments yet.</p></Card>
          )}
          {assignments.map((a) => {
            const total = (a.assignment_submissions || []).length;
            const submitted = (a.assignment_submissions || []).filter((s) => s.status === 'submitted').length;
            return (
              <Card key={a.id}>
                <h3 className="font-semibold mb-1">{a.title}</h3>
                <p className="text-sm text-text-muted dark:text-text-muted-dark mb-3">{a.description || 'No description'}</p>
                <div className="text-sm space-y-1">
                  <p>Subject: {a.subjects?.name || '-'}</p>
                  <p>Batch: {a.batches?.name || '-'}</p>
                  <p>Due: {new Date(a.due_date).toLocaleString()}</p>
                  <p className="font-medium">Submissions: {submitted}/{total}</p>
                </div>
              </Card>
            );
          })}
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Assignment">
          <div className="space-y-3">
            <input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Title"
              className="w-full h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              placeholder="Description"
              className="w-full px-3 py-2 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            />
            <select
              value={form.subject_id}
              onChange={(e) => setForm((p) => ({ ...p, subject_id: e.target.value }))}
              className="w-full h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select
              value={form.batch_id}
              onChange={(e) => setForm((p) => ({ ...p, batch_id: e.target.value }))}
              className="w-full h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            >
              <option value="">Select Batch</option>
              {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <input
              type="datetime-local"
              value={form.due_date}
              onChange={(e) => setForm((p) => ({ ...p, due_date: e.target.value }))}
              className="w-full h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={createAssignment} disabled={!form.title || !form.subject_id || !form.batch_id || !form.due_date}>Create</Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default TeacherAssignments;
