import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import PageHeader from '../../components/UI/PageHeader';
import Card from '../../components/UI/Card';
import LoadingState from '../../components/UI/LoadingState';
import ErrorState from '../../components/UI/ErrorState';
import { notificationService } from '../../services/notifications';
import { supabase } from '../../lib/supabase';

const TeacherNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getForRole('teacher');
        setNotifications(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    load();

    const channel = notificationService.subscribeByRole('teacher', (payload) => {
      setNotifications((prev) => [payload, ...prev]);
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) return <LoadingState role="teacher" />;
  if (error) return <ErrorState role="teacher" message={error} />;

  return (
    <Layout role="teacher">
      <div className="space-y-6">
        <PageHeader title="Notifications" subtitle="Updates and announcements relevant to your role" />

        <div className="space-y-3">
          {notifications.length === 0 && (
            <Card><p className="text-sm text-text-muted dark:text-text-muted-dark">No notifications.</p></Card>
          )}
          {notifications.map((n) => (
            <Card key={n.id}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{n.title}</h3>
                <span className="text-xs text-text-muted dark:text-text-muted-dark">{new Date(n.created_at).toLocaleString()}</span>
              </div>
              <p className="text-sm text-text-muted dark:text-text-muted-dark">{n.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default TeacherNotifications;
