import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getPublishedNewsBySlug } from '@/lib/news';
import { formatNewsEventDate, getNewsEventStatus, getNewsEventStatusLabel } from '@/lib/news-schedule';
import { isSupabaseStorageUrl } from '@/lib/utils';
import '../../public-pages.css';

type Props = PageProps<'/berita/[slug]'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedNewsBySlug(slug);

  if (!article) return { title: 'Berita tidak ditemukan' };

  return {
    title: article.title,
    description: article.excerpt ?? article.content.slice(0, 160),
    alternates: { canonical: `/berita/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt ?? article.content.slice(0, 160),
      url: `/berita/${article.slug}`,
      type: 'article',
      publishedTime: article.created_at,
      modifiedTime: article.updated_at,
      images: article.image_url ? [article.image_url] : ['/images/hero-bg.png'],
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getPublishedNewsBySlug(slug);

  if (!article) notFound();

  const eventStatus = getNewsEventStatus(article.event_at);
  const eventDate = formatNewsEventDate(article.event_at);

  return (
    <>
      <header className="page-hero news-detail-hero" data-index="02">
        <div className="container">
          <div className="page-crumb">
            <Link href="/">Beranda</Link><span>/</span><Link href="/berita">Berita</Link><span>/</span>{article.category}
          </div>
          <h1>{article.title}</h1>
          <div className="news-detail-meta">
            <span>{article.category}</span>
            <span className={`news-event-status news-event-status--${eventStatus}`}>{getNewsEventStatusLabel(eventStatus)}</span>
            <time dateTime={article.event_at}><CalendarDays size={16} />{eventDate}</time>
          </div>
        </div>
      </header>
      <main className="content-section surface-grid">
        <article className="container news-detail">
          <div className="news-detail-image">
            <Image src={article.image_url || '/images/hero-bg.png'} alt={article.title} fill priority unoptimized={isSupabaseStorageUrl(article.image_url)} sizes="(max-width: 900px) 100vw, 900px" />
          </div>
          {article.excerpt && <p className="news-detail-lead">{article.excerpt}</p>}
          <div className="news-detail-content">
            {article.content.split(/\r?\n\r?\n/).filter(Boolean).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <Link href="/berita" className="button button-outline news-detail-back"><ArrowLeft size={17} />Kembali ke semua berita</Link>
        </article>
      </main>
    </>
  );
}
