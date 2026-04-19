import { supabase } from '../lib/supabase';

export const teacherService = {
  async getAll() {
    const { data, error } = await supabase
      .from('teacher_load')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('teachers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getByProfile(profileId) {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('profile_id', profileId)
      .single();
    if (error) throw error;
    return data;
  },
};
