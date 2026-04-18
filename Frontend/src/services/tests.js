import { supabase } from '../lib/supabase';

export const testService = {
  // Admin/Teacher: get all tests (with subject and batch info)
  async getAll(batchId = null) {
    let query = supabase
      .from('tests')
      .select(`
        *,
        subjects(name),
        batches(name, course),
        profiles!teachers(name)
      `)
      .order('test_date', { ascending: false });

    if (batchId) query = query.eq('batch_id', batchId);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Admin: create a test
  async create(testData) {
    const { data, error } = await supabase
      .from('tests')
      .insert(testData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Teacher: upload marks for a test
  async uploadMarks(testId, marksArray) {
    // marksArray = [{ student_id, marks, is_absent, uploaded_by }]
    const records = marksArray.map(m => ({ ...m, test_id: testId }));
    const { data, error } = await supabase
      .from('test_results')
      .upsert(records, { onConflict: 'test_id,student_id' })
      .select();
    if (error) throw error;
    return data;
  },

  // Student: get own test results
  async getMyResults(studentId) {
    const { data, error } = await supabase
      .from('test_results')
      .select(`
        marks, is_absent, uploaded_at,
        tests(title, test_date, max_marks, subjects(name))
      `)
      .eq('student_id', studentId)
      .order('tests(test_date)', { ascending: false });
    if (error) throw error;
    return data;
  },
};
