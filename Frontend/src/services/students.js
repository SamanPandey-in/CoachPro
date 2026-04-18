import { supabase } from '../lib/supabase';

export const studentService = {
  // Admin: get all students with computed stats
  async getAll() {
    const { data, error } = await supabase
      .from('student_overview')
      .select('*')
      .order('batch_rank', { ascending: true });
    if (error) throw error;
    return data;
  },

  // Admin: add a new student
  async create({ batchId, rollNumber, parentName, parentPhone }) {
    const { data, error } = await supabase
      .from('students')
      .insert({
        batch_id: batchId,
        roll_number: rollNumber,
        parent_name: parentName,
        parent_phone: parentPhone,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Admin: update student
  async update(id, updates) {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Admin: soft-delete (deactivate)
  async deactivate(id) {
    const { error } = await supabase
      .from('students')
      .update({ is_active: false })
      .eq('id', id);
    if (error) throw error;
  },

  // Student: get own record with full details
  async getMyProfile(profileId) {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        profiles(name, email, phone),
        batches(name, course)
      `)
      .eq('profile_id', profileId)
      .single();
    if (error) throw error;
    return data;
  },
};
