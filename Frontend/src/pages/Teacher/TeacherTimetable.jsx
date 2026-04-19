import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import PageHeader from '../../components/UI/PageHeader';
import Card from '../../components/UI/Card';
import LoadingState from '../../components/UI/LoadingState';
import ErrorState from '../../components/UI/ErrorState';
import { useAuth } from '../../contexts/AuthContext';
import { teacherService } from '../../services/teachers';
import { lectureService } from '../../services/lectures';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TeacherTimetable = () => {
  const { profile } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const teacher = await teacherService.getByProfile(profile.id);
        const data = await lectureService.getByTeacher(teacher.id);
        setLectures(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load timetable');
      } finally {
        setLoading(false);
      }
    };

    if (profile?.id) load();
  }, [profile?.id]);

  const grouped = useMemo(() => {
    const map = {};
    (lectures || []).forEach((l) => {
      if (!map[l.day_of_week]) map[l.day_of_week] = [];
      map[l.day_of_week].push(l);
    });
    Object.values(map).forEach((arr) => arr.sort((a, b) => String(a.start_time).localeCompare(String(b.start_time))));
    return map;
  }, [lectures]);

  if (loading) return <LoadingState role="teacher" />;
  if (error) return <ErrorState role="teacher" message={error} />;

  return (
    <Layout role="teacher">
      <div className="space-y-6">
        <PageHeader title="Timetable" subtitle="Read-only weekly schedule grid" />

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm border-collapse">
              <thead>
                <tr>
                  {days.map((d, idx) => (
                    <th key={d} className="border border-border dark:border-border-dark bg-bg dark:bg-bg-dark px-3 py-2 text-left font-semibold">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {days.map((d, idx) => (
                    <td key={d} className="align-top border border-border dark:border-border-dark p-2 min-h-[220px]">
                      <div className="space-y-2">
                        {(grouped[idx] || []).map((l) => (
                          <div key={l.id} className="p-2 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
                            <p className="font-medium">{l.subjects?.name || '-'}</p>
                            <p className="text-xs text-text-muted dark:text-text-muted-dark">{l.start_time} - {l.end_time}</p>
                            <p className="text-xs text-text-muted dark:text-text-muted-dark">{l.batches?.name || '-'}</p>
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default TeacherTimetable;
