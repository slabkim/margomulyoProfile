'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const isAdmin = usePathname().startsWith('/admin');
  if (isAdmin) return <>{children}</>;
  return <><Navbar /><main>{children}</main><Footer /></>;
}
