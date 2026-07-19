# Keamanan Website Desa Margo Mulyo

Tidak ada aplikasi yang dapat dijamin kebal dari seluruh serangan. Keamanan project ini menggunakan pertahanan berlapis dan tetap membutuhkan pemeliharaan rutin.

## Perlindungan dalam kode

- Query database menggunakan Supabase Query Builder tanpa menyusun raw SQL dari input pengguna.
- Semua Server Action admin memvalidasi JWT dan status admin aktif sebelum mutasi.
- Row Level Security membatasi create, update, dan delete hanya untuk admin aktif.
- React melakukan escaping teks; aplikasi tidak memakai `dangerouslySetInnerHTML`.
- CSP nonce membatasi script yang boleh dijalankan dan mencegah framing oleh situs lain.
- HSTS, `nosniff`, `DENY`, Referrer Policy, COOP, dan Permissions Policy dipasang pada semua response.
- Input memiliki batas panjang, format UUID, rentang angka, dan normalisasi slug.
- Upload dibatasi 5 MB, hanya JPG/PNG/WebP, serta diverifikasi melalui MIME dan magic bytes.
- URL media dibatasi ke aset lokal atau bucket `village-media` milik project.
- Password dan publishable key tidak pernah ditulis ke database aplikasi.

## Konfigurasi wajib Supabase

Sebelum produksi, buka Supabase Dashboard dan terapkan:

1. **Authentication → Providers → Email**: nonaktifkan pendaftaran user publik.
2. **Authentication → Attack Protection**: aktifkan CAPTCHA untuk endpoint autentikasi.
3. Gunakan password admin minimal 12 karakter yang unik.
4. Aktifkan MFA untuk seluruh akun administrator.
5. Hapus atau nonaktifkan akun admin yang tidak lagi bertugas.
6. Periksa Auth Audit Logs dan Database Logs secara berkala.
7. Aktifkan backup database sesuai kemampuan paket Supabase.
8. Jangan pernah menambahkan `service_role` atau secret key ke variabel `NEXT_PUBLIC_*`.

## Konfigurasi deployment

- Gunakan HTTPS dan domain resmi desa.
- Simpan environment variable hanya melalui dashboard hosting.
- Untuk Railway, letakkan Cloudflare di depan aplikasi dan aktifkan WAF serta rate limit pada `/admin/login`.
- Batasi akses repository dan dashboard hosting dengan MFA.
- Aktifkan notifikasi penggunaan dan error pada Railway serta Supabase.
- Jalankan `npm audit`, `npm run lint`, dan `npm run build` sebelum deployment.

## Respons insiden

Jika akun admin atau website diduga disusupi:

1. Nonaktifkan user terkait pada tabel `admin_users` dan Supabase Auth.
2. Cabut seluruh sesi aktif user tersebut.
3. Ganti password dan rotasi key yang mungkin bocor.
4. Periksa Auth Logs, Database Logs, riwayat deployment, dan perubahan konten.
5. Pulihkan data dari backup atau riwayat yang telah diverifikasi.
6. Jangan menghapus log sebelum bukti insiden disimpan.

Laporkan kerentanan secara privat kepada pengelola teknis desa. Jangan memasukkan password, token, data warga, atau detail eksploitasi ke issue publik.
