'use client';

import { useMemo, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend,
  LinearScale, Tooltip, type ChartOptions,
} from 'chart.js';
import { Home, Users } from 'lucide-react';
import type { HamletDemographic } from '@/lib/village-data';
import './VillageStatisticsDashboard.css';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const numberFormatter = new Intl.NumberFormat('id-ID');
const colors = ['#2f6b4f', '#c56a49', '#dba73b', '#6f8f7d', '#9b6a58', '#8d78a8'];
type View = 'dusun' | 'gender' | 'agama' | 'usia';

const barChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' as const, labels: { usePointStyle: true, boxWidth: 8, padding: 18 } },
  },
  scales: { y: { beginAtZero: true, ticks: { precision: 0 } }, x: { grid: { display: false } } },
};
const doughnutChartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 18 } } },
};

export default function VillageStatisticsDashboard({ hamlets }: { hamlets: HamletDemographic[] }) {
  const [view, setView] = useState<View>('dusun');
  const [selectedHamlet, setSelectedHamlet] = useState(hamlets[0]?.name || '');
  const totals = useMemo(() => hamlets.reduce((total, hamlet) => ({
    male: total.male + hamlet.population_male,
    female: total.female + hamlet.population_female,
    islam: total.islam + hamlet.religion_islam,
    christian: total.christian + hamlet.religion_christian,
    catholic: total.catholic + hamlet.religion_catholic,
    ages: total.ages.map((value, index) => value + [hamlet.age_0_5, hamlet.age_6_12, hamlet.age_13_17, hamlet.age_18_21, hamlet.age_22_59, hamlet.age_60_plus][index]),
  }), { male: 0, female: 0, islam: 0, christian: 0, catholic: 0, ages: [0, 0, 0, 0, 0, 0] }), [hamlets]);
  const activeHamlet = hamlets.find((hamlet) => hamlet.name === selectedHamlet) || hamlets[0];

  const chart = view === 'dusun' ? {
    labels: hamlets.map((hamlet) => hamlet.name),
    datasets: [
      { label: 'Laki-laki', data: hamlets.map((hamlet) => hamlet.population_male), backgroundColor: colors[0], borderRadius: 6 },
      { label: 'Perempuan', data: hamlets.map((hamlet) => hamlet.population_female), backgroundColor: colors[1], borderRadius: 6 },
    ],
  } : view === 'gender' ? {
    labels: ['Laki-laki', 'Perempuan'], datasets: [{ label: 'Penduduk', data: [totals.male, totals.female], backgroundColor: [colors[0], colors[1]], borderWidth: 0 }],
  } : view === 'agama' ? {
    labels: ['Islam', 'Kristen', 'Katolik'], datasets: [{ label: 'Penduduk', data: [totals.islam, totals.christian, totals.catholic], backgroundColor: [colors[0], colors[2], colors[4]], borderWidth: 0 }],
  } : {
    labels: ['0–5', '6–12', '13–17', '18–21', '22–59', '> 60'], datasets: [{ label: 'Kelompok usia', data: totals.ages, backgroundColor: colors, borderRadius: 7 }],
  };

  return <div className="data-dashboard">
    <div className="data-view-tabs" role="tablist" aria-label="Pilih visualisasi statistik">
      {([['dusun', 'Penduduk per dusun'], ['gender', 'Jenis kelamin'], ['agama', 'Agama'], ['usia', 'Kelompok usia']] as const).map(([key, label]) => <button type="button" role="tab" aria-selected={view === key} className={view === key ? 'active' : ''} key={key} onClick={() => setView(key)}>{label}</button>)}
    </div>
    <div className="data-chart-panel">
      <div className="data-chart-copy"><span>Visualisasi interaktif</span><h2>{view === 'dusun' ? 'Sebaran penduduk di enam dusun' : view === 'gender' ? 'Komposisi jenis kelamin' : view === 'agama' ? 'Komposisi agama penduduk' : 'Penduduk berdasarkan kelompok usia'}</h2><p>Arahkan kursor atau sentuh grafik untuk melihat jumlah detail. Seluruh angka bersumber dari rekap operator desa tahun 2026.</p></div>
      <div className={`data-chart ${view === 'gender' || view === 'agama' ? 'is-doughnut' : ''}`}>
        {view === 'gender' || view === 'agama' ? <Doughnut data={chart} options={doughnutChartOptions} aria-label="Diagram komposisi penduduk" role="img" /> : <Bar data={chart} options={barChartOptions} aria-label="Diagram statistik penduduk" role="img" />}
      </div>
    </div>

    {activeHamlet && <div className="hamlet-explorer">
      <div className="hamlet-explorer-head"><div><span className="eyebrow">Detail wilayah</span><h2>Lihat data setiap dusun.</h2></div><label htmlFor="hamlet-select">Pilih dusun<select id="hamlet-select" value={activeHamlet.name} onChange={(event) => setSelectedHamlet(event.target.value)}>{hamlets.map((hamlet) => <option key={hamlet.name}>{hamlet.name}</option>)}</select></label></div>
      <div className="hamlet-highlight"><div><Home size={22} /><span>Kepala keluarga</span><strong>{numberFormatter.format(activeHamlet.households_total)}</strong><small>{numberFormatter.format(activeHamlet.households_male)} KK laki-laki · {numberFormatter.format(activeHamlet.households_female)} KK perempuan</small></div><div><Users size={22} /><span>Jumlah penduduk</span><strong>{numberFormatter.format(activeHamlet.population_male + activeHamlet.population_female)}</strong><small>{numberFormatter.format(activeHamlet.population_male)} laki-laki · {numberFormatter.format(activeHamlet.population_female)} perempuan</small></div></div>
      <div className="hamlet-detail-grid"><div><span>Islam</span><strong>{numberFormatter.format(activeHamlet.religion_islam)}</strong></div><div><span>Kristen</span><strong>{numberFormatter.format(activeHamlet.religion_christian)}</strong></div><div><span>Katolik</span><strong>{numberFormatter.format(activeHamlet.religion_catholic)}</strong></div><div><span>Usia 0–5</span><strong>{numberFormatter.format(activeHamlet.age_0_5)}</strong></div><div><span>Usia 6–12</span><strong>{numberFormatter.format(activeHamlet.age_6_12)}</strong></div><div><span>Usia 13–17</span><strong>{numberFormatter.format(activeHamlet.age_13_17)}</strong></div><div><span>Usia 18–21</span><strong>{numberFormatter.format(activeHamlet.age_18_21)}</strong></div><div><span>Usia 22–59</span><strong>{numberFormatter.format(activeHamlet.age_22_59)}</strong></div><div><span>Di atas 60</span><strong>{numberFormatter.format(activeHamlet.age_60_plus)}</strong></div></div>
    </div>}
  </div>;
}
