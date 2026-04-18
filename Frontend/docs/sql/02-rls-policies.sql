-- =============================================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================================

ALTER TABLE profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE students            ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers            ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches             ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects            ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance          ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests               ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results        ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lectures            ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications       ENABLE ROW LEVEL SECURITY;

-- =============================================================
-- HELPER FUNCTIONS
-- =============================================================

CREATE OR REPLACE FUNCTION auth_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION my_student_id()
RETURNS INTEGER AS $$
  SELECT id FROM students WHERE profile_id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION my_teacher_id()
RETURNS INTEGER AS $$
  SELECT id FROM teachers WHERE profile_id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- =============================================================
-- PROFILES POLICIES
-- =============================================================

CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid() OR auth_role() = 'admin');

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (auth_role() = 'admin');

-- =============================================================
-- STUDENTS POLICIES
-- =============================================================

CREATE POLICY "Admins and teachers read all students"
  ON students FOR SELECT
  USING (auth_role() IN ('admin', 'teacher'));

CREATE POLICY "Students read own record"
  ON students FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Admins manage students"
  ON students FOR ALL
  USING (auth_role() = 'admin');

-- =============================================================
-- TEACHERS POLICIES
-- =============================================================

CREATE POLICY "Admins and teachers read teacher records"
  ON teachers FOR SELECT
  USING (auth_role() IN ('admin', 'teacher'));

CREATE POLICY "Admins manage teachers"
  ON teachers FOR ALL
  USING (auth_role() = 'admin');

-- =============================================================
-- BATCHES / SUBJECTS / LECTURES POLICIES
-- =============================================================

CREATE POLICY "Anyone authenticated can read batches"
  ON batches FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins manage batches"
  ON batches FOR ALL USING (auth_role() = 'admin');

CREATE POLICY "Anyone authenticated can read subjects"
  ON subjects FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins manage subjects"
  ON subjects FOR ALL USING (auth_role() = 'admin');

CREATE POLICY "Anyone authenticated can read lectures"
  ON lectures FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and teachers manage lectures"
  ON lectures FOR ALL USING (auth_role() IN ('admin', 'teacher'));

-- =============================================================
-- ATTENDANCE POLICIES
-- =============================================================

CREATE POLICY "Teachers and admins read attendance"
  ON attendance FOR SELECT
  USING (auth_role() IN ('admin', 'teacher'));

CREATE POLICY "Students read their own attendance"
  ON attendance FOR SELECT
  USING (student_id = my_student_id());

CREATE POLICY "Teachers mark attendance"
  ON attendance FOR INSERT
  WITH CHECK (auth_role() = 'teacher' AND marked_by = my_teacher_id());

CREATE POLICY "Teachers update their own attendance records"
  ON attendance FOR UPDATE
  USING (auth_role() = 'teacher' AND marked_by = my_teacher_id());

CREATE POLICY "Admins manage all attendance"
  ON attendance FOR ALL USING (auth_role() = 'admin');

-- =============================================================
-- TESTS POLICIES
-- =============================================================

CREATE POLICY "Anyone authenticated reads tests"
  ON tests FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Teachers and admins manage tests"
  ON tests FOR ALL USING (auth_role() IN ('admin', 'teacher'));

-- =============================================================
-- TEST RESULTS POLICIES
-- =============================================================

CREATE POLICY "Admins and teachers read all results"
  ON test_results FOR SELECT
  USING (auth_role() IN ('admin', 'teacher'));

CREATE POLICY "Students read their own results"
  ON test_results FOR SELECT
  USING (student_id = my_student_id());

CREATE POLICY "Teachers upload results"
  ON test_results FOR INSERT
  WITH CHECK (auth_role() = 'teacher' AND uploaded_by = my_teacher_id());

CREATE POLICY "Admins manage results"
  ON test_results FOR ALL USING (auth_role() = 'admin');

-- =============================================================
-- ASSIGNMENTS POLICIES
-- =============================================================

CREATE POLICY "Anyone authenticated reads assignments"
  ON assignments FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Teachers and admins manage assignments"
  ON assignments FOR ALL USING (auth_role() IN ('admin', 'teacher'));

-- =============================================================
-- ASSIGNMENT SUBMISSIONS POLICIES
-- =============================================================

CREATE POLICY "Students read their own submissions"
  ON assignment_submissions FOR SELECT
  USING (student_id = my_student_id());

CREATE POLICY "Teachers read submissions in their subject"
  ON assignment_submissions FOR SELECT
  USING (auth_role() = 'teacher');

CREATE POLICY "Students create submissions"
  ON assignment_submissions FOR INSERT
  WITH CHECK (student_id = my_student_id());

CREATE POLICY "Students update their own submissions"
  ON assignment_submissions FOR UPDATE
  USING (student_id = my_student_id());

CREATE POLICY "Admins manage all submissions"
  ON assignment_submissions FOR ALL USING (auth_role() = 'admin');

-- =============================================================
-- NOTIFICATIONS POLICIES
-- =============================================================

CREATE POLICY "Users read notifications for their role"
  ON notifications FOR SELECT
  USING (
    target_role IS NULL
    OR target_role = auth_role()
    OR auth_role() = 'admin'
  );

CREATE POLICY "Admins create notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth_role() = 'admin');
