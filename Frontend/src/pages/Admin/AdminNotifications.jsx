import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import PageHeader from '../../components/UI/PageHeader';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import LoadingState from '../../components/UI/LoadingState';
import ErrorState from '../../components/UI/ErrorState';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../services/notifications';
import { supabase } from '../../lib/supabase';

const initialForm = {
  title: '',
  body: '',
  target: 'all',
  batchId: '',
};

const AdminNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [notifRes, batchRes] = await Promise.all([
          notificationService.getForRole('admin'),
          supabase.from('batches').select('id, name').order('name', { ascending: true }),
        ]);
        if (batchRes.error) throw batchRes.error;
        setNotifications(notifRes || []);
        setBatches(batchRes.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    load();

    const channel = notificationService.subscribeByRole('admin', (item) => {
      setNotifications((prev) => [item, ...prev]);
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sendNotification = async () => {
    try {
      setSending(true);
      await notificationService.create({
        title: form.title,
        body: form.body,
        sent_by: user?.id || null,
        target_role: form.target === 'all' ? null : form.target,
        target_batch_id: form.batchId ? Number(form.batchId) : null,
      });
      setForm(initialForm);
    } catch (err) {
      setError(err.message || 'Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoadingState role="admin" />;
  if (error) return <ErrorState role="admin" message={error} />;

  return (
    <Layout role="admin">
      <div className="space-y-6">
        <PageHeader title="Notifications" subtitle="Broadcast messages to all users, roles, or specific batches" />

        <Card>
          <h3 className="text-lg font-semibold mb-4">Compose Broadcast</h3>
          <div className="space-y-3">
            <input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Notification title"
              className="w-full h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            />
            <textarea
              value={form.body}
              onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
              rows={4}
              placeholder="Notification body"
              className="w-full px-3 py-2 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                value={form.target}
                onChange={(e) => setForm((p) => ({ ...p, target: e.target.value }))}
                className="h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="teacher">Teachers</option>
                <option value="student">Students</option>
              </select>
              <select
                value={form.batchId}
                onChange={(e) => setForm((p) => ({ ...p, batchId: e.target.value }))}
                className="h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
              >
                <option value="">All Batches</option>
                {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="flex justify-end">
              <Button onClick={sendNotification} disabled={sending || !form.title || !form.body}>
                {sending ? 'Sending...' : 'Send Notification'}
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Notification History</h3>
          <div className="space-y-3">
            {notifications.length === 0 && (
              <p className="text-sm text-text-muted dark:text-text-muted-dark">No notifications yet.</p>
            )}
            {notifications.map((n) => (
              <div key={n.id} className="p-4 rounded-card border border-border dark:border-border-dark bg-bg dark:bg-bg-dark">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h4 className="font-semibold text-text-primary dark:text-text-primary-dark">{n.title}</h4>
                  <span className="text-xs text-text-muted dark:text-text-muted-dark">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-text-muted dark:text-text-muted-dark mb-2">{n.body}</p>
                <p className="text-xs text-text-muted dark:text-text-muted-dark">
                  Target Role: {n.target_role || 'all'} | Batch: {n.target_batch_id || 'all'}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminNotifications;
