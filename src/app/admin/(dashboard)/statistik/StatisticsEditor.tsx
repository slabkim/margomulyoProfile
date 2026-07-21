'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { AGE_GROUP_OPTIONS, calculateAgeGroupCounts } from '@/lib/statistics';
import { saveVillageStatistics } from '../../actions';

export type StatisticsEditorInitialData = {
  year: number;
  population: string;
  households: string;
  hamlets: string;
  area: string;
  agePercentages: string[];
};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return <button className="admin-button admin-button--primary" disabled={disabled || pending}><Save size={16} />{pending ? 'Menyimpan…' : 'Simpan semua data'}</button>;
}

export default function StatisticsEditor({ initialData, maximumYear }: { initialData: StatisticsEditorInitialData; maximumYear: number }) {
  const [population, setPopulation] = useState(initialData.population);
  const [percentages, setPercentages] = useState(() => AGE_GROUP_OPTIONS.map((_, index) => initialData.agePercentages[index] ?? ''));
  const numericPopulation = Number(population) || 0;
  const numericPercentages = percentages.map((percentage) => Number(percentage) || 0);
  const percentageTotal = numericPercentages.reduce((sum, percentage) => sum + percentage, 0);
  const validPercentageTotal = Math.abs(percentageTotal - 100) <= 0.01;
  const calculatedCounts = validPercentageTotal
    ? calculateAgeGroupCounts(numericPopulation, numericPercentages)
    : numericPercentages.map((percentage) => Math.round((numericPopulation * percentage) / 100));

  function updatePercentage(index: number, nextValue: string) {
    setPercentages((current) => current.map((value, valueIndex) => valueIndex === index ? nextValue : value));
  }

  return (
    <form action={saveVillageStatistics} className="admin-form statistics-editor">
      <div className="admin-field-full admin-form-intro">
        <span>Data utama desa</span>
        <h2>Satu formulir untuk seluruh data kependudukan</h2>
        <p>Isi total penduduk dan persentase usia. Jumlah jiwa setiap kelompok dihitung otomatis dan selalu disamakan dengan total penduduk.</p>
      </div>

      <label>Tahun data<input name="year" type="number" min="1900" max={maximumYear} required defaultValue={initialData.year} /></label>
      <label>Jumlah penduduk<input name="population" type="number" min="1" step="1" required value={population} onChange={(event) => setPopulation(event.target.value)} placeholder="4081" /></label>
      <label>Kepala keluarga<input name="households" type="number" min="0" step="1" required defaultValue={initialData.households} placeholder="1226" /></label>
      <label>Jumlah dusun<input name="hamlets" type="number" min="1" step="1" required defaultValue={initialData.hamlets} placeholder="6" /></label>
      <label>Luas wilayah (km²)<input name="area" type="number" min="0.01" step="any" required defaultValue={initialData.area} placeholder="6.957" /></label>

      <div className="admin-field-full age-editor">
        <div className="age-editor-head">
          <div><span>Komposisi kelompok usia</span><h3>Bagikan total penduduk berdasarkan persentase</h3></div>
          <strong className={validPercentageTotal ? 'is-valid' : 'is-invalid'}>{percentageTotal.toLocaleString('id-ID', { maximumFractionDigits: 2 })}% dari 100%</strong>
        </div>
        <div className="age-editor-grid">
          {AGE_GROUP_OPTIONS.map((option, index) => (
            <label key={option.field}>
              <span>{option.label}</span>
              <div className="percentage-input"><input name={option.field} type="number" min="0" max="100" step="0.01" required value={percentages[index]} onChange={(event) => updatePercentage(index, event.target.value)} /><span>%</span></div>
              <small>= <strong>{calculatedCounts[index].toLocaleString('id-ID')}</strong> jiwa</small>
            </label>
          ))}
        </div>
        <div className="age-total"><span>Total hasil perhitungan</span><strong>{calculatedCounts.reduce((sum, count) => sum + count, 0).toLocaleString('id-ID')} jiwa</strong></div>
        {!validPercentageTotal && <p className="age-warning" role="alert">Sesuaikan persentase sampai totalnya tepat 100% sebelum menyimpan.</p>}
      </div>

      <div className="form-actions"><SubmitButton disabled={!validPercentageTotal || numericPopulation <= 0} /></div>
    </form>
  );
}
