# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"** or sign in if you have an account
3. Fill in:
   - **Name**: `coachpro`
   - **Password**: Create a strong database password (save this somewhere safe)
   - **Region**: Choose the region closest to your users (e.g., **Mumbai** for `ap-south-1`)
4. Wait 2-3 minutes for the project to provision

## Step 2: Get Your API Keys

1. Go to **Settings → API**
2. Copy:
   - **Project URL** → Paste as `VITE_SUPABASE_URL` in `Frontend/.env`
   - **Publishable key (`sb_publishable_...`)** → Paste as `VITE_SUPABASE_PUBLISHABLE_KEY` in `Frontend/.env`
   - (Legacy fallback) **anon key** → can still be used as `VITE_SUPABASE_ANON_KEY`

Example `.env`:
```
VITE_SUPABASE_URL=https://abcdef123456.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxxx
# Optional legacy fallback:
# VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Run SQL Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `Frontend/docs/sql/01-schema.sql`
4. Paste into the editor and click **"Run"**
5. Wait for success message

## Step 4: Set Up Row Level Security (RLS)

1. In SQL Editor, create a **New Query**
2. Copy the entire contents of `Frontend/docs/sql/02-rls-policies.sql`
3. Paste and click **"Run"**
4. Wait for all policies to be created

## Step 5: Create PostgreSQL Views

1. In SQL Editor, create a **New Query**
2. Copy the entire contents of `Frontend/docs/sql/03-views.sql`
3. Paste and click **"Run"**
4. Wait for all views to be created

## Step 6: Test Your Connection

1. Save `Frontend/.env` with real Supabase credentials
2. In terminal, run: `cd Frontend && npm run dev`
3. Check browser console for any Supabase connection errors
4. If you see errors about missing env vars, restart the dev server after saving `.env`

### Optional: Run API Smoke Test + Seed Verification

1. Add admin credentials in `Frontend/.env`:
   - `TEST_ADMIN_EMAIL=...`
   - `TEST_ADMIN_PASSWORD=...`
2. Run:
   - `cd Frontend && npm run smoke:supabase`
3. The script will:
   - Validate client initialization with your Supabase URL/key
   - Sign in with admin credentials
   - Verify table reads (`profiles`, `batches`, `subjects`, `tests`)
   - Insert or reuse deterministic smoke records for quick verification

## Step 7: Update Frontend Auth (Next Steps)

After testing, you'll need to:
- Update `AuthContext.jsx` to use Supabase auth instead of localStorage/mock data
- Update `LoginPage.jsx` to call `supabase.auth.signInWithPassword()`
- Update page components to fetch data from Supabase tables instead of mockData

## Important Security Notes

- **NEVER commit `.env` to Git** — Add it to `.gitignore`
- The **publishable key** (`sb_publishable_...`) is public and safe in frontend code
- Legacy `anon` key is also public-safe, but publishable keys are the current recommendation
- RLS policies enforce authorization at the database level — only authenticated users can query
- For admin operations in backend jobs/services, use a **secret key** (`sb_secret_...`) only on secure servers

## Troubleshooting

**Missing Supabase env vars error:**
- Check `.env` has correct values (no extra spaces)
- Restart dev server: `npm run dev`
- Verify Settings → API shows your project URL and keys

**"permission denied" errors:**
- This means RLS policies aren't allowing the query
- Check Step 4: RLS policies must be enabled on all tables
- Most policies check `auth.uid()` — make sure you're signed in

**"Database error saving new user" during signup:**
- Run `Frontend/docs/sql/05-auth-trigger-fix.sql` in Supabase SQL Editor
- This updates the `on_auth_user_created` trigger to reliably insert into `public.profiles`
- Then rerun account creation/smoke commands

**Connection timeout:**
- Verify your Region in Supabase matches your location
- Check your internet connection
- Try refreshing the Supabase dashboard (sometimes provisioning delays)

---

## File Structure

Your SQL setup files are in:
- `Frontend/docs/sql/01-schema.sql` — Database tables and enums
- `Frontend/docs/sql/02-rls-policies.sql` — Row Level Security policies
- `Frontend/docs/sql/03-views.sql` — Aggregated data views
- `Frontend/docs/sql/04-seed-mock-data.sql` — Optional smoke seed data for verification
- `Frontend/docs/sql/05-auth-trigger-fix.sql` — Fix for auth signup trigger errors
