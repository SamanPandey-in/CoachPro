import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import PageHeader from '../../components/UI/PageHeader';
import Button from '../../components/UI/Button';
import DataTable from '../../components/UI/DataTable';
import Card from '../../components/UI/Card';
import LoadingState from '../../components/UI/LoadingState';
import ErrorState from '../../components/UI/ErrorState';
import Modal from '../../components/UI/Modal';
import { teacherService } from '../../services/teachers';

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [assignTarget, setAssignTarget] = useState(null);
  const [subjectValue, setSubjectValue] = useState('');

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const data = await teacherService.getAll();
      setTeachers(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const subjects = useMemo(() => ['all', ...new Set((teachers || []).map((t) => t.subject).filter(Boolean))], [teachers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (teachers || []).filter((t) => {
      const matchSearch = !q ||
        (t.name || '').toLowerCase().includes(q) ||
        (t.employee_id || '').toLowerCase().includes(q) ||
        (t.email || '').toLowerCase().includes(q);
      const matchSubject = subjectFilter === 'all' || t.subject === subjectFilter;
      return matchSearch && matchSubject;
    });
  }, [teachers, search, subjectFilter]);

  const assignSubject = async () => {
    if (!assignTarget || !subjectValue.trim()) return;
    try {
      await teacherService.update(assignTarget.teacher_id, { subject: subjectValue.trim() });
      setAssignTarget(null);
      setSubjectValue('');
      await loadTeachers();
    } catch (err) {
      setError(err.message || 'Failed to assign subject');
    }
  };

  if (loading) return <LoadingState role="admin" />;
  if (error) return <ErrorState role="admin" message={error} />;

  return (
    <Layout role="admin">
      <div className="space-y-6">
        <PageHeader title="Teachers" subtitle="Subject assignment and teaching load overview" />

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, employee id"
              className="h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            />
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            >
              {subjects.map((s) => (
                <option key={s} value={s}>{s === 'all' ? 'All Subjects' : s}</option>
              ))}
            </select>
          </div>
        </Card>

        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'employee_id', label: 'Employee ID' },
            { key: 'subject', label: 'Subject' },
            { key: 'weekly_lectures', label: 'Weekly Lectures' },
            { key: 'student_count', label: 'Students' },
            {
              key: 'actions',
              label: '',
              render: (row) => (
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Link}
                  onClick={() => {
                    setAssignTarget(row);
                    setSubjectValue(row.subject || '');
                  }}
                >
                  Assign Subject
                </Button>
              ),
            },
          ]}
          rows={filtered}
          emptyMessage="No teachers match the selected filters"
        />

        <Modal isOpen={!!assignTarget} onClose={() => setAssignTarget(null)} title="Assign Subject">
          <div className="space-y-3">
            <p className="text-sm text-text-muted dark:text-text-muted-dark">
              Teacher: <span className="text-text-primary dark:text-text-primary-dark">{assignTarget?.name}</span>
            </p>
            <input
              value={subjectValue}
              onChange={(e) => setSubjectValue(e.target.value)}
              placeholder="Subject name"
              className="w-full h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setAssignTarget(null)}>Cancel</Button>
              <Button onClick={assignSubject} disabled={!subjectValue.trim()}>Save</Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default AdminTeachers;
