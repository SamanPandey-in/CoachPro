import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import PageHeader from '../../components/UI/PageHeader';
import Card from '../../components/UI/Card';
import DataTable from '../../components/UI/DataTable';
import LoadingState from '../../components/UI/LoadingState';
import ErrorState from '../../components/UI/ErrorState';
import { useAuth } from '../../contexts/AuthContext';
import { studentService } from '../../services/students';
import { attendanceService } from '../../services/attendance';

const StudentAttendance = () => {
  const { profile } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const student = await studentService.getMyProfile(profile.id);
        const rows = await attendanceService.getMyHistory(student.id);
        setHistory(rows || []);
      } catch (err) {
        setError(err.message || 'Failed to load attendance');
      } finally {
        setLoading(false);
      }
    };

    if (profile?.id) load();
  }, [profile?.id]);

  const summary = useMemo(() => {
    const total = history.length;
    const present = history.filter((h) => h.status === 'present').length;
    const absent = history.filter((h) => h.status === 'absent').length;
    const pct = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, pct };
  }, [history]);

  const heatMap = useMemo(() => {
    const byDate = {};
    history.forEach((h) => {
      if (!byDate[h.date]) byDate[h.date] = { total: 0, present: 0 };
      byDate[h.date].total += 1;
      if (h.status === 'present') byDate[h.date].present += 1;
    });
    return Object.entries(byDate).map(([date, v]) => ({
      date,
      pct: v.total > 0 ? Math.round((v.present / v.total) * 100) : 0,
    }));
  }, [history]);

  if (loading) return <LoadingState role="student" />;
  if (error) return <ErrorState role="student" message={error} />;

  return (
    <Layout role="student">
      <div className="space-y-6">
        <PageHeader title="Attendance" subtitle="Monthly heatmap and subject-wise attendance history" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><p className="text-sm text-text-muted dark:text-text-muted-dark">Present</p><p className="text-2xl font-bold">{summary.present}</p></Card>
          <Card><p className="text-sm text-text-muted dark:text-text-muted-dark">Total Classes</p><p className="text-2xl font-bold">{summary.total}</p></Card>
          <Card><p className="text-sm text-text-muted dark:text-text-muted-dark">Attendance %</p><p className="text-2xl font-bold">{summary.pct}%</p></Card>
        </div>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Monthly Heatmap</h3>
          <div className="grid grid-cols-7 md:grid-cols-10 gap-2">
            {heatMap.slice(0, 31).map((d) => (
              <div key={d.date} className="text-center">
                <div className={`h-10 rounded-btn border border-border dark:border-border-dark ${d.pct >= 85 ? 'bg-success/30' : d.pct >= 60 ? 'bg-warning/30' : 'bg-danger/30'}`} />
                <p className="text-[10px] mt-1 text-text-muted dark:text-text-muted-dark">{new Date(d.date).getDate()}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Attendance Records</h3>
          <DataTable
            columns={[
              { key: 'date', label: 'Date' },
              { key: 'subject', label: 'Subject', render: (r) => r.subjects?.name || '-' },
              { key: 'status', label: 'Status', render: (r) => (r.status || '').toUpperCase() },
            ]}
            rows={history}
            emptyMessage="No attendance records found"
          />
        </Card>
      </div>
    </Layout>
  );
};

export default StudentAttendance;
