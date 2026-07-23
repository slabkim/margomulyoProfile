import LoginForm from '@/components/admin/LoginForm';
import PesawaranLogo from '@/components/PesawaranLogo';

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const serviceUnavailable = error === 'service-unavailable';

  return (
    <main className="login-page">
      <section className="login-brand">
        <div>
          <span className="admin-logo"><PesawaranLogo priority sizes="58px" /></span>
          <p>Portal Pemerintah Desa</p>
          <h1>Kelola informasi desa dari satu tempat.</h1>
          <span className="login-code">Margomulyo · 18.09.03.2012</span>
        </div>
      </section>
      <section className="login-panel">
        <div className="login-box">
          <span className="login-kicker">Akses terbatas</span>
          <h2>Selamat datang kembali</h2>
          <p>Masuk menggunakan akun administrator yang telah terdaftar.</p>
          {serviceUnavailable && (
            <div className="admin-alert admin-alert--error" role="alert">
              Layanan autentikasi sedang tidak dapat dijangkau. Periksa koneksi lalu coba kembali.
            </div>
          )}
          <LoginForm />
          <small>Jika Anda kehilangan akses, hubungi pengelola sistem desa.</small>
        </div>
      </section>
    </main>
  );
}
