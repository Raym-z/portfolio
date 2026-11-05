# Portfolio

A dark, modern personal portfolio built with Next.js 16 (App Router), TypeScript, Tailwind CSS, Supabase, Framer Motion, Lucide, and SweetAlert2.

## Features

- Animated hero with typewriter titles, custom developer illustration, social links, and CTAs
- About section with skills, stats, and profile card
- Supabase-backed projects with filters, detail modals, and case-study pages
- Certificate gallery with keyboard-navigable lightbox
- Public guestbook with avatar upload, pinned comments, and Supabase Realtime
- Contact form persisted to Supabase plus email/social links
- Protected admin dashboard with overview, project CRUD, image uploads, publish/order controls, certificate management, comment moderation, and a contact inbox
- Mock data fallback when Supabase is not configured

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

To connect Supabase, create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

If these variables are missing, the public site renders demo content. Admin login and mutations stay disabled until Supabase is configured. See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for the tables, buckets, RLS policies, Realtime setup, and admin promotion steps.

After applying the schema, run [SEED_CONTENT.sql](./SEED_CONTENT.sql) in the Supabase SQL editor to load Raymond's starter projects and publications. It only inserts content; it does not change the schema or RLS.

While the tables are completely empty, the public site falls back to the same bundled starter content so it never looks unfinished. Set `USE_STARTER_CONTENT=false` to show empty states instead. Once you add or seed any rows, Supabase becomes the source of truth.

## Personalization

Most static personal content lives in `lib/site-config.ts`:

- Name, role, tagline, location, email, resume URL, and canonical site URL
- Hero titles, technology badges, and social links
- About copy, quote, skills, and experience years

Replace the demo copy and social URLs with your own. Project, certificate, comment, and message content is managed from `/admin` after Supabase is connected.

## Scripts

```bash
npm run dev        # development
npm run build      # production build
npm run start      # production server
npm run lint       # ESLint
npm run typecheck  # TypeScript
```

## Notes

- The app uses Next.js 16 Cache Components. Public project and certificate reads are cached with tags and invalidated by admin Server Actions.
- Admin routes are protected by a Supabase session refresh in `proxy.ts`, a server-side profile role check in `app/admin/layout.tsx`, and RLS at the database layer.
- No database migrations are run automatically. Apply the SQL in `SUPABASE_SETUP.md` yourself.
