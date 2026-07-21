import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { fallbackNewsArticles } from '@/lib/news';
import { isSupabaseStorageUrl } from '@/lib/utils';
import '../public-pages.css';

export const metadata = {
  title: 'Berita Desa',
  description: 'Kabar dan kegiatan terbaru Desa Margomulyo.',
};

const categories = ['Pertanian', 'Pelayanan', 'Kegiatan'] as const;
type Category = (typeof categories)[number];

function isCategory(value: string | string[] | undefined): value is Category {
  return typeof value === 'string' && categories.some((category) => category === value);
}

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string | string[]; cari?: string | string[] }>;
}) {
  const { kategori, cari } = await searchParams;
  const activeCategory = isCategory(kategori) ? kategori : null;
  const searchQuery = typeof cari === 'string' ? cari.trim().slice(0, 100) : '';
  const supabase = await createClient();
  const { data } = await supabase
    .from('news_articles')
    .select('id,title,slug,excerpt,image_url,category,created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  const allArticles = data?.length ? data : fallbackNewsArticles;
  let articles = activeCategory
    ? allArticles.filter((article) => article.category === activeCategory)
    : allArticles;
  if (searchQuery) {
    const normalizedQuery = searchQuery.toLowerCase();
    articles = articles.filter((article) =>
      [article.title, article.excerpt, article.category]
        .some((value) => value?.toLowerCase().includes(normalizedQuery)),
    );
  }

  return (
    <>
      <header className="page-hero" data-index="02">
        <div className="container">
          <div className="page-crumb">Beranda <span>/</span> Berita</div>
          <h1>Kabar dari Margomulyo.</h1>
          <p>Catatan kegiatan, informasi pelayanan, dan perkembangan terbaru dari seluruh penjuru desa.</p>
        </div>
      </header>
      <section className="content-section surface-grid">
        <div className="container">
          <div className="listing-head">
            <div className="section-heading">
              <span className="eyebrow">Informasi terkini</span>
              <h2>Berita & kegiatan desa</h2>
            </div>
            <nav className="filter-chips" aria-label="Filter kategori berita">
              <Link href={searchQuery ? { pathname: '/berita', query: { cari: searchQuery } } : '/berita'} className={!activeCategory ? 'active' : undefined} aria-current={!activeCategory ? 'page' : undefined}>Semua</Link>
              {categories.map((category) => (
                <Link
                  href={{ pathname: '/berita', query: { kategori: category, ...(searchQuery ? { cari: searchQuery } : {}) } }}
                  className={activeCategory === category ? 'active' : undefined}
                  aria-current={activeCategory === category ? 'page' : undefined}
                  key={category}
                >
                  {category}
                </Link>
              ))}
            </nav>
          </div>
          <form className="content-search" method="get" action="/berita" role="search">
            {activeCategory && <input type="hidden" name="kategori" value={activeCategory} />}
            <label htmlFor="news-search">Cari berita</label>
            <div>
              <input id="news-search" type="search" name="cari" defaultValue={searchQuery} placeholder="Cari judul atau isi berita..." maxLength={100} />
              <button type="submit">Cari</button>
            </div>
            {searchQuery && <Link href={activeCategory ? { pathname: '/berita', query: { kategori: activeCategory } } : '/berita'}>Hapus pencarian</Link>}
          </form>
          {articles.length ? (
            <div className="article-list">
              {articles.map((article) => (
                <Link href={`/berita/${article.slug}`} className="article-item" key={article.id}>
                  <div className="article-photo">
                    <Image
                      src={article.image_url || '/images/hero-bg.png'}
                      alt={article.title}
                      fill
                      unoptimized={isSupabaseStorageUrl(article.image_url)}
                      sizes="(max-width: 580px) 100vw, (max-width: 850px) 50vw, 33vw"
                    />
                  </div>
                  <div className="article-content">
                    <div className="article-meta">
                      <span>{article.category}</span>
                      <time>{new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                    </div>
                    <h2>{article.title}</h2>
                    <p>{article.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="article-empty">
              <h2>Berita tidak ditemukan.</h2>
              <p>Coba kata kunci atau kategori lain, lalu lakukan pencarian kembali.</p>
              <Link href="/berita" className="button button-outline">Lihat semua berita</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
