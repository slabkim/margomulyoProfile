import LoginForm from '@/components/admin/LoginForm';
import PesawaranLogo from '@/components/PesawaranLogo';

export default function AdminLoginPage(){return <main className="login-page"><section className="login-brand"><div><span className="admin-logo"><PesawaranLogo priority sizes="58px"/></span><p>Portal Pemerintah Desa</p><h1>Kelola informasi desa dari satu tempat.</h1><span className="login-code">Margomulyo · 18.09.03.2012</span></div></section><section className="login-panel"><div className="login-box"><span className="login-kicker">Akses terbatas</span><h2>Selamat datang kembali</h2><p>Masuk menggunakan akun administrator yang telah terdaftar.</p><LoginForm/><small>Jika Anda kehilangan akses, hubungi pengelola sistem desa.</small></div></section></main>}
