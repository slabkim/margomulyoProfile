-- Menghapus hanya data dummy dengan UUID yang disediakan oleh supabase/seed.sql.
delete from public.news_articles where id::text like '10000000-0000-4000-8000-%';
delete from public.gallery_items where id::text like '20000000-0000-4000-8000-%';
delete from public.population_stats where id::text like '30000000-0000-4000-8000-%';
