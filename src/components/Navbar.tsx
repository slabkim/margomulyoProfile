'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import PesawaranLogo from './PesawaranLogo';
import './Navbar.css';

const navLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Profil', href: '/profil' },
  { label: 'Berita', href: '/berita' },
  { label: 'Galeri', href: '/galeri' },
  { label: 'Data Desa', href: '/statistik' },
];
const mobileLinks = [...navLinks, { label: 'Layanan Desa', href: '/layanan' }, { label: 'Kontak', href: '/kontak' }];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const homeTop = pathname === '/' && !scrolled && !open;
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        requestAnimationFrame(() => toggleRef.current?.focus());
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    requestAnimationFrame(() => panelRef.current?.querySelector<HTMLAnchorElement>('a')?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <header className={`site-header ${homeTop ? 'site-header--overlay' : 'site-header--solid'} ${open ? 'site-header--menu-open' : ''}`}>
      <div className="nav-shell">
        <Link href="/" className="brand" aria-label="Beranda Desa Margo Mulyo" onClick={() => setOpen(false)}>
          <span className="brand-mark"><PesawaranLogo priority sizes="43px" /></span>
          <span><strong>Margo Mulyo</strong><small>Kabupaten Pesawaran</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Navigasi utama">
          {navLinks.map((link) => <Link key={link.href} href={link.href} className={isActive(link.href) ? 'active' : ''} aria-current={isActive(link.href) ? 'page' : undefined}>{link.label}</Link>)}
        </nav>
        <Link href="/layanan" className="nav-service">Layanan Desa <ArrowUpRight size={16} /></Link>
        <button ref={toggleRef} type="button" className="menu-toggle" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Tutup menu navigasi' : 'Buka menu navigasi'}>
          <span aria-hidden="true">{open ? <X size={22} /> : <Menu size={22} />}</span>
        </button>
      </div>
      <div ref={panelRef} className={`mobile-panel ${open ? 'open' : ''}`} id="mobile-navigation" aria-hidden={!open}>
        <nav aria-label="Navigasi seluler">
          {mobileLinks.map((link, index) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={isActive(link.href) ? 'active' : ''} aria-current={isActive(link.href) ? 'page' : undefined}><span>0{index + 1}</span>{link.label}<ArrowUpRight size={18} /></Link>
          ))}
        </nav>
        <p>Kecamatan Tegineneng<br />Kabupaten Pesawaran, Lampung</p>
      </div>
    </header>
  );
}
