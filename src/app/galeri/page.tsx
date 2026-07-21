import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseStorageUrl } from '@/lib/utils';
import '../public-pages.css';

export const metadata = {
  title: 'Galeri Desa',
  description: 'Dokumentasi kegiatan dan potensi Desa Margomulyo.',
};

const fallback = [
  { id: '1', title: 'Hamparan pertanian desa', album: 'Potensi Desa', image_url: null },
  { id: '2', title: 'Kegiatan kelompok tani', album: 'Pertanian', image_url: null },
  { id: '3', title: 'Panen bersama warga', album: 'Gotong Royong', image_url: null },
  { id: '4', title: 'Lanskap Margomulyo', album: 'Lingkungan', image_url: null },
  { id: '5', title: 'Kebun produktif warga', album: 'Ekonomi', image_url: null },
];

const galleryFilters = ['Kegiatan', 'Potensi'] as const;
type GalleryFilter = (typeof galleryFilters)[number];

function isGalleryFilter(value: string | string[] | undefined): value is GalleryFilter {
  return typeof value === 'string' && galleryFilters.some((filter) => filter === value);
}

function galleryGroup(album: string): GalleryFilter {
  const potentialKeywords = ['potensi', 'pertanian', 'ekonomi', 'lingkungan', 'umkm', 'wisata'];
  return potentialKeywords.some((keyword) => album.toLowerCase().includes(keyword)) ? 'Potensi' : 'Kegiatan';
}

export default async function GaleriPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string | string[]; cari?: string | string[] }>;
}) {
  const { kategori, cari } = await searchParams;
  const activeFilter = isGalleryFilter(kategori) ? kategori : null;
  const searchQuery = typeof cari === 'string' ? cari.trim().slice(0, 100) : '';
  const supabase = await createClient();
  const { data } = await supabase
    .from('gallery_items')
    .select('id,title,album,image_url')
    .order('created_at', { ascending: false })
    .limit(12);

  const allGallery = data?.length ? data : fallback;
  let gallery = activeFilter
    ? allGallery.filter((item) => galleryGroup(item.album) === activeFilter)
    : allGallery;
  if (searchQuery) {
    const normalizedQuery = searchQuery.toLowerCase();
    gallery = gallery.filter((item) =>
      [item.title, item.album].some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }

  return (
    <>
      <header className="page-hero" data-index="05">
        <div className="container">
          <div className="page-crumb">Beranda <span>/</span> Galeri</div>
          <h1>Wajah dan cerita desa.</h1>
          <p>Dokumentasi kegiatan warga, potensi wilayah, serta momen kebersamaan di Desa Margomulyo.</p>
        </div>
      </header>
      <section className="content-section">
        <div className="container">
          <div className="listing-head">
            <div className="section-heading">
              <span className="eyebrow">Dokumentasi</span>
              <h2>Margomulyo dalam bingkai</h2>
            </div>
            <nav className="filter-chips" aria-label="Filter kategori galeri">
              <Link href={searchQuery ? { pathname: '/galeri', query: { cari: searchQuery } } : '/galeri'} className={!activeFilter ? 'active' : undefined} aria-current={!activeFilter ? 'page' : undefined}>Semua</Link>
              {galleryFilters.map((filter) => (
                <Link
                  href={{ pathname: '/galeri', query: { kategori: filter, ...(searchQuery ? { cari: searchQuery } : {}) } }}
                  className={activeFilter === filter ? 'active' : undefined}
                  aria-current={activeFilter === filter ? 'page' : undefined}
                  key={filter}
                >
                  {filter}
                </Link>
              ))}
            </nav>
          </div>
          <form className="content-search" method="get" action="/galeri" role="search">
            {activeFilter && <input type="hidden" name="kategori" value={activeFilter} />}
            <label htmlFor="gallery-search">Cari galeri</label>
            <div>
              <input id="gallery-search" type="search" name="cari" defaultValue={searchQuery} placeholder="Cari judul atau album galeri..." maxLength={100} />
              <button type="submit">Cari</button>
            </div>
            {searchQuery && <Link href={activeFilter ? { pathname: '/galeri', query: { kategori: activeFilter } } : '/galeri'}>Hapus pencarian</Link>}
          </form>
          {gallery.length ? (
            <div className="gallery-grid">
              {gallery.map((item) => (
                <figure className="gallery-item" key={item.id}>
                  <Image src={item.image_url || '/images/hero-bg.png'} alt={item.title} fill unoptimized={isSupabaseStorageUrl(item.image_url)} sizes="(max-width: 580px) 100vw, (max-width: 850px) 50vw, 40vw" />
                  <figcaption className="gallery-overlay"><strong>{item.title}</strong><span>{item.album}</span></figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="article-empty">
              <h2>Galeri tidak ditemukan.</h2>
              <p>Coba kata kunci atau kategori lain, lalu lakukan pencarian kembali.</p>
              <Link href="/galeri" className="button button-outline">Lihat semua galeri</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
