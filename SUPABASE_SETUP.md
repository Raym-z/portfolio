# Supabase Setup

This app works with mock data until Supabase is configured. Add the following to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Do **not** expose a service-role key in this app. Every admin operation runs with the signed-in user's session and is protected by RLS.

## 1. Required tables

### `profiles`

| Column       | Type          | Notes                                                         |
| ------------ | ------------- | ------------------------------------------------------------- |
| `id`         | `uuid`        | Primary key. References `auth.users(id)` on delete cascade.   |
| `email`      | `text`        | Optional mirror of the auth email.                            |
| `full_name`  | `text`        | Optional display name.                                        |
| `role`       | `text`        | Not null, default `'user'`, check `role in ('user','admin')`. |
| `created_at` | `timestamptz` | Not null, default `now()`.                                    |

### `projects`

| Column          | Type          | Notes                                                     |
| --------------- | ------------- | --------------------------------------------------------- |
| `id`            | `uuid`        | Primary key, default `gen_random_uuid()`.                 |
| `slug`          | `text`        | Not null, unique. Used by `/projects/[slug]`.             |
| `title`         | `text`        | Not null.                                                 |
| `description`   | `text`        | Not null, default `''`.                                   |
| `thumbnail_url` | `text`        | Nullable public Storage URL.                              |
| `tech_stack`    | `text[]`      | Not null, default `'{}'`.                                 |
| `features`      | `text[]`      | Not null, default `'{}'`.                                 |
| `live_url`      | `text`        | Nullable.                                                 |
| `github_url`    | `text`        | Nullable.                                                 |
| `published`     | `boolean`     | Not null, default `false`. Public site only reads `true`. |
| `display_order` | `integer`     | Not null, default `0`. Lower values appear first.         |
| `created_at`    | `timestamptz` | Not null, default `now()`.                                |
| `updated_at`    | `timestamptz` | Not null, default `now()`.                                |

### `certificates`

| Column          | Type          | Notes                                      |
| --------------- | ------------- | ------------------------------------------ |
| `id`            | `uuid`        | Primary key, default `gen_random_uuid()`.  |
| `title`         | `text`        | Not null.                                  |
| `issuer`        | `text`        | Nullable.                                  |
| `image_url`     | `text`        | Not null public Storage URL.               |
| `url`           | `text`        | Nullable external link (e.g. IEEE Xplore). |
| `display_order` | `integer`     | Not null, default `0`.                     |
| `created_at`    | `timestamptz` | Not null, default `now()`.                 |

### `comments`

| Column              | Type          | Notes                                                             |
| ------------------- | ------------- | ----------------------------------------------------------------- |
| `id`                | `uuid`        | Primary key, default `gen_random_uuid()`.                         |
| `user_name`         | `text`        | Not null.                                                         |
| `content`           | `text`        | Not null.                                                         |
| `profile_image_url` | `text`        | Nullable public Storage URL.                                      |
| `is_pinned`         | `boolean`     | Not null, default `false`. Public inserts must always be `false`. |
| `created_at`        | `timestamptz` | Not null, default `now()`.                                        |

### `contact_messages`

| Column       | Type          | Notes                                     |
| ------------ | ------------- | ----------------------------------------- |
| `id`         | `uuid`        | Primary key, default `gen_random_uuid()`. |
| `name`       | `text`        | Not null.                                 |
| `email`      | `text`        | Not null.                                 |
| `message`    | `text`        | Not null.                                 |
| `read`       | `boolean`     | Not null, default `false`. Admin-only.    |
| `created_at` | `timestamptz` | Not null, default `now()`.                |

## 2. Relationships

- `profiles.id` → `auth.users.id` (one-to-one).
- `projects`, `certificates`, `comments`, and `contact_messages` are independent content tables.
- No foreign keys are required between content tables.

## 3. Reference SQL

You can adapt and run this in the Supabase SQL editor. The app never runs migrations automatically.

```sql
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  thumbnail_url text,
  tech_stack text[] not null default '{}',
  features text[] not null default '{}',
  live_url text,
  github_url text,
  published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text,
  image_url text not null,
  url text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_name text not null,
  content text not null,
  profile_image_url text,
  is_pinned boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.certificates
  add column if not exists url text;

create index if not exists projects_public_order_idx
  on public.projects (published, display_order, created_at desc);
create index if not exists certificates_order_idx
  on public.certificates (display_order, created_at desc);
create index if not exists comments_created_idx
  on public.comments (created_at desc);
create index if not exists comments_pinned_idx
  on public.comments (is_pinned);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();
```

### Automatic profile creation

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
```

### Promote an admin

After creating the user in Supabase Auth, run:

```sql
insert into public.profiles (id, email, full_name, role)
values ('<auth-user-uuid>', 'admin@example.com', 'Your Name', 'admin')
on conflict (id) do update
set role = 'admin',
    email = excluded.email,
    full_name = excluded.full_name;
```

## 4. Required storage buckets

Create these buckets in **Storage**:

| Bucket               | Public | Max size | Allowed MIME |
| -------------------- | ------ | -------- | ------------ |
| `project-images`     | Yes    | 8 MB     | `image/*`    |
| `certificate-images` | Yes    | 8 MB     | `image/*`    |
| `profile-images`     | Yes    | 5 MB     | `image/*`    |

The app uploads to:

- `project-images/projects/<uuid>.<ext>`
- `certificate-images/certificates/<uuid>.<ext>`
- `profile-images/avatars/<uuid>.<ext>`

## 5. RLS policies

Enable RLS on every table. Use this helper to avoid recursive profile policy checks:

```sql
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;
```

### `profiles`

```sql
alter table public.profiles enable row level security;

create policy "profiles_select_own_or_admin"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_name"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid() and role = 'user');
```

If you want admins to be able to update profiles, add a separate `for update` policy guarded by `public.is_admin()`.

### `projects`

```sql
alter table public.projects enable row level security;

create policy "projects_public_read_published"
on public.projects for select
to anon, authenticated
using (published = true);

create policy "projects_admin_read_all"
on public.projects for select
to authenticated
using (public.is_admin());

create policy "projects_admin_insert"
on public.projects for insert
to authenticated
with check (public.is_admin());

create policy "projects_admin_update"
on public.projects for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "projects_admin_delete"
on public.projects for delete
to authenticated
using (public.is_admin());
```

### `certificates`

```sql
alter table public.certificates enable row level security;

create policy "certificates_public_read"
on public.certificates for select
to anon, authenticated
using (true);

create policy "certificates_admin_insert"
on public.certificates for insert
to authenticated
with check (public.is_admin());

create policy "certificates_admin_update"
on public.certificates for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "certificates_admin_delete"
on public.certificates for delete
to authenticated
using (public.is_admin());
```

### `comments`

Public visitors may read comments and insert a comment, but they must not be able to set `is_pinned` or modify/delete comments.

```sql
alter table public.comments enable row level security;

create policy "comments_public_read"
on public.comments for select
to anon, authenticated
using (true);

create policy "comments_public_insert"
on public.comments for insert
to anon, authenticated
with check (
  is_pinned = false
  and char_length(trim(user_name)) between 2 and 40
  and char_length(trim(content)) between 2 and 500
);

create policy "comments_admin_update"
on public.comments for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "comments_admin_delete"
on public.comments for delete
to authenticated
using (public.is_admin());
```

### `contact_messages`

```sql
alter table public.contact_messages enable row level security;

create policy "messages_public_insert"
on public.contact_messages for insert
to anon, authenticated
with check (
  char_length(trim(name)) between 2 and 80
  and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  and char_length(trim(message)) between 10 and 2000
  and read = false
);

create policy "messages_admin_read"
on public.contact_messages for select
to authenticated
using (public.is_admin());

create policy "messages_admin_update"
on public.contact_messages for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "messages_admin_delete"
on public.contact_messages for delete
to authenticated
using (public.is_admin());
```

### Storage policies

Enable RLS on `storage.objects` (usually enabled already) and add:

```sql
create policy "public_read_project_images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'project-images');

create policy "public_read_certificate_images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'certificate-images');

create policy "public_read_profile_images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'profile-images');

create policy "admin_write_project_images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'project-images' and public.is_admin());

create policy "admin_update_project_images"
on storage.objects for update
to authenticated
using (bucket_id = 'project-images' and public.is_admin())
with check (bucket_id = 'project-images' and public.is_admin());

create policy "admin_delete_project_images"
on storage.objects for delete
to authenticated
using (bucket_id = 'project-images' and public.is_admin());

create policy "admin_write_certificate_images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'certificate-images' and public.is_admin());

create policy "admin_update_certificate_images"
on storage.objects for update
to authenticated
using (bucket_id = 'certificate-images' and public.is_admin())
with check (bucket_id = 'certificate-images' and public.is_admin());

create policy "admin_delete_certificate_images"
on storage.objects for delete
to authenticated
using (bucket_id = 'certificate-images' and public.is_admin());

create policy "public_upload_comment_avatars"
on storage.objects for insert
to anon, authenticated
with check (
  bucket_id = 'profile-images'
  and (storage.foldername(name))[1] = 'avatars'
);

create policy "admin_delete_profile_images"
on storage.objects for delete
to authenticated
using (bucket_id = 'profile-images' and public.is_admin());
```

If your Supabase project rejects public insert policies on `storage.objects`, keep the `profile-images` bucket public and add the avatar upload through a signed upload URL in a route handler instead.

## 6. Realtime

Enable Realtime for comments:

```sql
alter table public.comments replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'comments'
  ) then
    alter publication supabase_realtime add table public.comments;
  end if;
end;
$$;
```

The public comments component subscribes to `postgres_changes` on `public.comments`. RLS still applies to realtime payloads, so anonymous visitors only receive rows they are allowed to read.

## 7. Starter content

After the schema, buckets, and policies are in place, run [`SEED_CONTENT.sql`](./SEED_CONTENT.sql) in the Supabase SQL editor. It inserts Raymond's six portfolio projects and two research publications. It does not change the schema or RLS and is safe to re-run.

The `certificates` table is used for both publications and certificates. The public section is labeled **Research & credentials**, and the admin section is **Research**.

## 8. Verification checklist

- [ ] `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set locally and on the host.
- [ ] An `admin` profile exists for your login user.
- [ ] All three storage buckets exist and are public.
- [ ] RLS is enabled on all five tables.
- [ ] Anonymous users can read published projects, certificates, and comments.
- [ ] Anonymous users cannot read drafts, contact messages, or profiles.
- [ ] Anonymous users can insert a comment only with `is_pinned = false`.
- [ ] Admin can create/edit/delete projects and certificates, upload images, pin comments, and manage messages.
- [ ] Realtime updates arrive in the comments section without a refresh.

Until these steps are complete, the public site renders demo content and admin actions return a clear "Supabase is not configured" error.
