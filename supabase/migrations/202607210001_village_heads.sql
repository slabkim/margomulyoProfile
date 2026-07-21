create table if not exists public.village_heads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_year integer not null,
  end_year integer not null,
  profile text not null default '',
  image_url text not null,
  is_published boolean not null default true,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint village_heads_name_length check (char_length(name) between 1 and 120),
  constraint village_heads_period_range check (start_year between 1900 and 2100 and end_year between start_year and 2100),
  constraint village_heads_profile_length check (char_length(profile) <= 2000),
  constraint village_heads_image_source check (
    image_url like '/images/%'
    or image_url like 'https://gwmhopqlfvmjkxzthqya.supabase.co/storage/v1/object/public/village-media/%'
  )
);

create index if not exists village_heads_period_idx on public.village_heads (start_year asc, end_year asc);
create unique index if not exists village_heads_one_current_idx on public.village_heads (is_current) where is_current = true;

create or replace function public.keep_single_current_village_head()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.is_current then
    update public.village_heads set is_current = false, updated_at = now()
    where is_current = true and id <> new.id;
  end if;
  return new;
end;
$$;

revoke all on function public.keep_single_current_village_head() from public, anon, authenticated;

create trigger village_heads_single_current
before insert or update of is_current on public.village_heads
for each row execute function public.keep_single_current_village_head();

alter table public.village_heads enable row level security;

create policy "visitors can read published village heads"
on public.village_heads for select to anon, authenticated
using (is_published = true);

create policy "active admins can read all village heads"
on public.village_heads for select to authenticated
using (public.is_active_admin());

create policy "active admins can insert village heads"
on public.village_heads for insert to authenticated
with check (public.is_active_admin());

create policy "active admins can update village heads"
on public.village_heads for update to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

create policy "active admins can delete village heads"
on public.village_heads for delete to authenticated
using (public.is_active_admin());

grant select on public.village_heads to anon;
grant select, insert, update, delete on public.village_heads to authenticated;
