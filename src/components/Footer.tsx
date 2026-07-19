import Link from 'next/link';
import { ArrowUpRight, Landmark, MapPin, Mail, Clock } from 'lucide-react';
import './Footer.css';

const links = [
  { label: 'Profil Desa', href: '/profil' }, { label: 'Berita Desa', href: '/berita' },
  { label: 'Galeri Kegiatan', href: '/galeri' }, { label: 'Statistik', href: '/statistik' },
  { label: 'Layanan Publik', href: '/layanan' }, { label: 'Kontak', href: '/kontak' },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-intro">
          <div className="footer-emblem"><Landmark size={28} /></div>
          <p className="eyebrow">Portal resmi desa</p>
          <h2>Informasi terbuka,<br />pelayanan lebih dekat.</h2>
        </div>
        <div className="footer-links">
          <p className="footer-label">Jelajahi</p>
          {links.map((link) => <Link href={link.href} key={link.href}>{link.label}<ArrowUpRight size={15} /></Link>)}
        </div>
        <div className="footer-contact">
          <p className="footer-label">Kantor Desa</p>
          <div><MapPin size={17} /><span>Desa Margo Mulyo, Kec. Tegineneng,<br />Kab. Pesawaran, Lampung</span></div>
          <div><Mail size={17} /><span>desa.margomulyo@pesawaran.go.id</span></div>
          <div><Clock size={17} /><span>Senin–Jumat, 08.00–16.00 WIB</span></div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Pemerintah Desa Margo Mulyo</span>
        <span>Kode Wilayah 18.09.03.2012</span>
      </div>
    </footer>
  );
}
