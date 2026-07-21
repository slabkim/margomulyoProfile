import { Compass, Flag, Landmark, Sprout, Target, Users } from 'lucide-react';
import VillageHeadCarousel, { type VillageHeadProfile } from '@/components/VillageHeadCarousel';
import { createClient } from '@/lib/supabase/server';
import { OFFICIAL_MISSIONS, OFFICIAL_VISION } from '@/lib/village-data';
import '../public-pages.css';

export const metadata = { title: 'Profil Desa', description: 'Sejarah, visi, misi, dan kondisi wilayah Desa Margomulyo.' };
const villageHeads: VillageHeadProfile[] = [
  { name: 'Data belum tersedia', period: 'Belum ada periode', position: 'Kepala Desa Margomulyo', profile: 'Profil kepala desa dapat ditambahkan oleh administrator melalui panel pengelolaan website.', photo: undefined },
];

export default async function ProfilPage() {
  const supabase = await createClient();
  const [villageHeadsResult, profileResult] = await Promise.all([
    supabase.from('village_heads').select('name,start_year,end_year,profile,image_url,is_current').eq('is_published', true).order('start_year', { ascending: true }).order('end_year', { ascending: true }),
    supabase.from('village_profile').select('key,value'),
  ]);
  const villageHeadRows = villageHeadsResult.data;
  const profile = new Map(profileResult.data?.map((item) => [item.key, item.value || '']) ?? []);
  const vision = profile.get('vision') || OFFICIAL_VISION;
  const missions = [profile.get('mission_1'), profile.get('mission_2'), profile.get('mission_3')].map((mission, index) => mission || OFFICIAL_MISSIONS[index]);
  const displayedVillageHeads: VillageHeadProfile[] = villageHeadRows?.length
    ? villageHeadRows.map((head) => ({
        name: head.name,
        period: `${head.start_year}–${head.end_year}`,
        position: 'Kepala Desa Margomulyo',
        profile: head.profile || 'Profil kepala desa belum ditambahkan.',
        photo: head.image_url,
        isCurrent: head.is_current,
      }))
    : villageHeads;

  return <>
    <header className="page-hero" data-index="01"><div className="container"><div className="page-crumb">Beranda <span>/</span> Profil Desa</div><h1>Mengenal Margomulyo lebih dekat.</h1><p>Sejarah perjalanan, arah pembangunan, dan karakter wilayah yang membentuk kehidupan masyarakat desa.</p></div></header>
    <section className="content-section"><div className="container split-intro"><div><span className="eyebrow">Sejarah desa</span><h2>Berawal dari semangat membuka kehidupan baru.</h2></div><div className="prose"><p>Desa Margomulyo berkembang melalui program transmigrasi dari Pulau Jawa ke Provinsi Lampung. Kawasan yang dahulu berupa hutan dan lahan pertanian dibuka bertahap oleh para pendatang, lalu tumbuh menjadi permukiman melalui kerja bersama.</p><p>Masyarakat membangun rumah, lahan pertanian, fasilitas umum, dan kehidupan sosial dengan semangat gotong royong. Seiring berkembangnya jumlah penduduk dan aktivitas ekonomi, wilayah ini menjadi desa definitif bernama Margomulyo.</p><div className="quote-card"><p>“Margo” berarti jalan, sementara “Mulyo” berarti mulia atau sejahtera—jalan menuju kehidupan yang lebih baik.</p></div><p>Hari ini, Margomulyo terus berkembang sebagai desa agraris dengan potensi pertanian, perkebunan, dan usaha mikro masyarakat.</p></div></div></section>
    <section className="content-section content-section--cream"><div className="container"><div className="section-heading"><span className="eyebrow">Karakter desa</span><h2>Kekuatan yang tumbuh dari masyarakat.</h2></div><div className="feature-grid"><div className="feature-card"><span className="feature-icon"><Sprout /></span><h3>Desa Agraris</h3><p>Pertanian dan perkebunan menjadi penopang utama ekonomi keluarga.</p></div><div className="feature-card"><span className="feature-icon"><Users /></span><h3>Gotong Royong</h3><p>Kerja bersama menjadi nilai penting dalam pembangunan dan kehidupan sosial.</p></div><div className="feature-card"><span className="feature-icon"><Landmark /></span><h3>Tata Kelola</h3><p>Pemerintahan desa diarahkan untuk terbuka, melayani, dan bertanggung jawab.</p></div></div></div></section>
    <section className="content-section"><div className="container"><div className="section-heading"><span className="eyebrow">Kepemimpinan desa</span><h2>Melayani dari masa ke masa.</h2><p>Kenali kepala desa yang memimpin Margomulyo pada setiap periode dan perjalanan pengabdiannya untuk masyarakat.</p></div><VillageHeadCarousel profiles={displayedVillageHeads} /></div></section>
    <section className="content-section content-section--green"><div className="container"><div className="section-heading"><span className="eyebrow">Arah pembangunan</span><h2>Visi dan misi resmi desa.</h2><p>Sesuai dokumen Visi dan Misi Desa yang diberikan operator desa.</p></div><div className="vision-grid"><div className="vision-card"><span className="feature-icon"><Target /></span><div><h3>Visi</h3><p>{vision}</p></div></div><div className="mission-card"><h3><Flag size={22} /> Misi</h3><div className="mission-list">{missions.map((mission,index)=><div className="mission-item" key={mission}><span>0{index+1}</span><p>{mission}</p></div>)}</div></div></div></div></section>
    <section className="content-section"><div className="container"><div className="section-heading"><span className="eyebrow">Wilayah & administrasi</span><h2>Berada di Kecamatan Tegineneng.</h2><p>Informasi wilayah berikut diselaraskan dengan Rekap Penduduk 2026 dan Profil Desa Margomulyo 2019.</p></div><div className="info-grid"><div className="info-row"><span>Luas wilayah</span><strong>695,70 ha / 6,957 km²</strong></div><div className="info-row"><span>Luas persawahan</span><strong>500,75 ha</strong></div><div className="info-row"><span>Jumlah dusun</span><strong>6 dusun</strong></div><div className="info-row"><span>Jumlah penduduk</span><strong>4.081 jiwa</strong></div><div className="info-row"><span>Kecamatan</span><strong>Tegineneng</strong></div><div className="info-row"><span>Kabupaten</span><strong>Pesawaran</strong></div><div className="info-row"><span>Penetapan batas</span><strong>Sudah ada</strong></div><div className="info-row"><span>Dasar hukum batas</span><strong>Perda No. 7 Tahun 1988</strong></div></div><div className="notice"><Compass size={16} /> Sumber: dokumen resmi desa yang diberikan operator Desa Margomulyo.</div></div></section>
  </>;
}
