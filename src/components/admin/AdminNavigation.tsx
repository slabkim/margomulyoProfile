'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, ExternalLink, FileText, Images, LayoutDashboard, Menu, X } from 'lucide-react';

const links = [{href:'/admin',label:'Ringkasan',icon:LayoutDashboard},{href:'/admin/berita',label:'Berita',icon:FileText},{href:'/admin/galeri',label:'Galeri',icon:Images},{href:'/admin/statistik',label:'Statistik',icon:BarChart3}];

export default function AdminNavigation(){
  const pathname=usePathname(); const [open,setOpen]=useState(false);
  return <>
    <button className="admin-menu-toggle" onClick={()=>setOpen(!open)} aria-label={open?'Tutup navigasi':'Buka navigasi'}>{open?<X/>:<Menu/>}</button>
    <div className={`admin-nav-wrap ${open?'open':''}`}>
      <nav className="admin-nav">{links.map(({href,label,icon:Icon})=><Link key={href} href={href} onClick={()=>setOpen(false)} className={pathname===href?'active':''}><Icon size={18}/>{label}</Link>)}</nav>
      <Link href="/" target="_blank" className="view-site">Lihat website <ExternalLink size={15}/></Link>
    </div>
  </>;
}
