import React, { useEffect, useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/UI/Card';
import PageHeader from '../../components/UI/PageHeader';
import LoadingState from '../../components/UI/LoadingState';
import ErrorState from '../../components/UI/ErrorState';
import Button from '../../components/UI/Button';
import { supabase } from '../../lib/supabase';
import { studentService } from '../../services/students';

const CHART_BRAND = 'var(--chart-brand)';
const CHART_MUTED = 'var(--chart-muted)';

const AdminAnalytics = () => {
  const [monthRange, setMonthRange] = useState(6);
  const [students, setStudents] = useState([]);
  const [testRows, setTestRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [studentRows, resultsRes] = await Promise.all([
          studentService.getAll(),
          supabase
            .from('test_results')
            .select('marks, is_absent, tests(test_date, subjects(name), batches(name), max_marks)')
            .eq('is_absent', false),
        ]);

        if (resultsRes.error) throw resultsRes.error;

        setStudents(studentRows || []);
        setTestRows(resultsRes.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const monthlyEnrollment = useMemo(() => {
    const now = new Date();
    const cutoff = new Date(now.getFullYear(), now.getMonth() - (monthRange - 1), 1);
    const map = {};
    (students || []).forEach((s) => {
      if (!s.admission_date) return;
      const d = new Date(s.admission_date);
      if (d < cutoff) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!map[key]) {
        map[key] = {
          month: d.toLocaleString('en-US', { month: 'short' }),
          enrolled: 0,
        };
      }
      map[key].enrolled += 1;
    });

    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, value]) => value);
  }, [students, monthRange]);

  const subjectAverages = useMemo(() => {
    const agg = {};
    (testRows || []).forEach((row) => {
      const subject = row.tests?.subjects?.name;
      const max = row.tests?.max_marks || 100;
      if (!subject || row.marks == null) return;
      if (!agg[subject]) agg[subject] = { subject, totalPct: 0, count: 0 };
      agg[subject].totalPct += (Number(row.marks) / max) * 100;
      agg[subject].count += 1;
    });

    return Object.values(agg)
      .map((item) => ({ subject: item.subject, avgScore: Math.round(item.totalPct / item.count) }))
      .sort((a, b) => b.avgScore - a.avgScore);
  }, [testRows]);

  const batchComparison = useMemo(() => {
    const agg = {};
    (testRows || []).forEach((row) => {
      const batch = row.tests?.batches?.name || 'Unassigned';
      const max = row.tests?.max_marks || 100;
      if (row.marks == null) return;
      if (!agg[batch]) agg[batch] = { batch, totalPct: 0, count: 0 };
      agg[batch].totalPct += (Number(row.marks) / max) * 100;
      agg[batch].count += 1;
    });

    return Object.values(agg)
      .map((item) => ({ batch: item.batch, avgScore: Math.round(item.totalPct / item.count) }))
      .sort((a, b) => b.avgScore - a.avgScore);
  }, [testRows]);

  const exportCSV = () => {
    const rows = [['Section', 'Name', 'Value']];
    monthlyEnrollment.forEach((item) => rows.push(['Monthly Enrollment', item.month, item.enrolled]));
    subjectAverages.forEach((item) => rows.push(['Subject Average', item.subject, item.avgScore]));
    batchComparison.forEach((item) => rows.push(['Batch Comparison', item.batch, item.avgScore]));

    const csv = rows.map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'analytics-export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <LoadingState role="admin" />;
  if (error) return <ErrorState role="admin" message={error} />;

  return (
    <Layout role="admin">
      <div className="space-y-6">
        <PageHeader
          title="Analytics"
          subtitle="Historical trends, subject insights, and batch-level comparisons"
          action={
            <div className="flex items-center gap-2">
              <select
                value={monthRange}
                onChange={(e) => setMonthRange(Number(e.target.value))}
                className="h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-sm"
              >
                <option value={3}>Last 3 months</option>
                <option value={6}>Last 6 months</option>
                <option value={12}>Last 12 months</option>
              </select>
              <Button variant="outline" icon={Download} onClick={exportCSV}>Export CSV</Button>
            </div>
          }
        />

        <Card>
          <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-4">Monthly Enrollment Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyEnrollment}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="month" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip />
              <Line type="monotone" dataKey="enrolled" stroke={CHART_BRAND} strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-4">Subject-wise Average Scores</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectAverages} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis type="number" stroke="#64748B" />
                <YAxis type="category" dataKey="subject" stroke="#64748B" width={110} />
                <Tooltip />
                <Bar dataKey="avgScore" fill={CHART_BRAND} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-4">Batch Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={batchComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="batch" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Bar dataKey="avgScore" fill={CHART_MUTED} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminAnalytics;
