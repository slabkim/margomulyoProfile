import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Save } from 'lucide-react';
import ImageUploadPreview from '@/components/admin/ImageUploadPreview';
import { createClient } from '@/lib/supabase/server';
import { saveVillageHead } from '../../../actions';

export default async function EditVillageHeadPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const { data } = await supabase.from('village_heads').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();

  return <main className="admin-main">
    <header className="admin-page-head"><div><span>Riwayat kepala desa</span><h1>Edit profil kepala desa</h1><p>Perbarui foto, periode jabatan, atau keterangan profil.</p></div></header>
    {error && <div className="admin-alert admin-alert--error">{error}</div>}
    <form action={saveVillageHead} className="admin-form village-head-admin-form">
      <input type="hidden" name="id" value={data.id} />
      <label>Nama lengkap<input name="name" required maxLength={120} defaultValue={data.name} /></label>
      <label>Jabatan<input value="Kepala Desa Margo Mulyo" readOnly aria-label="Jabatan" /></label>
      <label>Tahun mulai<input name="start_year" type="number" min="1900" max="2100" required defaultValue={data.start_year} /></label>
      <label>Tahun selesai<input name="end_year" type="number" min="1900" max="2100" required defaultValue={data.end_year} /></label>
      <label className="admin-field-full">Profil singkat<textarea name="profile" maxLength={2000} defaultValue={data.profile} /></label>
      <ImageUploadPreview currentImage={data.image_url} currentAlt={`Foto ${data.name}`} />
      <div className="admin-field-full admin-check-grid"><label className="check-field"><input name="is_published" type="checkbox" defaultChecked={data.is_published} /> Tampilkan pada halaman Profil Desa</label><label className="check-field"><input name="is_current" type="checkbox" defaultChecked={data.is_current} /> Sedang menjabat saat ini</label></div>
      <div className="form-actions"><Link href="/admin/kepala-desa" className="admin-button">Batal</Link><button className="admin-button admin-button--primary"><Save size={16} />Simpan perubahan</button></div>
    </form>
  </main>;
}
