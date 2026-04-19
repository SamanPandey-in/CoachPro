import React, { useEffect, useMemo, useState } from 'react';
import { Award, Calendar, ClipboardList } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import PageHeader from '../../components/UI/PageHeader';
import StatCard from '../../components/UI/StatCard';
import Card from '../../components/UI/Card';
import LoadingState from '../../components/UI/LoadingState';
import ErrorState from '../../components/UI/ErrorState';
import { useAuth } from '../../contexts/AuthContext';
import { studentService } from '../../services/students';
import { dashboardService } from '../../services/dashboard';
import { testService } from '../../services/tests';
import { assignmentService } from '../../services/assignments';

const StudentDashboard = () => {
  const { profile } = useAuth();
  const [student, setStudent] = useState(null);
  const [stats, setStats] = useState(null);
  const [results, setResults] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const myStudent = await studentService.getMyProfile(profile.id);
        const [statsData, resultData, assignmentData] = await Promise.all([
          dashboardService.getStudentStats(myStudent.id),
          testService.getMyResults(myStudent.id),
          assignmentService.getForStudent(myStudent.id, myStudent.batch_id),
        ]);
        setStudent(myStudent);
        setStats(statsData);
        setResults(resultData || []);
        setAssignments(assignmentData || []);
      } catch (err) {
        setError(err.message || 'Failed to load student dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (profile?.id) load();
  }, [profile?.id]);

  const upcomingTests = useMemo(() => {
    const today = new Date();
    return (results || [])
      .filter((r) => r.tests?.test_date && new Date(r.tests.test_date) >= today)
      .slice(0, 3);
  }, [results]);

  const recentMarks = useMemo(() => (results || []).slice(0, 3), [results]);

  const upcomingAssignments = useMemo(() => {
    const pending = (assignments || []).filter((a) => (a.my_submission?.status || 'pending') !== 'submitted');
    return pending.slice(0, 2);
  }, [assignments]);

  if (loading) return <LoadingState role="student" />;
  if (error) return <ErrorState role="student" message={error} />;

  return (
    <Layout role="student">
      <div className="space-y-6">
        <PageHeader title={`Welcome, ${profile?.name || 'Student'}`} subtitle="Your academic snapshot for today" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={Award} label="Avg Score" value={`${stats?.avgScore ?? 0}%`} />
          <StatCard icon={Calendar} label="Attendance" value={`${stats?.attendancePct ?? 0}%`} />
          <StatCard icon={ClipboardList} label="Pending Assignments" value={stats?.pendingAssignments ?? 0} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <h3 className="font-semibold mb-3">Upcoming Tests</h3>
            <div className="space-y-2">
              {upcomingTests.length === 0 && <p className="text-sm text-text-muted dark:text-text-muted-dark">No upcoming tests</p>}
              {upcomingTests.map((t, idx) => (
                <div key={`${t.tests?.title}-${idx}`} className="p-3 rounded-btn border border-border dark:border-border-dark">
                  <p className="font-medium">{t.tests?.title}</p>
                  <p className="text-xs text-text-muted dark:text-text-muted-dark">{t.tests?.test_date}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-1">
            <h3 className="font-semibold mb-3">Recent Marks</h3>
            <div className="space-y-2">
              {recentMarks.length === 0 && <p className="text-sm text-text-muted dark:text-text-muted-dark">No results yet</p>}
              {recentMarks.map((r, idx) => (
                <div key={`${r.tests?.title}-${idx}`} className="p-3 rounded-btn border border-border dark:border-border-dark">
                  <p className="font-medium">{r.tests?.title}</p>
                  <p className="text-xs text-text-muted dark:text-text-muted-dark">{r.marks ?? '-'} / {r.tests?.max_marks ?? 100}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-1">
            <h3 className="font-semibold mb-3">Upcoming Assignments</h3>
            <div className="space-y-2">
              {upcomingAssignments.length === 0 && <p className="text-sm text-text-muted dark:text-text-muted-dark">No pending assignments</p>}
              {upcomingAssignments.map((a) => (
                <div key={a.id} className="p-3 rounded-btn border border-border dark:border-border-dark">
                  <p className="font-medium">{a.title}</p>
                  <p className="text-xs text-text-muted dark:text-text-muted-dark">Due: {new Date(a.due_date).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
