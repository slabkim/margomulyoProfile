import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import ImageUploadPreview from '@/components/admin/ImageUploadPreview';
import { createClient } from '@/lib/supabase/server';
import { saveNews } from '../../../actions';

export default async function EditNewsPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const { data } = await supabase.from('news_articles').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();

  return <main className="admin-main">
    <Link href="/admin/berita" className="admin-back-link"><ArrowLeft size={16} />Kembali ke berita</Link>
    <header className="admin-page-head"><div><span>Berita desa</span><h1>Edit berita</h1><p>Perbarui konten atau status publikasi berita.</p></div></header>
    {error && <div className="admin-alert admin-alert--error">{error}</div>}
    <form action={saveNews} className="admin-form">
      <input type="hidden" name="id" value={data.id} />
      <label>Judul<input name="title" required defaultValue={data.title} /></label>
      <label>Kategori<input name="category" defaultValue={data.category} /></label>
      <label className="admin-field-full">Slug<input name="slug" defaultValue={data.slug} /></label>
      <label className="admin-field-full">Ringkasan<textarea name="excerpt" defaultValue={data.excerpt || ''} /></label>
      <label className="admin-field-full">Isi berita<textarea className="editor" name="content" required defaultValue={data.content} /></label>
      <ImageUploadPreview label="Ganti gambar utama" variant="landscape" currentImage={data.image_url || undefined} currentAlt={`Gambar ${data.title}`} helperText="Kosongkan untuk mempertahankan gambar saat ini. Mendukung JPG, PNG, WebP, HEIC/HEIF, AVIF, TIFF, dan GIF; maksimal 5 MB." />
      <label className="check-field admin-field-full"><input type="checkbox" name="is_published" defaultChecked={data.is_published} /> Publikasikan berita</label>
      <div className="form-actions"><Link href="/admin/berita" className="admin-button">Batal</Link><button className="admin-button admin-button--primary"><Save size={16} />Simpan perubahan</button></div>
    </form>
  </main>;
}
