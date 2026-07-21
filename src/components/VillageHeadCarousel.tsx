'use client';

import Image from 'next/image';
import { ArrowLeft, ArrowRight, CalendarDays, ShieldCheck, UserRound } from 'lucide-react';
import { useState } from 'react';
import './VillageHeadCarousel.css';

export type VillageHeadProfile = {
  name: string;
  period: string;
  position: string;
  profile: string;
  photo?: string;
  isCurrent?: boolean;
};

type VillageHeadCarouselProps = {
  profiles: VillageHeadProfile[];
};

export default function VillageHeadCarousel({ profiles }: VillageHeadCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const activeProfile = profiles[activeIndex];

  if (!activeProfile) return null;

  const showPrevious = () => setActiveIndex((current) => (current - 1 + profiles.length) % profiles.length);
  const showNext = () => setActiveIndex((current) => (current + 1) % profiles.length);

  return (
    <div
      className="village-head-carousel"
      aria-roledescription="carousel"
      aria-label="Riwayat kepala desa berdasarkan periode"
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') showPrevious();
        if (event.key === 'ArrowRight') showNext();
      }}
    >
      <div className="village-head-periods" role="tablist" aria-label="Pilih periode kepala desa">
        {profiles.map((profile, index) => (
          <button
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls="village-head-slide"
            className={activeIndex === index ? 'active' : ''}
            key={profile.period}
            onClick={() => setActiveIndex(index)}
          >
            <span>0{index + 1}</span>
            <span className="village-head-period-label">{profile.period}{profile.isCurrent && <small>Sedang menjabat</small>}</span>
          </button>
        ))}
      </div>

      <article
        className={`village-head-slide ${activeProfile.isCurrent ? 'is-current' : ''}`}
        id="village-head-slide"
        key={`${activeProfile.period}-${activeIndex}`}
        role="tabpanel"
        aria-live="polite"
        onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
        onTouchEnd={(event) => {
          if (touchStart === null) return;
          const distance = event.changedTouches[0].clientX - touchStart;
          if (Math.abs(distance) > 45) {
            if (distance > 0) showPrevious();
            else showNext();
          }
          setTouchStart(null);
        }}
      >
        <div className={`village-head-photo ${activeProfile.photo ? '' : 'is-placeholder'}`}>
          {activeProfile.photo ? (
            <Image src={activeProfile.photo} alt={`Foto ${activeProfile.name}`} fill sizes="(max-width: 760px) 100vw, 42vw" unoptimized />
          ) : (
            <div><UserRound size={70} strokeWidth={1.25} /><span>Foto belum ditambahkan</span></div>
          )}
          <span className="village-head-period-badge"><CalendarDays size={15} />{activeProfile.period}</span>
          {activeProfile.isCurrent && <span className="village-head-current-badge"><ShieldCheck size={15} />Sedang menjabat</span>}
        </div>

        <div className="village-head-profile">
          <p className="village-head-count">Kepala Desa <span>{String(activeIndex + 1).padStart(2, '0')} / {String(profiles.length).padStart(2, '0')}</span></p>
          <h3>{activeProfile.name}</h3>
          <strong>{activeProfile.position}</strong>
          <p>{activeProfile.profile}</p>
          <div className="village-head-controls">
            <button type="button" onClick={showPrevious} aria-label="Tampilkan periode sebelumnya"><ArrowLeft size={19} /></button>
            <button type="button" onClick={showNext} aria-label="Tampilkan periode berikutnya"><ArrowRight size={19} /></button>
          </div>
        </div>
      </article>

      <div className="village-head-dots" aria-hidden="true">
        {profiles.map((profile, index) => <span className={activeIndex === index ? 'active' : ''} key={profile.period} />)}
      </div>
    </div>
  );
}
