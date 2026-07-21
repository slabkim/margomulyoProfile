import Link from 'next/link';
import { ArrowLeft, Edit3, ImageIcon, Plus, Trash2 } from 'lucide-react';
import ImageUploadPreview from '@/components/admin/ImageUploadPreview';
import { createClient } from '@/lib/supabase/server';
import { deleteGallery, saveGallery } from '../../actions';

export default async function AdminGalleryPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false });

  return <main className="admin-main">
    <Link href="/admin" className="admin-back-link"><ArrowLeft size={16} />Kembali ke dashboard</Link>
    <header className="admin-page-head"><div><span>Dokumentasi desa</span><h1>Galeri kegiatan</h1><p>Unggah dokumentasi kegiatan langsung ke penyimpanan media desa.</p></div></header>
    {(params.error || error) && <div className="admin-alert admin-alert--error">{params.error || error?.message}</div>}
    {params.success && <div className="admin-alert admin-alert--success">{params.success}</div>}
    <form action={saveGallery} className="admin-form" style={{ marginBottom: 18 }}>
      <label>Judul foto<input name="title" required placeholder="Contoh: Gotong royong dusun I" /></label>
      <label>Album<input name="album" placeholder="Kegiatan" /></label>
      <ImageUploadPreview label="File gambar" variant="landscape" required />
      <label className="admin-field-full">Keterangan<textarea name="description" placeholder="Keterangan singkat foto" /></label>
      <div className="form-actions"><button className="admin-button admin-button--primary"><Plus size={16} />Unggah foto</button></div>
    </form>
    <div className="admin-table-wrap">{data?.length ? <table className="admin-table"><thead><tr><th>Judul</th><th>Album</th><th>Tanggal</th><th>Aksi</th></tr></thead><tbody>{data.map((item) => <tr key={item.id}><td><strong>{item.title}</strong></td><td>{item.album}</td><td>{new Date(item.created_at).toLocaleDateString('id-ID')}</td><td><div className="row-actions"><Link href={`/admin/galeri/${item.id}`} aria-label="Edit"><Edit3 size={14} /></Link><form action={deleteGallery}><input type="hidden" name="id" value={item.id} /><button aria-label="Hapus"><Trash2 size={14} /></button></form></div></td></tr>)}</tbody></table> : <div className="empty-state"><ImageIcon /><h2>Galeri masih kosong</h2><p>Foto yang diunggah akan tampil di halaman galeri publik.</p></div>}</div>
  </main>;
}
