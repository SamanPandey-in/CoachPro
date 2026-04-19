-- =============================================================
-- Auth Signup Trigger Fix
-- Fixes "Database error saving new user" during supabase.auth.signUp
-- by fully qualifying objects and safely handling role metadata.
-- =============================================================

BEGIN;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  desired_role public.user_role;
  role_text text;
BEGIN
  role_text := NEW.raw_user_meta_data->>'role';

  desired_role := CASE
    WHEN role_text IN ('admin', 'teacher', 'student') THEN role_text::public.user_role
    ELSE 'student'::public.user_role
  END;

  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    desired_role
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

COMMIT;
