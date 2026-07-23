import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, BookOpen, HeartHandshake, Laptop } from 'lucide-react';
import '../public-pages.css';
import './page.css';

export const metadata: Metadata = {
  title: 'Tim Pengembang',
  description: 'Website Desa Margomulyo dikembangkan oleh Tim KKN Tematik Literasi Universitas Lampung Periode II Tahun 2026.',
  alternates: { canonical: '/tim-kkn' },
};

const contributions = [
  {
    icon: BookOpen,
    title: 'Literasi Informasi',
    description: 'Menyajikan informasi desa agar lebih terstruktur, mudah ditemukan, dan dapat dipahami oleh masyarakat.',
  },
  {
    icon: Laptop,
    title: 'Transformasi Digital',
    description: 'Mendukung pemanfaatan teknologi sebagai sarana pelayanan dan penyebaran informasi Desa Margomulyo.',
  },
  {
    icon: HeartHandshake,
    title: 'Pengabdian Masyarakat',
    description: 'Dikembangkan sebagai bagian dari semangat belajar, berkarya, dan mengabdi bersama masyarakat desa.',
  },
];

const teamMembers = [
  'Gokman Aganta Purba',
  'Calvin Jhanuar Akbar',
  'Sulthon Abdul Hakim',
  'Carissa Oktavia Sanjaya',
  'Fidela Ratnadewati',
  'Artika Maysafitri',
  'Ayu Faradhya',
];

export default function TimKknPage() {
  return (
    <>
      <header className="page-hero kkn-hero" data-index="26">
        <div className="container">
          <div className="page-crumb">Beranda <span>/</span> Tim Pengembang</div>
          <p className="kkn-hero-kicker">Universitas Lampung · 2026</p>
          <h1>Karya kecil untuk informasi desa yang lebih dekat.</h1>
          <p>Website ini hadir melalui kolaborasi, pembelajaran, dan pengabdian mahasiswa bersama masyarakat Desa Margomulyo.</p>
        </div>
      </header>

      <section className="content-section kkn-intro-section">
        <div className="container kkn-intro">
          <div className="kkn-period" aria-label="Periode KKN">
            <span>Periode</span>
            <strong>II</strong>
            <small>Tahun 2026</small>
          </div>
          <div className="kkn-copy">
            <span className="eyebrow">Tentang pengembang</span>
            <h2>Dibuat oleh Tim KKN Tematik Literasi Unila.</h2>
            <p>Portal Desa Margomulyo ini dikembangkan oleh <strong>Tim Kuliah Kerja Nyata (KKN) Tematik Literasi Universitas Lampung Periode II Tahun 2026</strong> sebagai bagian dari program pengabdian kepada masyarakat.</p>
            <p>Kami berharap website ini dapat menjadi ruang informasi yang bermanfaat, membantu pelayanan desa, serta mendokumentasikan potensi dan perjalanan Desa Margomulyo untuk waktu yang panjang.</p>
          </div>
        </div>
      </section>

      <section className="content-section content-section--cream kkn-team-section">
        <div className="container">
          <div className="section-heading kkn-team-heading">
            <div>
              <span className="eyebrow">Profil tim</span>
              <h2>Mahasiswa di balik website Desa Margomulyo.</h2>
            </div>
            <p>Kami datang untuk belajar, bertumbuh, dan menghasilkan karya yang dapat terus digunakan oleh masyarakat.</p>
          </div>

          <div className="kkn-team-photos">
            <figure>
              <Image
                src="/IMG_1889 (1).JPG"
                width={1920}
                height={1280}
                sizes="(max-width: 850px) 100vw, 50vw"
                alt="Tim KKN Tematik Literasi Universitas Lampung berfoto bersama di persawahan Desa Margomulyo"
                priority
              />
              <figcaption>Tim KKN Tematik Literasi Unila · Margomulyo 2026</figcaption>
            </figure>
            <figure>
              <Image
                src="/IMG_1890 (1).JPG"
                width={1920}
                height={1280}
                sizes="(max-width: 850px) 100vw, 50vw"
                alt="Kebersamaan Tim KKN Tematik Literasi Universitas Lampung di Desa Margomulyo"
              />
              <figcaption>Bertumbuh dan berkarya bersama masyarakat desa</figcaption>
            </figure>
          </div>

          <div className="kkn-member-list">
            {teamMembers.map((name, index) => (
              <div className="kkn-member" key={name}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{name}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="section-heading kkn-section-heading">
            <span className="eyebrow">Semangat karya</span>
            <h2>Teknologi yang tumbuh bersama desa.</h2>
          </div>
          <div className="kkn-contribution-grid">
            {contributions.map(({ icon: Icon, title, description }, index) => (
              <article className="kkn-contribution-card" key={title}>
                <div className="kkn-card-top">
                  <span className="feature-icon"><Icon size={23} /></span>
                  <span className="kkn-card-number">0{index + 1}</span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section kkn-closing-section">
        <div className="container kkn-closing">
          <p>Terima kasih kepada Pemerintah dan seluruh masyarakat Desa Margomulyo yang telah menjadi bagian dari proses belajar dan pengabdian kami.</p>
          <Link className="button button-light" href="/"><ArrowLeft size={17} /> Kembali ke Beranda</Link>
        </div>
      </section>
    </>
  );
}
