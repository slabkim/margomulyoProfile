import Image from 'next/image';
import Link from 'next/link';
import { CalendarClock, ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { fallbackNewsArticles } from '@/lib/news';
import { formatNewsEventDate, getNewsEventStatus, getNewsEventStatusLabel, sortNewsByEventStatus } from '@/lib/news-schedule';
import { isSupabaseStorageUrl } from '@/lib/utils';
import '../public-pages.css';

export const metadata = {
  title: 'Berita Desa',
  description: 'Berita, agenda, kegiatan warga, pelayanan, dan perkembangan terbaru dari Pemerintah Desa Margomulyo, Tegineneng, Pesawaran.',
  alternates: { canonical: '/berita' },
};

const categories = ['Pertanian', 'Pelayanan', 'Kegiatan'] as const;
const PAGE_SIZE = 10;
type Category = (typeof categories)[number];

function isCategory(value: string | string[] | undefined): value is Category {
  return typeof value === 'string' && categories.some((category) => category === value);
}

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string | string[]; cari?: string | string[]; halaman?: string | string[] }>;
}) {
  const { kategori, cari, halaman } = await searchParams;
  const activeCategory = isCategory(kategori) ? kategori : null;
  const searchQuery = typeof cari === 'string' ? cari.trim().slice(0, 100) : '';
  const supabase = await createClient();
  const { data } = await supabase
    .from('news_articles')
    .select('id,title,slug,excerpt,image_url,category,event_at,created_at')
    .eq('is_published', true)
    .order('event_at', { ascending: false });

  const allArticles = sortNewsByEventStatus([...(data?.length ? data : fallbackNewsArticles)]);
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
  const requestedPage = typeof halaman === 'string' && /^\d+$/.test(halaman) ? Math.max(Number(halaman), 1) : 1;
  const totalPages = Math.max(Math.ceil(articles.length / PAGE_SIZE), 1);
  const activePage = Math.min(requestedPage, totalPages);
  const visibleArticles = articles.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);
  const pageHref = (page: number) => ({ pathname: '/berita', query: { ...(activeCategory ? { kategori: activeCategory } : {}), ...(searchQuery ? { cari: searchQuery } : {}), ...(page > 1 ? { halaman: page } : {}) } });

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
          {visibleArticles.length ? (
            <>
            <div className="article-list">
              {visibleArticles.map((article) => {
                const eventStatus = getNewsEventStatus(article.event_at);
                return <Link href={`/berita/${article.slug}`} className="article-item" key={article.id}>
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
                      <span className={`article-status article-status--${eventStatus}`}>{getNewsEventStatusLabel(eventStatus)}</span>
                    </div>
                    <h2>{article.title}</h2>
                    <p>{article.excerpt}</p>
                    <time className="article-event-time" dateTime={article.event_at}><CalendarClock size={15} />{formatNewsEventDate(article.event_at)}</time>
                  </div>
                </Link>;
              })}
            </div>
            {totalPages > 1 && <nav className="content-pagination" aria-label="Paginasi berita">
              {activePage > 1 ? <Link href={pageHref(activePage - 1)} aria-label="Halaman berita sebelumnya"><ChevronLeft size={17} />Sebelumnya</Link> : <span className="disabled"><ChevronLeft size={17} />Sebelumnya</span>}
              <div>{Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <Link href={pageHref(page)} className={page === activePage ? 'active' : undefined} aria-current={page === activePage ? 'page' : undefined} key={page}>{page}</Link>)}</div>
              {activePage < totalPages ? <Link href={pageHref(activePage + 1)} aria-label="Halaman berita berikutnya">Berikutnya<ChevronRight size={17} /></Link> : <span className="disabled">Berikutnya<ChevronRight size={17} /></span>}
            </nav>}
            </>
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
