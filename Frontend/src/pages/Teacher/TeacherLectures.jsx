import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import PageHeader from '../../components/UI/PageHeader';
import Card from '../../components/UI/Card';
import LoadingState from '../../components/UI/LoadingState';
import ErrorState from '../../components/UI/ErrorState';
import { useAuth } from '../../contexts/AuthContext';
import { teacherService } from '../../services/teachers';
import { lectureService } from '../../services/lectures';

const weekdayLabel = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TeacherLectures = () => {
  const { profile } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [notes, setNotes] = useState({});
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
        setError(err.message || 'Failed to load lectures');
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
        <PageHeader title="Lectures" subtitle="Past and upcoming lecture list with completion notes" />

        <div className="space-y-3">
          {lectures.length === 0 && (
            <Card><p className="text-sm text-text-muted dark:text-text-muted-dark">No lectures scheduled.</p></Card>
          )}
          {lectures.map((l) => (
            <Card key={l.id}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold">{l.subjects?.name || 'Subject'}</p>
                  <p className="text-sm text-text-muted dark:text-text-muted-dark">Batch: {l.batches?.name || '-'} | {weekdayLabel[l.day_of_week] || '-'}</p>
                </div>
                <div className="text-sm text-text-muted dark:text-text-muted-dark">{l.start_time} - {l.end_time}</div>
              </div>
              <textarea
                value={notes[l.id] || ''}
                onChange={(e) => setNotes((p) => ({ ...p, [l.id]: e.target.value }))}
                rows={2}
                placeholder="Lecture completion notes"
                className="w-full px-3 py-2 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
              />
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default TeacherLectures;
