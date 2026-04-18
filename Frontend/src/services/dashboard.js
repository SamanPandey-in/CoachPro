import { supabase } from '../lib/supabase';

export const dashboardService = {
  async getAdminStats() {
    const [studentsRes, teachersRes, attendanceRes, testsRes] = await Promise.all([
      supabase.from('students').select('id', { count: 'exact' }).eq('is_active', true),
      supabase.from('teachers').select('id', { count: 'exact' }).eq('is_active', true),
      supabase.from('today_attendance_summary').select('*'),
      supabase.from('tests').select('id', { count: 'exact' }),
    ]);

    const totalPresent = attendanceRes.data?.reduce((s, b) => s + (b.present || 0), 0) ?? 0;
    const totalStudents = studentsRes.count ?? 0;

    return {
      totalStudents,
      totalTeachers: teachersRes.count ?? 0,
      todayAttendance: totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0,
      totalTests: testsRes.count ?? 0,
      attendanceSummary: attendanceRes.data ?? [],
    };
  },

  async getTeacherStats(teacherId) {
    const [subjectsRes, lecturesRes, assignmentsRes] = await Promise.all([
      supabase.from('subjects').select('batch_id').eq('teacher_id', teacherId),
      supabase.from('lectures').select('id', { count: 'exact' }).eq('teacher_id', teacherId).eq('is_active', true),
      supabase.from('assignments').select('id', { count: 'exact' }).eq('created_by', teacherId),
    ]);

    const batchIds = [...new Set(subjectsRes.data?.map(s => s.batch_id) ?? [])];
    const studentCountRes = batchIds.length > 0
      ? await supabase.from('students').select('id', { count: 'exact' }).in('batch_id', batchIds)
      : { count: 0 };

    return {
      studentCount: studentCountRes.count ?? 0,
      weeklyLectures: lecturesRes.count ?? 0,
      totalAssignments: assignmentsRes.count ?? 0,
    };
  },

  async getStudentStats(studentId) {
    const [resultsRes, attendanceRes, pendingRes] = await Promise.all([
      supabase.from('test_results')
        .select('marks, tests(max_marks)')
        .eq('student_id', studentId)
        .eq('is_absent', false),
      supabase.from('attendance')
        .select('status')
        .eq('student_id', studentId),
      supabase.from('assignment_submissions')
        .select('id', { count: 'exact' })
        .eq('student_id', studentId)
        .eq('status', 'pending'),
    ]);

    const marks = resultsRes.data ?? [];
    const avgScore = marks.length > 0
      ? Math.round(marks.reduce((s, r) => s + (r.marks / r.tests.max_marks) * 100, 0) / marks.length)
      : 0;

    const attendance = attendanceRes.data ?? [];
    const attendancePct = attendance.length > 0
      ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100)
      : 0;

    return {
      avgScore,
      attendancePct,
      pendingAssignments: pendingRes.count ?? 0,
      testsTotal: marks.length,
    };
  },
};
