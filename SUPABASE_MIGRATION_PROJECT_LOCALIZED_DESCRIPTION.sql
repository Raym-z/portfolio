-- Adds localized project descriptions.
-- Run once in the Supabase SQL editor. Safe to re-run.
--
-- Existing `projects.description` values are treated as the Indonesian
-- description and renamed to `description_id`. English descriptions start
-- empty and can be filled from the admin dashboard.

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'projects'
      and column_name = 'description'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'projects'
      and column_name = 'description_id'
  ) then
    alter table public.projects rename column description to description_id;
  end if;
end $$;

alter table public.projects
  add column if not exists description_id text not null default '';

alter table public.projects
  add column if not exists description_en text not null default '';

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'projects'
      and column_name = 'description'
  ) then
    execute $sql$
      update public.projects
      set description_id = description
      where coalesce(description_id, '') = ''
        and coalesce(description, '') <> ''
    $sql$;

    execute 'alter table public.projects drop column description';
  end if;
end $$;
