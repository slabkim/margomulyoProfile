import Image from 'next/image';
import Link from 'next/link';
import { Edit3, Plus, Trash2, UserRound } from 'lucide-react';
import ImageUploadPreview from '@/components/admin/ImageUploadPreview';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseStorageUrl } from '@/lib/utils';
import { deleteVillageHead, saveVillageHead } from '../../actions';

export default async function AdminVillageHeadsPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.from('village_heads').select('*').order('start_year', { ascending: true }).order('end_year', { ascending: true });

  return <main className="admin-main">
    <header className="admin-page-head"><div><span>Profil desa</span><h1>Riwayat kepala desa</h1><p>Kelola foto, periode jabatan, dan profil kepala desa yang tampil pada halaman publik.</p></div></header>
    {(params.error || error) && <div className="admin-alert admin-alert--error">{params.error || error?.message}</div>}
    {params.success && <div className="admin-alert admin-alert--success">{params.success}</div>}

    <form action={saveVillageHead} className="admin-form village-head-admin-form">
      <div className="admin-field-full admin-form-intro"><span>Tambah kepala desa</span><h2>Data kepemimpinan baru</h2><p>Gunakan tahun empat digit dan foto potret dengan orientasi tegak.</p></div>
      <label>Nama lengkap<input name="name" required maxLength={120} placeholder="Nama kepala desa" /></label>
      <label>Jabatan<input value="Kepala Desa Margo Mulyo" readOnly aria-label="Jabatan" /></label>
      <label>Tahun mulai<input name="start_year" type="number" min="1900" max="2100" required placeholder="Contoh: 2024" /></label>
      <label>Tahun selesai<input name="end_year" type="number" min="1900" max="2100" required placeholder="Contoh: 2032" /></label>
      <label className="admin-field-full">Profil singkat<textarea name="profile" maxLength={2000} placeholder="Pengalaman, program utama, dan kontribusi selama masa jabatan" /></label>
      <ImageUploadPreview required />
      <div className="admin-field-full admin-check-grid"><label className="check-field"><input name="is_published" type="checkbox" defaultChecked /> Tampilkan pada halaman Profil Desa</label><label className="check-field"><input name="is_current" type="checkbox" /> Sedang menjabat saat ini</label></div>
      <div className="form-actions"><button className="admin-button admin-button--primary"><Plus size={16} />Tambah kepala desa</button></div>
    </form>

    <div className="admin-list-heading"><div><span>Data tersimpan</span><h2>Daftar kepala desa</h2></div><p>Urutan pada website mengikuti masa jabatan dari periode paling lama.</p></div>
    {data?.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Foto</th><th>Nama</th><th>Periode</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{data.map((head) => <tr key={head.id}>
      <td><Image className="admin-head-thumb" src={head.image_url} alt="" width={44} height={54} unoptimized={isSupabaseStorageUrl(head.image_url)} /></td>
      <td><strong>{head.name}</strong></td>
      <td>{head.start_year}&ndash;{head.end_year}</td>
      <td><div className="admin-head-status"><span className={`status-pill ${head.is_published ? 'live' : ''}`}>{head.is_published ? 'Tampil' : 'Draf'}</span>{head.is_current && <span className="status-pill current">Sedang menjabat</span>}</div></td>
      <td><div className="row-actions"><Link href={`/admin/kepala-desa/${head.id}`} aria-label={`Edit ${head.name}`}><Edit3 size={14} /></Link><form action={deleteVillageHead}><input type="hidden" name="id" value={head.id} /><button aria-label={`Hapus ${head.name}`}><Trash2 size={14} /></button></form></div></td>
    </tr>)}</tbody></table></div> : <div className="empty-state"><UserRound /><h2>Belum ada data kepala desa</h2><p>Isi formulir di atas untuk menampilkan profil kepala desa pertama.</p></div>}
  </main>;
}
