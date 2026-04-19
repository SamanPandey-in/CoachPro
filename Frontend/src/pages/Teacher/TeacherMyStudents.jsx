import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import PageHeader from '../../components/UI/PageHeader';
import Card from '../../components/UI/Card';
import DataTable from '../../components/UI/DataTable';
import LoadingState from '../../components/UI/LoadingState';
import ErrorState from '../../components/UI/ErrorState';
import { useAuth } from '../../contexts/AuthContext';
import { teacherService } from '../../services/teachers';
import { supabase } from '../../lib/supabase';

const TeacherMyStudents = () => {
  const { profile } = useAuth();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const teacher = await teacherService.getByProfile(profile.id);
        const subjectsRes = await supabase
          .from('subjects')
          .select('batch_id')
          .eq('teacher_id', teacher.id);
        if (subjectsRes.error) throw subjectsRes.error;

        const batchIds = [...new Set((subjectsRes.data || []).map((s) => s.batch_id).filter(Boolean))];
        if (!batchIds.length) {
          setStudents([]);
          return;
        }

        const studentsRes = await supabase
          .from('student_overview')
          .select('*')
          .in('batch_id', batchIds)
          .order('batch_rank', { ascending: true });
        if (studentsRes.error) throw studentsRes.error;
        setStudents(studentsRes.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    if (profile?.id) load();
  }, [profile?.id]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (students || []).filter((s) => !q ||
      (s.name || '').toLowerCase().includes(q) ||
      (s.roll_number || '').toLowerCase().includes(q));
  }, [students, search]);

  if (loading) return <LoadingState role="teacher" />;
  if (error) return <ErrorState role="teacher" message={error} />;

  return (
    <Layout role="teacher">
      <div className="space-y-6">
        <PageHeader title="My Students" subtitle="Students in your assigned batches" />

        <Card>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name or roll number"
            className="w-full h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
          />
        </Card>

        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'roll_number', label: 'Roll No.' },
            { key: 'batch', label: 'Batch' },
            { key: 'avg_score', label: 'Avg Score', render: (r) => `${r.avg_score ?? 0}%` },
            { key: 'attendance_pct', label: 'Attendance', render: (r) => `${r.attendance_pct ?? 0}%` },
          ]}
          rows={filtered}
          emptyMessage="No students found"
        />
      </div>
    </Layout>
  );
};

export default TeacherMyStudents;
