import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { saveStatistic } from '../../../actions';

const categories=['Ringkasan','Kelompok Usia','Mata Pencaharian','Pendidikan','Wilayah'];

export default async function EditStatisticPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{error?:string}>}){
  const [{id},{error}]=await Promise.all([params,searchParams]);
  const supabase=await createClient();
  const {data}=await supabase.from('population_stats').select('*').eq('id',id).maybeSingle();
  if(!data)notFound();

  return <main className="admin-main">
    <header className="admin-page-head"><div><span>Data desa</span><h1>Edit statistik</h1><p>Perbarui indikator, nilai, kategori, atau tahun data.</p></div></header>
    {error&&<div className="admin-alert admin-alert--error">{error}</div>}
    <form action={saveStatistic} className="admin-form">
      <input type="hidden" name="id" value={data.id}/>
      <label>Kategori<select name="category" defaultValue={data.category}>{categories.map(category=><option key={category}>{category}</option>)}</select></label>
      <label>Label data<input name="label" required defaultValue={data.label}/></label>
      <label>Nilai<input name="value" type="number" step="any" required defaultValue={data.value}/></label>
      <label>Tahun<input name="year" type="number" required defaultValue={data.year}/></label>
      <div className="form-actions"><Link href="/admin/statistik" className="admin-button">Batal</Link><button className="admin-button admin-button--primary"><Save size={16}/>Simpan perubahan</button></div>
    </form>
  </main>;
}
