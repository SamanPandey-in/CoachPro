import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Eye, Pencil, Trash2, X } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import PageHeader from '../../components/UI/PageHeader';
import Button from '../../components/UI/Button';
import DataTable from '../../components/UI/DataTable';
import Card from '../../components/UI/Card';
import LoadingState from '../../components/UI/LoadingState';
import ErrorState from '../../components/UI/ErrorState';
import Modal from '../../components/UI/Modal';
import { studentService } from '../../services/students';

const initialForm = {
  batchId: '',
  rollNumber: '',
  parentName: '',
  parentPhone: '',
};

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form, setForm] = useState(initialForm);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getAll();
      setStudents(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const batches = useMemo(() => ['all', ...new Set(students.map((s) => s.batch).filter(Boolean))], [students]);
  const courses = useMemo(() => ['all', ...new Set(students.map((s) => s.course).filter(Boolean))], [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q ||
        (s.name || '').toLowerCase().includes(q) ||
        (s.roll_number || '').toLowerCase().includes(q) ||
        (s.email || '').toLowerCase().includes(q);
      const matchBatch = batchFilter === 'all' || s.batch === batchFilter;
      const matchCourse = courseFilter === 'all' || s.course === courseFilter;
      return matchSearch && matchBatch && matchCourse;
    });
  }, [students, search, batchFilter, courseFilter]);

  const openAddModal = () => {
    setEditingStudent(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setForm({
      batchId: student.batch_id || '',
      rollNumber: student.roll_number || '',
      parentName: student.parent_name || '',
      parentPhone: student.parent_phone || '',
    });
    setIsModalOpen(true);
  };

  const saveStudent = async () => {
    try {
      if (editingStudent) {
        await studentService.update(editingStudent.student_id || editingStudent.id, {
          batch_id: form.batchId || null,
          roll_number: form.rollNumber,
          parent_name: form.parentName,
          parent_phone: form.parentPhone,
        });
      } else {
        await studentService.create({
          batchId: form.batchId || null,
          rollNumber: form.rollNumber,
          parentName: form.parentName,
          parentPhone: form.parentPhone,
        });
      }

      setIsModalOpen(false);
      setForm(initialForm);
      await loadStudents();
    } catch (err) {
      setError(err.message || 'Failed to save student');
    }
  };

  const deleteStudent = async (studentId) => {
    if (!window.confirm('Deactivate this student?')) return;
    try {
      await studentService.deactivate(studentId);
      await loadStudents();
    } catch (err) {
      setError(err.message || 'Failed to deactivate student');
    }
  };

  if (loading) return <LoadingState role="admin" />;
  if (error) return <ErrorState role="admin" message={error} />;

  return (
    <Layout role="admin">
      <div className="space-y-6">
        <PageHeader
          title="Students"
          subtitle="Manage enrolled students"
          action={<Button icon={Plus} onClick={openAddModal}>Add Student</Button>}
        />

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, roll number"
              className="h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            />
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            >
              {batches.map((batch) => (
                <option key={batch} value={batch}>{batch === 'all' ? 'All Batches' : batch}</option>
              ))}
            </select>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            >
              {courses.map((course) => (
                <option key={course} value={course}>{course === 'all' ? 'All Courses' : course}</option>
              ))}
            </select>
          </div>
        </Card>

        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'roll_number', label: 'Roll No.' },
            { key: 'batch', label: 'Batch' },
            { key: 'course', label: 'Course' },
            { key: 'avg_score', label: 'Score', render: (r) => `${r.avg_score ?? 0}%` },
            { key: 'attendance_pct', label: 'Attendance', render: (r) => `${r.attendance_pct ?? 0}%` },
            {
              key: 'actions',
              label: '',
              render: (r) => (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" icon={Eye} onClick={() => setSelectedStudent(r)}>View</Button>
                  <Button variant="ghost" size="sm" icon={Pencil} onClick={() => openEditModal(r)}>Edit</Button>
                  <Button variant="ghost" size="sm" icon={Trash2} onClick={() => deleteStudent(r.student_id || r.id)}>Delete</Button>
                </div>
              ),
            },
          ]}
          rows={filteredStudents}
          emptyMessage="No students match your filters"
        />

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStudent ? 'Edit Student' : 'Add Student'}>
          <div className="space-y-3">
            <input
              value={form.batchId}
              onChange={(e) => setForm((p) => ({ ...p, batchId: e.target.value }))}
              placeholder="Batch ID"
              className="w-full h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            />
            <input
              value={form.rollNumber}
              onChange={(e) => setForm((p) => ({ ...p, rollNumber: e.target.value }))}
              placeholder="Roll Number"
              className="w-full h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            />
            <input
              value={form.parentName}
              onChange={(e) => setForm((p) => ({ ...p, parentName: e.target.value }))}
              placeholder="Parent Name"
              className="w-full h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            />
            <input
              value={form.parentPhone}
              onChange={(e) => setForm((p) => ({ ...p, parentPhone: e.target.value }))}
              placeholder="Parent Phone"
              className="w-full h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={saveStudent} disabled={!form.rollNumber}>Save</Button>
            </div>
          </div>
        </Modal>

        {selectedStudent && (
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-surface dark:bg-surface-dark border-l border-border dark:border-border-dark shadow-xl z-50 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Student Detail</h3>
              <button onClick={() => setSelectedStudent(null)} className="p-2 rounded-btn hover:bg-bg dark:hover:bg-bg-dark">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="text-text-muted dark:text-text-muted-dark">Name:</span> {selectedStudent.name}</div>
              <div><span className="text-text-muted dark:text-text-muted-dark">Email:</span> {selectedStudent.email || 'N/A'}</div>
              <div><span className="text-text-muted dark:text-text-muted-dark">Roll No:</span> {selectedStudent.roll_number}</div>
              <div><span className="text-text-muted dark:text-text-muted-dark">Batch:</span> {selectedStudent.batch || 'N/A'}</div>
              <div><span className="text-text-muted dark:text-text-muted-dark">Course:</span> {selectedStudent.course || 'N/A'}</div>
              <div><span className="text-text-muted dark:text-text-muted-dark">Avg Score:</span> {selectedStudent.avg_score ?? 0}%</div>
              <div><span className="text-text-muted dark:text-text-muted-dark">Attendance:</span> {selectedStudent.attendance_pct ?? 0}%</div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminStudents;
