import { supabase } from '../lib/supabase';

export const assignmentService = {
  async getForTeacher(teacherId) {
    const { data, error } = await supabase
      .from('assignments')
      .select('id, title, description, due_date, batch_id, subject_id, assignment_submissions(id, status), subjects(name), batches(name)')
      .eq('created_by', teacherId)
      .order('due_date', { ascending: true });
    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from('assignments')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getForStudent(studentId, batchId) {
    const { data, error } = await supabase
      .from('assignments')
      .select('id, title, description, due_date, subject_id, batch_id, subjects(name), assignment_submissions(id, status, submission_url, submitted_at)')
      .eq('batch_id', batchId)
      .order('due_date', { ascending: true });
    if (error) throw error;

    return (data || []).map((a) => {
      const mine = (a.assignment_submissions || []).find((s) => s.student_id === studentId) || a.assignment_submissions?.[0];
      return {
        ...a,
        my_submission: mine || null,
      };
    });
  },

  async submit(assignmentId, studentId, submissionUrl) {
    const { data, error } = await supabase
      .from('assignment_submissions')
      .upsert({
        assignment_id: assignmentId,
        student_id: studentId,
        status: 'submitted',
        submission_url: submissionUrl,
        submitted_at: new Date().toISOString(),
      }, { onConflict: 'assignment_id,student_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
