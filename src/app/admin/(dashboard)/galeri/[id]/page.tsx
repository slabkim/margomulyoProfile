import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ImageUp, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { saveGallery } from '../../../actions';
import { isSupabaseStorageUrl } from '@/lib/utils';

export default async function EditGalleryPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{error?:string}>}){
  const [{id},{error}]=await Promise.all([params,searchParams]);
  const supabase=await createClient();
  const {data}=await supabase.from('gallery_items').select('*').eq('id',id).maybeSingle();
  if(!data)notFound();

  return <main className="admin-main">
    <header className="admin-page-head"><div><span>Galeri desa</span><h1>Edit dokumentasi</h1><p>Perbarui judul, album, keterangan, atau gambar galeri.</p></div></header>
    {error&&<div className="admin-alert admin-alert--error">{error}</div>}
    <form action={saveGallery} className="admin-form">
      <input type="hidden" name="id" value={data.id}/>
      <label>Judul foto<input name="title" required defaultValue={data.title}/></label>
      <label>Album<input name="album" defaultValue={data.album}/></label>
      <label className="admin-field-full">Keterangan<textarea name="description" defaultValue={data.description||''}/></label>
      <div className="admin-field-full current-media"><span>Gambar saat ini</span><Image src={data.image_url} alt={data.title} width={280} height={175} unoptimized={isSupabaseStorageUrl(data.image_url)}/></div>
      <label className="admin-field-full file-field"><span>Ganti gambar</span><div><ImageUp size={20}/><input name="image" type="file" accept="image/jpeg,image/png,image/webp"/></div><small>Kosongkan untuk mempertahankan gambar saat ini. Maksimal 5 MB.</small></label>
      <div className="form-actions"><Link href="/admin/galeri" className="admin-button">Batal</Link><button className="admin-button admin-button--primary"><Save size={16}/>Simpan perubahan</button></div>
    </form>
  </main>;
}
