import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/UI/Card';
import PageHeader from '../../components/UI/PageHeader';
import LoadingState from '../../components/UI/LoadingState';
import ErrorState from '../../components/UI/ErrorState';
import DataTable from '../../components/UI/DataTable';
import { attendanceService } from '../../services/attendance';
import { supabase } from '../../lib/supabase';

const getMonthDays = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
};

const AdminAttendance = () => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [batchId, setBatchId] = useState('all');
  const [batches, setBatches] = useState([]);
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState([]);
  const [dailyHeatmap, setDailyHeatmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [batchRes, summaryRes] = await Promise.all([
        supabase.from('batches').select('id, name').order('name', { ascending: true }),
        attendanceService.getTodaySummary(),
      ]);
      if (batchRes.error) throw batchRes.error;
      setBatches(batchRes.data || []);
      setSummary(summaryRes || []);

      if (batchId !== 'all') {
        const attendanceRows = await attendanceService.getByBatchDate(Number(batchId), selectedDate);
        setRows(attendanceRows || []);
      } else {
        setRows([]);
      }

      const [y, m] = selectedDate.split('-').map(Number);
      const first = `${y}-${String(m).padStart(2, '0')}-01`;
      const last = `${y}-${String(m).padStart(2, '0')}-${String(new Date(y, m, 0).getDate()).padStart(2, '0')}`;
      const monthRes = await supabase
        .from('attendance')
        .select('date, status, students!inner(batch_id)')
        .gte('date', first)
        .lte('date', last);
      if (monthRes.error) throw monthRes.error;

      const map = {};
      (monthRes.data || []).forEach((r) => {
        if (batchId !== 'all' && r.students?.batch_id !== Number(batchId)) return;
        if (!map[r.date]) map[r.date] = { total: 0, present: 0 };
        map[r.date].total += 1;
        if (r.status === 'present') map[r.date].present += 1;
      });

      const heat = Object.entries(map).map(([date, value]) => ({
        date,
        pct: value.total > 0 ? Math.round((value.present / value.total) * 100) : 0,
      }));
      setDailyHeatmap(heat);
    } catch (err) {
      setError(err.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDate, batchId]);

  const monthDays = useMemo(() => {
    const d = new Date(selectedDate);
    return getMonthDays(d.getFullYear(), d.getMonth());
  }, [selectedDate]);

  const heatColor = (pct) => {
    if (pct >= 90) return 'bg-brand';
    if (pct >= 75) return 'bg-brand/70';
    if (pct >= 50) return 'bg-brand/40';
    return 'bg-border dark:bg-border-dark';
  };

  if (loading) return <LoadingState role="admin" />;
  if (error) return <ErrorState role="admin" message={error} />;

  return (
    <Layout role="admin">
      <div className="space-y-6">
        <PageHeader title="Attendance" subtitle="Date and batch level attendance monitoring" />

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            />
            <select
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="h-10 px-3 rounded-btn border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            >
              <option value="all">All Batches</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Today's Batch Summary</h3>
          <DataTable
            columns={[
              { key: 'batch', label: 'Batch' },
              { key: 'total', label: 'Total' },
              { key: 'present', label: 'Present' },
              { key: 'absent', label: 'Absent' },
              { key: 'late', label: 'Late' },
            ]}
            rows={summary}
            emptyMessage="No summary available for today"
          />
        </Card>

        {batchId !== 'all' && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Attendance on Selected Date</h3>
            <DataTable
              columns={[
                { key: 'roll', label: 'Roll No.', render: (r) => r.students?.roll_number || '-' },
                { key: 'name', label: 'Name', render: (r) => r.students?.profiles?.name || '-' },
                { key: 'status', label: 'Status', render: (r) => (r.status || '').toUpperCase() },
              ]}
              rows={rows}
              emptyMessage="No attendance records for selected date"
            />
          </Card>
        )}

        <Card>
          <h3 className="text-lg font-semibold mb-4">Monthly Attendance Heatmap</h3>
          <div className="grid grid-cols-7 md:grid-cols-10 gap-2">
            {monthDays.map((day) => {
              const date = selectedDate.slice(0, 8) + String(day).padStart(2, '0');
              const cell = dailyHeatmap.find((d) => d.date === date);
              return (
                <div key={day} className="text-center">
                  <div className={`h-10 rounded-btn ${heatColor(cell?.pct ?? 0)} border border-border dark:border-border-dark`} />
                  <p className="text-xs text-text-muted dark:text-text-muted-dark mt-1">{day}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminAttendance;
