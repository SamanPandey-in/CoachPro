import { supabase } from '../lib/supabase';

export const attendanceService = {
  // Teacher: mark attendance for a date + subject
  async markBatch(records) {
    // records = [{ student_id, subject_id, date, status, marked_by }]
    const { data, error } = await supabase
      .from('attendance')
      .upsert(records, { onConflict: 'student_id,subject_id,date' })
      .select();
    if (error) throw error;
    return data;
  },

  // Admin: get today's summary
  async getTodaySummary() {
    const { data, error } = await supabase
      .from('today_attendance_summary')
      .select('*');
    if (error) throw error;
    return data;
  },

  // Student: get own attendance history
  async getMyHistory(studentId, fromDate, toDate) {
    let query = supabase
      .from('attendance')
      .select('date, status, subjects(name)')
      .eq('student_id', studentId)
      .order('date', { ascending: false });

    if (fromDate) query = query.gte('date', fromDate);
    if (toDate) query = query.lte('date', toDate);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Admin: get attendance for a batch on a specific date
  async getByBatchDate(batchId, date) {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        id, status, date,
        students!inner(id, roll_number, profiles(name), batch_id)
      `)
      .eq('students.batch_id', batchId)
      .eq('date', date);
    if (error) throw error;
    return data;
  },
};
