import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import ImageUploadPreview from '@/components/admin/ImageUploadPreview';
import { saveNews } from '../../../actions';

export default async function NewNewsPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="admin-main">
    <Link href="/admin/berita" className="admin-back-link"><ArrowLeft size={16} />Kembali ke berita</Link>
    <header className="admin-page-head"><div><span>Berita desa</span><h1>Tulis berita baru</h1><p>Lengkapi informasi dan periksa kembali sebelum diterbitkan.</p></div></header>
    {error && <div className="admin-alert admin-alert--error">{error}</div>}
    <form action={saveNews} className="admin-form">
      <label>Judul<input name="title" required placeholder="Judul berita" /></label>
      <label>Kategori<select name="category"><option>Pertanian</option><option>Kegiatan</option><option>Pelayanan</option><option>Pemberdayaan</option><option>Pengumuman</option></select></label>
      <label className="admin-field-full">Ringkasan<textarea name="excerpt" placeholder="Ringkasan singkat untuk kartu berita" /></label>
      <label className="admin-field-full">Isi berita<textarea className="editor" name="content" required placeholder="Tulis isi berita lengkap…" /></label>
      <ImageUploadPreview label="Gambar utama" variant="landscape" required />
      <label className="check-field admin-field-full"><input type="checkbox" name="is_published" /> Langsung publikasikan</label>
      <div className="form-actions"><Link href="/admin/berita" className="admin-button">Batal</Link><button className="admin-button admin-button--primary"><Save size={16} />Simpan berita</button></div>
    </form>
  </main>;
}
