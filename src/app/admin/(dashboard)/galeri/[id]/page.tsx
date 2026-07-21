import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import ImageUploadPreview from '@/components/admin/ImageUploadPreview';
import { createClient } from '@/lib/supabase/server';
import { saveGallery } from '../../../actions';

export default async function EditGalleryPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{error?:string}>}){
  const [{id},{error}]=await Promise.all([params,searchParams]);
  const supabase=await createClient();
  const {data}=await supabase.from('gallery_items').select('*').eq('id',id).maybeSingle();
  if(!data)notFound();

  return <main className="admin-main">
    <Link href="/admin/galeri" className="admin-back-link"><ArrowLeft size={16}/>Kembali ke galeri</Link>
    <header className="admin-page-head"><div><span>Galeri desa</span><h1>Edit dokumentasi</h1><p>Perbarui judul, album, keterangan, atau gambar galeri.</p></div></header>
    {error&&<div className="admin-alert admin-alert--error">{error}</div>}
    <form action={saveGallery} className="admin-form">
      <input type="hidden" name="id" value={data.id}/>
      <label>Judul foto<input name="title" required defaultValue={data.title}/></label>
      <label>Album<input name="album" defaultValue={data.album}/></label>
      <label className="admin-field-full">Keterangan<textarea name="description" defaultValue={data.description||''}/></label>
      <ImageUploadPreview label="Ganti gambar" variant="landscape" currentImage={data.image_url} currentAlt={`Gambar ${data.title}`} helperText="Kosongkan untuk mempertahankan gambar saat ini. JPG, PNG, atau WebP; maksimal 5 MB."/>
      <div className="form-actions"><Link href="/admin/galeri" className="admin-button">Batal</Link><button className="admin-button admin-button--primary"><Save size={16}/>Simpan perubahan</button></div>
    </form>
  </main>;
}
