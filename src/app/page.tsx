import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, CalendarDays, ChevronRight, Clock3, FileText, HeartPulse,
  MapPin, MessageCircle, Sprout, Store, Users, Wheat,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { fallbackNewsArticles } from '@/lib/news';
import { buildHomepageStatistics } from '@/lib/statistics';
import { isSupabaseStorageUrl } from '@/lib/utils';
import { OFFICIAL_DATA_YEAR, OFFICIAL_POPULATION_STATS } from '@/lib/village-data';
import './page.css';

const services = [
  { icon: FileText, title: 'Administrasi Warga', text: 'Pengantar KTP, KK, pindah datang, dan dokumen kependudukan.', href: '/layanan' },
  { icon: HeartPulse, title: 'Kesehatan & Sosial', text: 'Informasi Posyandu, bantuan sosial, dan layanan masyarakat.', href: '/layanan' },
  { icon: Sprout, title: 'Pertanian Desa', text: 'Program kelompok tani, musim tanam, dan informasi bantuan.', href: '/berita' },
  { icon: Store, title: 'Potensi Desa', text: 'Jelajahi penggunaan lahan, pertanian, fasilitas umum, dan aset wilayah.', href: '/statistik' },
];

export default async function HomePage() {
  const supabase = await createClient();
  const [newsResult, statisticsResult, officialDataResult] = await Promise.all([
    supabase
      .from('news_articles')
      .select('id,slug,category,created_at,title,excerpt,image_url')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('population_stats')
      .select('label,value,year,updated_at')
      .order('year', { ascending: false })
      .order('updated_at', { ascending: false }),
    supabase.from('hamlet_demographics').select('id', { count: 'exact', head: true }).eq('year', OFFICIAL_DATA_YEAR),
  ]);
  const news = newsResult.data?.length ? newsResult.data : fallbackNewsArticles.slice(0, 3);
  const homepageStats = buildHomepageStatistics(officialDataResult.count ? (statisticsResult.data ?? []) : OFFICIAL_POPULATION_STATS);

  return (
    <>
      <section className="home-hero">
        <Image src="/images/hero-bg.png" alt="Hamparan lahan pertanian Desa Margo Mulyo" fill priority sizes="100vw" className="hero-image" />
        <div className="hero-shade" />
        <div className="container hero-layout">
          <div className="hero-copy">
            <p className="hero-kicker"><span /> Portal Resmi Pemerintah Desa</p>
            <h1>Tumbuh dari tanah,<br /><em>maju bersama.</em></h1>
            <p className="hero-lead">Margo Mulyo adalah rumah bagi masyarakat agraris yang hidup dari kerja keras, gotong royong, dan harapan untuk masa depan yang lebih baik.</p>
            <div className="hero-actions">
              <Link href="/profil" className="button button-primary">Kenali Desa Kami <ArrowRight size={17} /></Link>
              <Link href="/layanan" className="button hero-button-ghost">Lihat Layanan</Link>
            </div>
          </div>
          <aside className="hero-note">
            <MapPin size={19} />
            <div><span>Lokasi</span><strong>Kecamatan Tegineneng</strong><small>Kabupaten Pesawaran, Lampung</small></div>
          </aside>
        </div>
        <div className="hero-index">18.09.03.2012</div>
      </section>

      <section className="quick-strip">
        <div className="container quick-strip-inner">
          <div className="quick-title"><span>Pelayanan warga</span><strong>Apa yang Anda butuhkan?</strong></div>
          <div className="quick-links">
            <Link href="/layanan"><FileText size={18} /> Buat Surat <ChevronRight size={16} /></Link>
            <Link href="/kontak"><MessageCircle size={18} /> Hubungi Desa <ChevronRight size={16} /></Link>
            <Link href="/berita"><CalendarDays size={18} /> Agenda Desa <ChevronRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="section services-section surface-grid">
        <div className="container">
          <div className="services-heading">
            <div className="section-heading"><span className="eyebrow">Layanan & informasi</span><h2>Desa hadir lebih dekat untuk setiap warga.</h2></div>
            <p>Informasi publik dan kebutuhan administrasi dirangkum agar mudah ditemukan, dipahami, dan diakses oleh seluruh warga.</p>
          </div>
          <div className="service-grid">
            {services.map(({ icon: Icon, ...service }, index) => (
              <Link href={service.href} className="service-card" key={service.title}>
                <span className="service-number">0{index + 1}</span><Icon size={26} />
                <h3>{service.title}</h3><p>{service.text}</p><span className="service-more">Buka informasi <ArrowRight size={16} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section village-story">
        <div className="container story-grid">
          <div className="story-visual">
            <Image src="/images/hero-bg.png" alt="Lanskap pertanian yang menjadi sumber kehidupan warga" fill sizes="(max-width: 850px) 100vw, 50vw" />
            <div className="story-stamp"><Wheat size={28} /><span>Desa Agraris</span><strong>Pesawaran</strong></div>
          </div>
          <div className="story-copy">
            <span className="eyebrow">Cerita Margo Mulyo</span>
            <h2>Perjalanan menuju kemuliaan dan kesejahteraan.</h2>
            <p>Nama <strong>Margo Mulyo</strong> berakar dari bahasa Jawa: <em>margo</em> berarti jalan, dan <em>mulyo</em> berarti mulia atau sejahtera. Sebuah nama yang menjadi doa sekaligus arah pembangunan desa.</p>
            <p>Dibangun oleh masyarakat transmigran melalui semangat gotong royong, desa ini tumbuh bersama lahan pertanian, kebun, dan usaha warga.</p>
            <div className="story-values"><span><Sprout size={18} /> Lahan yang produktif</span><span><Users size={18} /> Warga yang guyub</span></div>
            <Link href="/profil" className="text-link">Baca kisah desa <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      <section className="facts-section">
        <div className="container facts-layout">
          <div className="facts-intro"><span className="eyebrow">Margo Mulyo dalam angka</span><h2>Data untuk pembangunan yang lebih tepat.</h2><Link href="/statistik" className="button button-light">Lihat statistik lengkap <ArrowRight size={16} /></Link></div>
          <div className="facts-grid">
            {homepageStats.map((item) => <div className="fact" key={item.label}><strong>{item.value}</strong><span>{item.label}</span><small>{item.note}</small></div>)}
          </div>
        </div>
      </section>

      <section className="section news-section">
        <div className="container">
          <div className="news-head"><div className="section-heading"><span className="eyebrow">Kabar dari desa</span><h2>Cerita, kegiatan, dan perkembangan terbaru.</h2></div><Link href="/berita" className="button button-outline">Semua berita <ArrowRight size={16} /></Link></div>
          <div className="news-grid">
            {news.map((item, index) => (
              <article className={`news-card ${index === 0 ? 'news-card--featured' : ''}`} key={item.id}>
                <Link href={`/berita/${item.slug}`} className="news-image"><Image src={item.image_url || '/images/hero-bg.png'} alt={item.title} fill unoptimized={isSupabaseStorageUrl(item.image_url)} sizes={index === 0 ? '(max-width: 800px) 100vw, 60vw' : '(max-width: 800px) 100vw, 30vw'} /></Link>
                <div className="news-body"><div className="news-meta"><span>{item.category}</span><time><Clock3 size={13} />{new Date(item.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}</time></div><h3><Link href={`/berita/${item.slug}`}>{item.title}</Link></h3><p>{item.excerpt}</p><Link href={`/berita/${item.slug}`} className="news-arrow" aria-label={`Baca ${item.title}`}><ArrowRight size={18} /></Link></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="closing-cta surface-grid">
        <div className="container closing-inner"><div><span className="eyebrow">Kantor desa terbuka untuk Anda</span><h2>Butuh bantuan atau informasi lebih lanjut?</h2><p>Datang langsung pada jam pelayanan atau hubungi perangkat desa melalui kanal resmi.</p></div><div className="closing-actions"><Link href="/kontak" className="button button-primary">Hubungi Kami <ArrowRight size={17} /></Link><span><Clock3 size={17} /> Senin–Jumat<br /><strong>08.00–13.00 WIB</strong></span></div></div>
      </section>
    </>
  );
}
