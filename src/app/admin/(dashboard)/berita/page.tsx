import Link from 'next/link';
import { Edit3, FileText, Plus, Trash2 } from 'lucide-react';
import { deleteNews } from '../../actions';
import { formatNewsEventDate, getNewsEventStatus, getNewsEventStatusLabel } from '@/lib/news-schedule';
import { createClient } from '@/lib/supabase/server';

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news_articles')
    .select('id,title,category,is_published,event_at,created_at')
    .order('event_at', { ascending: false });

  return (
    <main className="admin-main">
      <header className="admin-page-head">
        <div><span>Manajemen konten</span><h1>Berita desa</h1><p>Tulis, jadwalkan, tinjau, dan publikasikan informasi untuk warga.</p></div>
        <div className="admin-toolbar"><Link href="/admin/berita/baru" className="admin-button admin-button--primary"><Plus size={16} />Berita baru</Link></div>
      </header>
      {(params.error || error) && <div className="admin-alert admin-alert--error">{params.error || error?.message}</div>}
      {params.success && <div className="admin-alert admin-alert--success">{params.success}</div>}
      <div className="admin-table-wrap">
        {data?.length ? (
          <table className="admin-table">
            <thead><tr><th>Judul</th><th>Kategori</th><th>Publikasi</th><th>Status kegiatan</th><th>Waktu kegiatan</th><th>Aksi</th></tr></thead>
            <tbody>
              {data.map((item) => {
                const eventStatus = getNewsEventStatus(item.event_at);
                return (
                  <tr key={item.id}>
                    <td><strong>{item.title}</strong></td>
                    <td>{item.category}</td>
                    <td><span className={`status-pill ${item.is_published ? 'live' : ''}`}>{item.is_published ? 'Terbit' : 'Draf'}</span></td>
                    <td><span className={`status-pill status-pill--${eventStatus}`}>{getNewsEventStatusLabel(eventStatus)}</span></td>
                    <td><time dateTime={item.event_at}>{formatNewsEventDate(item.event_at)}</time></td>
                    <td>
                      <div className="row-actions">
                        <Link href={`/admin/berita/${item.id}`} aria-label={`Edit ${item.title}`}><Edit3 size={14} /></Link>
                        <form action={deleteNews}><input type="hidden" name="id" value={item.id} /><button aria-label={`Hapus ${item.title}`}><Trash2 size={14} /></button></form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="empty-state"><FileText /><h2>Belum ada berita</h2><p>Mulai dengan membuat berita pertama untuk website desa.</p></div>
        )}
      </div>
    </main>
  );
}
