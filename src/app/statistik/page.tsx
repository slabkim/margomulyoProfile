import { Database, FileSpreadsheet, Map, Users } from 'lucide-react';
import VillagePotentialExplorer from '@/components/VillagePotentialExplorer';
import VillageStatisticsDashboard from '@/components/VillageStatisticsDashboard';
import { createClient } from '@/lib/supabase/server';
import { buildHomepageStatistics } from '@/lib/statistics';
import {
  OFFICIAL_DATA_YEAR, OFFICIAL_HAMLET_DEMOGRAPHICS, OFFICIAL_POPULATION_STATS,
  OFFICIAL_POTENTIALS, POTENTIAL_DATA_YEAR, type HamletDemographic, type VillagePotential,
} from '@/lib/village-data';
import '../public-pages.css';

export const metadata = {
  title: 'Data Desa',
  description: 'Data resmi kependudukan, wilayah, dan potensi Desa Margomulyo.',
};

export default async function StatistikPage() {
  const supabase = await createClient();
  const [statisticsResult, hamletsResult, potentialsResult] = await Promise.all([
    supabase.from('population_stats').select('category,label,value,year,updated_at').order('year', { ascending: false }),
    supabase.from('hamlet_demographics').select('*').eq('year', OFFICIAL_DATA_YEAR).order('name'),
    supabase.from('village_potentials').select('section,label,value_text,numeric_value,unit,source_year,sort_order').order('sort_order'),
  ]);

  const databaseReady = Boolean(hamletsResult.data?.length);
  const statistics = databaseReady && statisticsResult.data?.length ? statisticsResult.data : OFFICIAL_POPULATION_STATS;
  const hamlets = (databaseReady ? hamletsResult.data : OFFICIAL_HAMLET_DEMOGRAPHICS) as HamletDemographic[];
  const potentials = (potentialsResult.data?.length ? potentialsResult.data.map((item) => ({ ...item, numeric_value: item.numeric_value === null ? null : Number(item.numeric_value) })) : OFFICIAL_POTENTIALS) as VillagePotential[];
  const summary = buildHomepageStatistics(statistics);

  return <>
    <header className="page-hero" data-index="04"><div className="container"><div className="page-crumb">Beranda <span>/</span> Data Desa</div><h1>Data nyata, desa terbaca.</h1><p>Jelajahi kondisi penduduk, rincian setiap dusun, batas wilayah, penggunaan lahan, dan potensi Margomulyo berdasarkan dokumen resmi desa.</p></div></header>

    <section className="content-section surface-grid"><div className="container">
      <div className="official-data-banner"><FileSpreadsheet size={22} /><div><strong>Rekap resmi operator desa</strong><span>Data penduduk tahun {OFFICIAL_DATA_YEAR} · Data potensi dari Profil Desa tahun {POTENTIAL_DATA_YEAR}</span></div><i>{databaseReady ? 'Terhubung ke database' : 'Data resmi lokal'}</i></div>
      <div className="stat-summary official-stat-summary">{summary.map((item, index) => <div key={item.label}>{index === 0 ? <Users size={20} /> : index === 1 ? <Database size={20} /> : <Map size={20} />}<strong>{item.value}</strong><span>{item.summaryLabel}</span>{item.year && <small>Data tahun {item.year}</small>}</div>)}</div>
      <VillageStatisticsDashboard hamlets={hamlets} />
    </div></section>

    <section className="content-section"><div className="container">
      <div className="section-heading"><span className="eyebrow">Potensi & wilayah</span><h2>Aset desa dalam satu tampilan.</h2><p>Telusuri batas administratif, legalitas wilayah, penggunaan lahan, karakter tanah, perkebunan, dan fasilitas umum yang tercatat dalam Profil Desa Margomulyo Tahun 2019.</p></div>
      <VillagePotentialExplorer potentials={potentials} />
      <div className="notice">Sumber: Rekap Data Penduduk Desa Margomulyo Tahun 2026 dan Profil Desa Margomulyo Tahun 2019 yang diberikan operator desa. Angka ditampilkan sesuai dokumen sumber.</div>
    </div></section>
  </>;
}
