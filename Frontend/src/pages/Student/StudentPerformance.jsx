import React, { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '../../components/Layout/Layout';
import PageHeader from '../../components/UI/PageHeader';
import Card from '../../components/UI/Card';
import DataTable from '../../components/UI/DataTable';
import LoadingState from '../../components/UI/LoadingState';
import ErrorState from '../../components/UI/ErrorState';
import { useAuth } from '../../contexts/AuthContext';
import { studentService } from '../../services/students';
import { testService } from '../../services/tests';

const CHART_BRAND = 'var(--chart-brand)';

const StudentPerformance = () => {
  const { profile } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const student = await studentService.getMyProfile(profile.id);
        const rows = await testService.getMyResults(student.id);
        setResults(rows || []);
      } catch (err) {
        setError(err.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    if (profile?.id) load();
  }, [profile?.id]);

  const subjectWise = useMemo(() => {
    const map = {};
    results.forEach((r) => {
      const subject = r.tests?.subjects?.name || 'Unknown';
      const max = r.tests?.max_marks || 100;
      if (r.marks == null || r.is_absent) return;
      if (!map[subject]) map[subject] = { subject, total: 0, count: 0 };
      map[subject].total += (Number(r.marks) / max) * 100;
      map[subject].count += 1;
    });
    return Object.values(map)
      .map((v) => ({ subject: v.subject, avgPct: Math.round(v.total / v.count) }))
      .sort((a, b) => b.avgPct - a.avgPct);
  }, [results]);

  const bestSubject = subjectWise[0]?.subject || 'N/A';
  const weakSubject = subjectWise[subjectWise.length - 1]?.subject || 'N/A';

  if (loading) return <LoadingState role="student" />;
  if (error) return <ErrorState role="student" message={error} />;

  return (
    <Layout role="student">
      <div className="space-y-6">
        <PageHeader title="My Results" subtitle="Subject-wise performance, full history, and strengths/weaknesses" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-semibold mb-2">Best Subject</h3>
            <p className="text-text-primary dark:text-text-primary-dark">{bestSubject}</p>
          </Card>
          <Card>
            <h3 className="font-semibold mb-2">Needs Improvement</h3>
            <p className="text-text-primary dark:text-text-primary-dark">{weakSubject}</p>
          </Card>
        </div>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Subject-wise Average</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={subjectWise}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="subject" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip />
              <Bar dataKey="avgPct" fill={CHART_BRAND} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Test History</h3>
          <DataTable
            columns={[
              { key: 'title', label: 'Test', render: (r) => r.tests?.title || '-' },
              { key: 'date', label: 'Date', render: (r) => r.tests?.test_date || '-' },
              { key: 'subject', label: 'Subject', render: (r) => r.tests?.subjects?.name || '-' },
              { key: 'marks', label: 'Marks', render: (r) => (r.is_absent ? 'Absent' : `${r.marks ?? '-'} / ${r.tests?.max_marks ?? 100}`) },
              {
                key: 'pct',
                label: 'Percentage',
                render: (r) => {
                  if (r.is_absent || r.marks == null) return '-';
                  const max = r.tests?.max_marks || 100;
                  return `${Math.round((Number(r.marks) / max) * 100)}%`;
                },
              },
            ]}
            rows={results}
            emptyMessage="No test history found"
          />
        </Card>
      </div>
    </Layout>
  );
};

export default StudentPerformance;
