import { supabase } from '../lib/supabase';

export const lectureService = {
  async getByTeacher(teacherId) {
    const { data, error } = await supabase
      .from('lectures')
      .select('id, day_of_week, start_time, end_time, room, is_active, subjects(name), batches(name)')
      .eq('teacher_id', teacherId)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });
    if (error) throw error;
    return data;
  },

  async getTodayByTeacher(teacherId) {
    const day = (new Date().getDay() + 6) % 7;
    const { data, error } = await supabase
      .from('lectures')
      .select('id, start_time, end_time, room, subjects(name), batches(name)')
      .eq('teacher_id', teacherId)
      .eq('day_of_week', day)
      .eq('is_active', true)
      .order('start_time', { ascending: true });
    if (error) throw error;
    return data;
  },
};
