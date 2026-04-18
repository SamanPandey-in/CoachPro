# Backend (Deprecated)

This directory is intentionally minimal. The Express + MongoDB backend has been replaced by **Supabase**.

## Why the Migration?

- **Supabase** provides a fully managed PostgreSQL database with auto-generated REST API, authentication, and real-time subscriptions
- **No server deployment needed** — the frontend talks directly to Supabase's REST endpoints
- **Built-in security** — Row Level Security (RLS) policies enforce authorization at the database level
- **Faster development** — no middleware to write; focus on frontend

## What to Do?

1. **Reference the archived code**: See `Backend_legacy/` if you need to review the old Express code
2. **Frontend setup**: See `SUPABASE_SETUP.md` at the project root for complete Supabase setup instructions
3. **Get API keys**: Go to your Supabase project → Settings → API → Copy URL and Anon Key
4. **Update Frontend/.env** with:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-key-here
   ```

## Supabase Client

The frontend now imports Supabase directly:

```javascript
import { supabase } from '../lib/supabase';

// Example: fetch students
const { data, error } = await supabase
  .from('students')
  .select('*');
```

## Questions?

- Supabase docs: https://supabase.com/docs
- Schema reference: `Frontend/docs/sql/01-schema.sql`
- RLS policies: `Frontend/docs/sql/02-rls-policies.sql`
- Views for aggregation: `Frontend/docs/sql/03-views.sql`

---

**Note**: The `Backend_legacy/` folder contains the full Express + Mongoose codebase if you ever need to revert or reference it.
