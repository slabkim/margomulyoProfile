import { redirect } from 'next/navigation';
import { LogOut } from 'lucide-react';
import AdminNavigation from '@/components/admin/AdminNavigation';
import PesawaranLogo from '@/components/PesawaranLogo';
import { createClient } from '@/lib/supabase/server';
import { logout } from '../actions';

export default async function DashboardLayout({children}:{children:React.ReactNode}){
  const supabase=await createClient(); const {data:claimsData}=await supabase.auth.getClaims(); const userId=claimsData?.claims?.sub;
  if(!userId) redirect('/admin/login');
  const {data:admin}=await supabase.from('admin_users').select('full_name,role,is_active').eq('user_id',userId).eq('is_active',true).maybeSingle();
  if(!admin){await supabase.auth.signOut();redirect('/admin/login?error=unauthorized')}
  const email=typeof claimsData.claims.email==='string'?claimsData.claims.email:'';
  return <div className="admin-shell"><aside className="admin-sidebar"><div className="admin-brand"><span><PesawaranLogo sizes="40px"/></span><div><strong>Margo Mulyo</strong><small>Panel Administrator</small></div></div><AdminNavigation/><div className="admin-user"><span>{(admin.full_name||email||'A').charAt(0).toUpperCase()}</span><div><strong>{admin.full_name||'Administrator'}</strong><small>{email}</small></div><form action={logout}><button aria-label="Keluar"><LogOut size={17}/></button></form></div></aside><div className="admin-content">{children}</div></div>
}
