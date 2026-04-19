import React, { useEffect, useState } from 'react';
import { Users, BookOpen, ClipboardList } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import PageHeader from '../../components/UI/PageHeader';
import StatCard from '../../components/UI/StatCard';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingState from '../../components/UI/LoadingState';
import ErrorState from '../../components/UI/ErrorState';
import { useAuth } from '../../contexts/AuthContext';
import { teacherService } from '../../services/teachers';
import { dashboardService } from '../../services/dashboard';
import { lectureService } from '../../services/lectures';

const TeacherDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [todayLectures, setTodayLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const teacher = await teacherService.getByProfile(profile.id);
        const [statsData, todayData] = await Promise.all([
          dashboardService.getTeacherStats(teacher.id),
          lectureService.getTodayByTeacher(teacher.id),
        ]);
        setStats(statsData);
        setTodayLectures(todayData || []);
      } catch (err) {
        setError(err.message || 'Failed to load teacher dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (profile?.id) load();
  }, [profile?.id]);

  if (loading) return <LoadingState role="teacher" />;
  if (error) return <ErrorState role="teacher" message={error} />;

  return (
    <Layout role="teacher">
      <div className="space-y-6">
        <PageHeader title="Teacher Dashboard" subtitle="Daily overview and quick actions" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={Users} label="My Students" value={stats?.studentCount ?? 0} />
          <StatCard icon={BookOpen} label="Weekly Lectures" value={stats?.weeklyLectures ?? 0} />
          <StatCard icon={ClipboardList} label="Pending Assignments" value={stats?.totalAssignments ?? 0} />
        </div>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {todayLectures.length === 0 && (
              <p className="text-sm text-text-muted dark:text-text-muted-dark">No lectures scheduled today.</p>
            )}
            {todayLectures.map((item) => (
              <div key={item.id} className="p-4 rounded-card border border-border dark:border-border-dark bg-bg dark:bg-bg-dark">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-text-primary dark:text-text-primary-dark">{item.subjects?.name}</p>
                    <p className="text-sm text-text-muted dark:text-text-muted-dark">Batch: {item.batches?.name || 'N/A'}</p>
                  </div>
                  <div className="text-sm text-text-muted dark:text-text-muted-dark">
                    {item.start_time} - {item.end_time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button className="w-full" onClick={() => window.location.assign('/teacher/upload-marks')}>Upload Marks</Button>
            <Button className="w-full" onClick={() => window.location.assign('/teacher/students')}>Mark Attendance</Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
