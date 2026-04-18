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
   - **anon public key** → Paste as `VITE_SUPABASE_ANON_KEY` in `Frontend/.env`

Example `.env`:
```
VITE_SUPABASE_URL=https://abcdef123456.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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

## Step 7: Update Frontend Auth (Next Steps)

After testing, you'll need to:
- Update `AuthContext.jsx` to use Supabase auth instead of localStorage/mock data
- Update `LoginPage.jsx` to call `supabase.auth.signInWithPassword()`
- Update page components to fetch data from Supabase tables instead of mockData

## Important Security Notes

- **NEVER commit `.env` to Git** — Add it to `.gitignore`
- The `anon` key is public and safe in frontend code (that's its purpose)
- RLS policies enforce authorization at the database level — only authenticated users can query
- For admin operations, create a service role key (Settings → API → Service role key) and use it only on a backend server

## Troubleshooting

**Missing Supabase env vars error:**
- Check `.env` has correct values (no extra spaces)
- Restart dev server: `npm run dev`
- Verify Settings → API shows your project URL and keys

**"permission denied" errors:**
- This means RLS policies aren't allowing the query
- Check Step 4: RLS policies must be enabled on all tables
- Most policies check `auth.uid()` — make sure you're signed in

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
