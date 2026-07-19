create or replace function public.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
      and is_active = true
  );
$$;

revoke all on function public.is_active_admin() from public, anon;
grant execute on function public.is_active_admin() to authenticated;

drop policy if exists "public can read published news" on public.news_articles;

create policy "visitors can read published news"
on public.news_articles for select to anon, authenticated
using (is_published = true);

create policy "active admins can read all news"
on public.news_articles for select to authenticated
using (public.is_active_admin());

alter table public.news_articles
  add constraint news_title_length check (char_length(title) between 1 and 180) not valid,
  add constraint news_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(slug) <= 200) not valid,
  add constraint news_excerpt_length check (excerpt is null or char_length(excerpt) <= 500) not valid,
  add constraint news_content_length check (char_length(content) <= 50000) not valid,
  add constraint news_category_length check (char_length(category) between 1 and 60) not valid,
  add constraint news_image_source check (
    image_url is null
    or image_url like '/images/%'
    or image_url like 'https://gwmhopqlfvmjkxzthqya.supabase.co/storage/v1/object/public/village-media/%'
  ) not valid;

alter table public.gallery_items
  add constraint gallery_title_length check (char_length(title) between 1 and 180) not valid,
  add constraint gallery_album_length check (char_length(album) between 1 and 80) not valid,
  add constraint gallery_description_length check (description is null or char_length(description) <= 500) not valid,
  add constraint gallery_image_source check (
    image_url like '/images/%'
    or image_url like 'https://gwmhopqlfvmjkxzthqya.supabase.co/storage/v1/object/public/village-media/%'
  ) not valid;

alter table public.population_stats
  add constraint stats_category_length check (char_length(category) between 1 and 80) not valid,
  add constraint stats_label_length check (char_length(label) between 1 and 120) not valid,
  add constraint stats_value_range check (value between 0 and 1000000000) not valid,
  add constraint stats_year_range check (year between 1900 and 2100) not valid;
