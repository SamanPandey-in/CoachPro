import React, { useEffect, useMemo, useState } from 'react';
import { Users, UserCheck, CalendarCheck, FileText, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '../../components/Layout/Layout';
import StatCard from '../../components/UI/StatCard';
import Card from '../../components/UI/Card';
import PageHeader from '../../components/UI/PageHeader';
import LoadingState from '../../components/UI/LoadingState';
import ErrorState from '../../components/UI/ErrorState';
import DataTable from '../../components/UI/DataTable';
import { dashboardService } from '../../services/dashboard';
import { studentService } from '../../services/students';
import { testService } from '../../services/tests';

const CHART_BRAND = 'var(--chart-brand)';
const CHART_ABSENT = '#E2E8F0';

const monthLabel = (dateStr) => new Date(dateStr).toLocaleString('en-US', { month: 'short' });

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, studentsRes, testsRes] = await Promise.all([
          dashboardService.getAdminStats(),
          studentService.getAll(),
          testService.getAll(),
        ]);
        setStats(statsRes);
        setStudents(studentsRes || []);
        setTests(testsRes || []);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const enrollmentTrend = useMemo(() => {
    const buckets = {};
    (students || []).forEach((s) => {
      if (!s.admission_date) return;
      const d = new Date(s.admission_date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!buckets[key]) {
        buckets[key] = { month: monthLabel(s.admission_date), enrolled: 0 };
      }
      buckets[key].enrolled += 1;
    });
    return Object.entries(buckets)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([, value]) => value);
  }, [students]);

  const testsThisMonth = useMemo(() => {
    const now = new Date();
    return (tests || []).filter((t) => {
      const d = new Date(t.test_date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }, [tests]);

  const lowAttendanceStudents = useMemo(() => {
    return (students || [])
      .filter((s) => (s.attendance_pct ?? 0) < 75)
      .sort((a, b) => (a.attendance_pct ?? 0) - (b.attendance_pct ?? 0));
  }, [students]);

  if (loading) return <LoadingState role="admin" />;
  if (error) return <ErrorState role="admin" message={error} />;

  const presentCount = (stats?.attendanceSummary || []).reduce((sum, item) => sum + (item.present || 0), 0);
  const totalCount = (stats?.attendanceSummary || []).reduce((sum, item) => sum + (item.total || 0), 0);
  const absentCount = Math.max(totalCount - presentCount, 0);

  return (
    <Layout role="admin">
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          subtitle="Today's snapshot across students, teachers, attendance, and tests"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Users} label="Total Students" value={stats?.totalStudents ?? 0} />
          <StatCard icon={UserCheck} label="Total Teachers" value={stats?.totalTeachers ?? 0} />
          <StatCard icon={CalendarCheck} label="Today's Attendance" value={`${stats?.todayAttendance ?? 0}%`} />
          <StatCard icon={FileText} label="Tests This Month" value={testsThisMonth} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-4">
              Enrollment Trend (Last 6 Months)
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={enrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Bar dataKey="enrolled" fill={CHART_BRAND} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-4">
              Today's Attendance
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Present', value: presentCount },
                    { name: 'Absent', value: absentCount },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  dataKey="value"
                >
                  <Cell fill={CHART_BRAND} />
                  <Cell fill={CHART_ABSENT} />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-warning dark:text-warning-dark" />
            <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
              Students Needing Attention (Attendance under 75%)
            </h3>
          </div>
          <DataTable
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'roll_number', label: 'Roll No.' },
              { key: 'batch', label: 'Batch' },
              { key: 'attendance_pct', label: 'Attendance', render: (r) => `${r.attendance_pct ?? 0}%` },
              { key: 'avg_score', label: 'Avg Score', render: (r) => `${r.avg_score ?? 0}%` },
            ]}
            rows={lowAttendanceStudents}
            emptyMessage="No students are below 75% attendance."
          />
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
