import Link from 'next/link';
import { BarChart3, Edit3, Plus, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { AGE_GROUP_OPTIONS, HOME_STATISTIC_OPTIONS, canonicalManagedStatisticLabel, isManagedStatisticLabel } from '@/lib/statistics';
import { deleteStatistic, saveStatistic } from '../../actions';
import StatisticsEditor, { type StatisticsEditorInitialData } from './StatisticsEditor';

const detailCategories = ['Mata Pencaharian', 'Pendidikan', 'Wilayah'];

export default async function AdminStatsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('population_stats')
    .select('*')
    .order('year', { ascending: false })
    .order('updated_at', { ascending: false })
    .order('category');
  const rows = data ?? [];
  const populationRow = rows.find((row) => canonicalManagedStatisticLabel(row.label) === HOME_STATISTIC_OPTIONS[0].label);
  const activeYear = Number(populationRow?.year ?? new Date().getFullYear());
  const managedValue = (label: string) => rows.find((row) => canonicalManagedStatisticLabel(row.label) === label && (label === HOME_STATISTIC_OPTIONS[3].label || Number(row.year) === activeYear))?.value;
  const population = Number(managedValue(HOME_STATISTIC_OPTIONS[0].label)) || 0;
  const agePercentages = AGE_GROUP_OPTIONS.map((option) => {
    const count = Number(managedValue(option.label));
    return population > 0 && Number.isFinite(count) ? String(Number(((count / population) * 100).toFixed(2))) : '';
  });
  const initialData: StatisticsEditorInitialData = {
    year: activeYear,
    population: population ? String(population) : '',
    households: String(managedValue(HOME_STATISTIC_OPTIONS[1].label) ?? ''),
    hamlets: String(managedValue(HOME_STATISTIC_OPTIONS[2].label) ?? ''),
    area: String(managedValue(HOME_STATISTIC_OPTIONS[3].label) ?? ''),
    agePercentages,
  };

  return (
    <main className="admin-main">
      <header className="admin-page-head">
        <div><span>Data desa</span><h1>Statistik penduduk</h1><p>Perbarui data utama dalam satu formulir agar angka di seluruh website tetap konsisten.</p></div>
      </header>

      {(params.error || error) && <div className="admin-alert admin-alert--error">{params.error || error?.message}</div>}
      {params.success && <div className="admin-alert admin-alert--success">{params.success}</div>}

      <StatisticsEditor initialData={initialData} maximumYear={new Date().getFullYear() + 1} />

      <details className="admin-advanced">
        <summary>Tambahkan statistik lainnya <span>Mata pencaharian, pendidikan, atau wilayah</span></summary>
        <form action={saveStatistic} className="admin-form">
          <div className="admin-field-full admin-form-intro">
            <span>Data tambahan</span><h2>Indikator di luar data utama</h2>
            <p>Gunakan bagian ini hanya untuk statistik tambahan. Kelompok usia dikelola otomatis pada formulir utama.</p>
          </div>
          <label>Kategori<select name="category">{detailCategories.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label>Label data<input name="label" required placeholder="Contoh: Petani" /></label>
          <label>Nilai<input name="value" type="number" min="0" step="any" required placeholder="64" /></label>
          <label>Tahun<input name="year" type="number" min="1900" max={new Date().getFullYear() + 1} defaultValue={activeYear} required /></label>
          <div className="form-actions"><button className="admin-button admin-button--primary"><Plus size={16} />Tambah data</button></div>
        </form>
      </details>

      <div className="admin-list-heading"><div><span>Data tersimpan</span><h2>Riwayat statistik</h2></div><p>Data utama bertanda “Terhubung otomatis” dikelola bersama melalui formulir di atas.</p></div>
      <div className="admin-table-wrap">
        {rows.length ? (
          <table className="admin-table">
            <thead><tr><th>Indikator</th><th>Kategori</th><th>Nilai</th><th>Tahun</th><th>Aksi</th></tr></thead>
            <tbody>{rows.map((item) => {
              const managed = isManagedStatisticLabel(item.label);
              return <tr key={item.id}>
                <td><strong>{item.label}</strong></td><td>{item.category}</td><td>{Number(item.value).toLocaleString('id-ID')}</td><td>{item.year}</td>
                <td>{managed ? <span className="managed-pill">Terhubung otomatis</span> : <div className="row-actions"><Link href={`/admin/statistik/${item.id}`} aria-label="Edit"><Edit3 size={14} /></Link><form action={deleteStatistic}><input type="hidden" name="id" value={item.id} /><button aria-label="Hapus"><Trash2 size={14} /></button></form></div>}</td>
              </tr>;
            })}</tbody>
          </table>
        ) : <div className="empty-state"><BarChart3 /><h2>Belum ada statistik</h2><p>Isi data utama desa melalui formulir di atas.</p></div>}
      </div>
    </main>
  );
}
