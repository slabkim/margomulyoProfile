'use client';

import { useActionState } from 'react';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { login } from '@/app/admin/actions';

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return <form action={action} className="login-form">
    {state?.error && <div className="admin-alert admin-alert--error">{state.error}</div>}
    <label htmlFor="email">Email administrator</label>
    <div className="input-icon"><Mail size={17}/><input id="email" name="email" type="email" autoComplete="email" placeholder="admin@margomulyo.site" required /></div>
    <label htmlFor="password">Kata sandi</label>
    <div className="input-icon"><LockKeyhole size={17}/><input id="password" name="password" type="password" autoComplete="current-password" placeholder="Masukkan kata sandi" required /></div>
    <button className="admin-button admin-button--primary" disabled={pending}>{pending ? 'Memeriksa akun…' : 'Masuk ke Dashboard'} <ArrowRight size={17}/></button>
  </form>;
}
