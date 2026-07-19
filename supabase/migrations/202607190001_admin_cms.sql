create extension if not exists "pgcrypto";

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Administrator',
  role text not null default 'editor' check (role in ('super_admin', 'editor')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null default '',
  excerpt text,
  image_url text,
  category text not null default 'Berita',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  album text not null default 'Kegiatan',
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.population_stats (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  label text not null,
  value numeric not null,
  year integer not null,
  updated_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.news_articles enable row level security;
alter table public.gallery_items enable row level security;
alter table public.population_stats enable row level security;

create or replace function public.is_active_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.admin_users where user_id = (select auth.uid()) and is_active = true); $$;

revoke all on function public.is_active_admin() from public;
grant execute on function public.is_active_admin() to authenticated;

create policy "admin can read own role" on public.admin_users for select to authenticated using (user_id = (select auth.uid()));
create policy "public can read published news" on public.news_articles for select to anon, authenticated using (is_published = true or public.is_active_admin());
create policy "admin can insert news" on public.news_articles for insert to authenticated with check (public.is_active_admin());
create policy "admin can update news" on public.news_articles for update to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy "admin can delete news" on public.news_articles for delete to authenticated using (public.is_active_admin());
create policy "public can read gallery" on public.gallery_items for select to anon, authenticated using (true);
create policy "admin can insert gallery" on public.gallery_items for insert to authenticated with check (public.is_active_admin());
create policy "admin can update gallery" on public.gallery_items for update to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy "admin can delete gallery" on public.gallery_items for delete to authenticated using (public.is_active_admin());
create policy "public can read statistics" on public.population_stats for select to anon, authenticated using (true);
create policy "admin can insert statistics" on public.population_stats for insert to authenticated with check (public.is_active_admin());
create policy "admin can update statistics" on public.population_stats for update to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy "admin can delete statistics" on public.population_stats for delete to authenticated using (public.is_active_admin());

grant select on public.news_articles, public.gallery_items, public.population_stats to anon;
grant select, insert, update, delete on public.news_articles, public.gallery_items, public.population_stats to authenticated;
grant select on public.admin_users to authenticated;

-- Setelah membuat user di Authentication > Users, jalankan:
-- insert into public.admin_users (user_id, full_name, role)
-- values ('UUID_USER_DARI_AUTH', 'Nama Administrator', 'super_admin');
