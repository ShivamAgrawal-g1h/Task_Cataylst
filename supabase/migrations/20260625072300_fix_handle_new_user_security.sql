-- ─────────────────────────────────────────────────────────────
-- SECURITY FIX: Explicit schema + search_path
-- ─────────────────────────────────────────────────────────────
-- Drops and recreates the handle_new_user function with:
--   1. Explicit 'public.' schema prefix on user_profiles
--   2. SET search_path = public at function start
-- This prevents search_path injection attacks.
-- ─────────────────────────────────────────────────────────────

DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$;

-- Recreate the trigger (DROP FUNCTION CASCADE removed it)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
