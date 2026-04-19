import { supabase } from '../lib/supabase';

export const notificationService = {
  async getForRole(role) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .or(`target_role.is.null,target_role.eq.${role}`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from('notifications')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  subscribeByRole(role, onInsert) {
    return supabase
      .channel(`notifications-${role}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
      }, (payload) => {
        const targetRole = payload.new?.target_role;
        if (!targetRole || targetRole === role) {
          onInsert(payload.new);
        }
      })
      .subscribe();
  },
};
