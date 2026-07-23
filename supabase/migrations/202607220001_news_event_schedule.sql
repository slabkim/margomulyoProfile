alter table public.news_articles
add column if not exists event_at timestamptz;

update public.news_articles
set event_at = created_at
where event_at is null;

alter table public.news_articles
alter column event_at set default now(),
alter column event_at set not null;

comment on column public.news_articles.event_at is
'Tanggal dan waktu pelaksanaan kegiatan. Status akan datang/terlaksana dihitung otomatis oleh aplikasi.';
