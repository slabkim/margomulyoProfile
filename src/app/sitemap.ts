import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { fallbackNewsArticles } from '@/lib/news';
import { absoluteUrl } from '@/lib/site';

const publicPages = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/profil', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/layanan', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/berita', changeFrequency: 'daily', priority: 0.9 },
  { path: '/statistik', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/galeri', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/kontak', changeFrequency: 'yearly', priority: 0.7 },
  { path: '/tim-kkn', changeFrequency: 'yearly', priority: 0.3 },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('news_articles')
    .select('slug,updated_at,created_at')
    .eq('is_published', true)
    .order('updated_at', { ascending: false });

  const articles = data?.length ? data : fallbackNewsArticles;

  return [
    ...publicPages.map(({ path, changeFrequency, priority }) => ({
      url: absoluteUrl(path),
      changeFrequency,
      priority,
    })),
    ...articles.map((article) => ({
      url: absoluteUrl(`/berita/${article.slug}`),
      lastModified: article.updated_at || article.created_at,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
