import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import PageHeader from '../../components/UI/PageHeader';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import DataTable from '../../components/UI/DataTable';
import LoadingState from '../../components/UI/LoadingState';
import ErrorState from '../../components/UI/ErrorState';
import { useAuth } from '../../contexts/AuthContext';
import { teacherService } from '../../services/teachers';
import { testService } from '../../services/tests';
import { supabase } from '../../lib/supabase';

const TeacherUploadMarks = () => {
  const { profile } = useAuth();
  const [teacherId, setTeacherId] = useState(null);
  const [tests, setTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState('');
  const [students, setStudents] = useState([]);
  const [marksMap, setMarksMap] = useState({});
  const [absentMap, setAbsentMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const teacher = await teacherService.getByProfile(profile.id);
        setTeacherId(teacher.id);

        const testsRes = await supabase
          .from('tests')
          .select('id, title, batch_id, test_date, max_marks')
          .eq('conducted_by', teacher.id)
          .order('test_date', { ascending: false });
        if (testsRes.error) throw testsRes.error;
        setTests(testsRes.data || []);
        if (testsRes.data?.length) setSelectedTestId(String(testsRes.data[0].id));
      } catch (err) {
        setError(err.message || 'Failed to load marks upload page');
      } finally {
        setLoading(false);
      }
    };

    if (profile?.id) load();
  }, [profile?.id]);

  useEffect(() => {
    const loadStudents = async () => {
      const test = tests.find((t) => String(t.id) === String(selectedTestId));
      if (!test) return;
      try {
        const res = await supabase
          .from('students')
          .select('id, roll_number, profiles(name)')
          .eq('batch_id', test.batch_id)
          .order('roll_number', { ascending: true });
        if (res.error) throw res.error;
        setStudents(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load student list');
      }
    };

    if (selectedTestId) loadStudents();
  }, [selectedTestId, tests]);

  const selectedTest = useMemo(() => tests.find((t) => String(t.id) === String(selectedTestId)), [tests, selectedTestId]);

  const handleCsvUpload = async (file) => {
    try {
      const text = await file.text();
      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length < 2) return;
      const [header, ...rows] = lines;
      const cols = header.split(',').map((c) => c.trim().toLowerCase());
      const rollIdx = cols.findIndex((c) => c.includes('roll'));
      const marksIdx = cols.findIndex((c) => c.includes('mark'));
      const absentIdx = cols.findIndex((c) => c.includes('absent'));
      if (rollIdx < 0 || marksIdx < 0) {
        setError('CSV must include roll and marks columns');
        return;
      }

      const byRoll = Object.fromEntries(students.map((s) => [s.roll_number, s]));
      const nextMarks = {};
      const nextAbsent = {};
      rows.forEach((line) => {
        const values = line.split(',').map((v) => v.trim());
        const roll = values[rollIdx];
        const student = byRoll[roll];
        if (!student) return;
        nextMarks[student.id] = values[marksIdx] || '';
        if (absentIdx >= 0) {
          const value = (values[absentIdx] || '').toLowerCase();
          nextAbsent[student.id] = value === 'true' || value === 'yes' || value === '1';
        }
      });
      setMarksMap((prev) => ({ ...prev, ...nextMarks }));
      setAbsentMap((prev) => ({ ...prev, ...nextAbsent }));
    } catch (err) {
      setError(err.message || 'Failed to parse CSV');
    }
  };

  const submitMarks = async () => {
    if (!selectedTestId || !teacherId) return;
    try {
      setSaving(true);
      const payload = students.map((s) => ({
        student_id: s.id,
        marks: marksMap[s.id] === '' ? null : Number(marksMap[s.id] || 0),
        is_absent: !!absentMap[s.id],
        uploaded_by: teacherId,
      }));
      await testService.uploadMarks(Number(selectedTestId), payload);
    } catch (err) {
      setError(err.message || 'Failed to upload marks');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState role="teacher" />;
  if (error) return <ErrorState role="teacher" message={error} />;

  return (
    <Layout role="teacher">
      <div className="space-y-6">
        <PageHeader title="Upload Marks" subtitle="Select test, enter marks manually, or import CSV" />

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={selectedTestId}
              onChange={(e) => setSelectedTestId(e.target.value)}
              className="h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            >
              {tests.map((t) => (
                <option key={t.id} value={t.id}>{t.title} ({t.test_date})</option>
              ))}
            </select>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => e.target.files?.[0] && handleCsvUpload(e.target.files[0])}
              className="h-10 px-2 py-1 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            />
          </div>
          {selectedTest && (
            <p className="text-sm text-text-muted dark:text-text-muted-dark mt-2">Max marks: {selectedTest.max_marks}</p>
          )}
        </Card>

        <DataTable
          columns={[
            { key: 'roll', label: 'Roll No.', render: (r) => r.roll_number },
            { key: 'name', label: 'Name', render: (r) => r.profiles?.name || '-' },
            {
              key: 'marks',
              label: 'Marks',
              render: (r) => (
                <input
                  type="number"
                  min="0"
                  max={selectedTest?.max_marks || 100}
                  value={marksMap[r.id] ?? ''}
                  onChange={(e) => setMarksMap((p) => ({ ...p, [r.id]: e.target.value }))}
                  className="h-9 w-24 px-2 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
                />
              ),
            },
            {
              key: 'absent',
              label: 'Absent',
              render: (r) => (
                <input
                  type="checkbox"
                  checked={!!absentMap[r.id]}
                  onChange={(e) => setAbsentMap((p) => ({ ...p, [r.id]: e.target.checked }))}
                />
              ),
            },
          ]}
          rows={students}
          emptyMessage="No students found for selected test batch"
        />

        <div className="flex justify-end">
          <Button onClick={submitMarks} disabled={saving || !selectedTestId}>
            {saving ? 'Saving...' : 'Submit Marks'}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherUploadMarks;
