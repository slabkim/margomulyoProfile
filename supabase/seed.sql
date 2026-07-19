-- Data dummy Desa Margo Mulyo.
-- Aman dijalankan berulang karena menggunakan UUID/slug tetap dan upsert.

insert into public.news_articles
  (id, title, slug, content, excerpt, image_url, category, is_published, created_at, updated_at)
values
  ('10000000-0000-4000-8000-000000000001', 'Gotong Royong Perbaikan Saluran Irigasi Menjelang Musim Tanam', 'gotong-royong-perbaikan-saluran-irigasi', E'Warga Desa Margo Mulyo bersama pemerintah desa melaksanakan gotong royong membersihkan saluran irigasi utama menjelang musim tanam. Kegiatan difokuskan pada pengangkatan lumpur, sampah, dan rumput yang menghambat aliran air menuju lahan pertanian.\n\nSejak pagi, warga membawa peralatan kerja masing-masing dan membagi tugas di sejumlah titik saluran. Pemerintah desa turut mendampingi kegiatan serta membantu menyiapkan kebutuhan kerja bersama.\n\nPembersihan ini diharapkan membuat pembagian air lebih lancar dan merata sehingga petani dapat memulai masa tanam sesuai jadwal. Warga juga diajak menjaga saluran dengan tidak membuang sampah dan melakukan pemeriksaan secara berkala.\n\nKegiatan ditutup dengan evaluasi singkat bersama kelompok tani untuk menentukan bagian saluran yang masih memerlukan perbaikan lanjutan.', 'Warga bersama pemerintah desa membersihkan saluran irigasi utama untuk mendukung musim tanam berikutnya.', '/images/hero-bg.png', 'Pertanian', true, '2026-07-12 08:00:00+07', '2026-07-12 08:00:00+07'),
  ('10000000-0000-4000-8000-000000000002', 'Penyaluran Bibit Jagung Unggul kepada Kelompok Tani', 'penyaluran-bibit-jagung-unggul', E'Pemerintah Desa Margo Mulyo menyalurkan bantuan bibit jagung unggul kepada lima kelompok tani sebagai bagian dari program penguatan sektor pertanian desa. Penyaluran dilakukan secara bertahap agar setiap kelompok menerima bibit sesuai luas lahan yang akan ditanami.\n\nSebelum bantuan diserahkan, pemerintah desa bersama perwakilan kelompok tani melakukan pendataan penerima dan kebutuhan lahan. Pendataan tersebut dilakukan untuk memastikan bantuan tepat sasaran dan dapat dimanfaatkan pada musim tanam yang sedang dipersiapkan.\n\nSelain menerima bibit, para petani memperoleh arahan mengenai pemilihan waktu tanam, jarak tanam, pemupukan, serta perawatan tanaman. Pendampingan akan dilanjutkan melalui pertemuan kelompok agar kendala di lapangan dapat segera dibahas bersama.\n\nBantuan ini diharapkan membantu meningkatkan produktivitas dan kualitas hasil panen warga. Pemerintah desa mengajak kelompok penerima merawat bantuan dengan baik serta mencatat perkembangan tanaman sebagai bahan evaluasi program berikutnya.', 'Lima kelompok tani menerima bantuan bibit jagung unggul untuk meningkatkan produktivitas lahan.', '/images/hero-bg.png', 'Pemberdayaan', true, '2026-07-08 09:30:00+07', '2026-07-08 09:30:00+07'),
  ('10000000-0000-4000-8000-000000000003', 'Pelatihan Pembuatan Pupuk Organik bagi Pemuda Desa', 'pelatihan-pupuk-organik-pemuda-desa', E'Pemuda Desa Margo Mulyo mengikuti pelatihan pembuatan pupuk organik dengan memanfaatkan sisa pertanian dan limbah rumah tangga. Kegiatan ini bertujuan menambah keterampilan sekaligus mendorong praktik pertanian yang lebih ramah lingkungan.\n\nPeserta mempelajari cara memilih bahan, menyusun campuran, menjaga kelembapan, dan mengenali proses penguraian yang baik. Materi disampaikan melalui penjelasan singkat yang dilanjutkan dengan praktik langsung secara berkelompok.\n\nPupuk yang dihasilkan dapat dimanfaatkan untuk kebun rumah maupun lahan pertanian. Penggunaan bahan yang tersedia di sekitar desa juga diharapkan membantu warga mengurangi limbah dan menekan biaya pemupukan.\n\nSetelah pelatihan, peserta didorong melakukan praktik mandiri dan membagikan pengetahuan kepada warga lainnya. Pemerintah desa akan memantau hasil kegiatan untuk melihat peluang pengembangan menjadi usaha produktif pemuda.', 'Pemuda desa mempelajari pengolahan sisa pertanian menjadi pupuk organik bernilai guna.', '/images/hero-bg.png', 'Kegiatan', true, '2026-07-03 13:00:00+07', '2026-07-03 13:00:00+07'),
  ('10000000-0000-4000-8000-000000000004', 'Jadwal Pelayanan Administrasi Desa Bulan Juli', 'jadwal-pelayanan-administrasi-juli', E'Pelayanan administrasi Desa Margo Mulyo dilaksanakan setiap Senin sampai Jumat pukul 08.00 hingga 16.00 WIB di kantor desa. Warga dapat mengurus surat pengantar, dokumen kependudukan, dan kebutuhan administrasi lainnya pada jam tersebut.\n\nUntuk mempercepat proses pelayanan, warga diminta membawa KTP, Kartu Keluarga, serta dokumen pendukung sesuai jenis pengurusan. Petugas akan melakukan pemeriksaan berkas sebelum permohonan diproses.\n\nWarga yang belum mengetahui persyaratan dapat menghubungi kantor desa atau datang langsung untuk memperoleh penjelasan. Informasi perubahan jadwal pada hari libur akan diumumkan melalui kanal resmi desa.', 'Informasi jam pelayanan dan dokumen dasar yang perlu disiapkan oleh warga.', '/images/hero-bg.png', 'Pelayanan', true, '2026-07-01 07:30:00+07', '2026-07-01 07:30:00+07'),
  ('10000000-0000-4000-8000-000000000005', 'Musyawarah Desa Penyusunan Program Pembangunan', 'musyawarah-desa-program-pembangunan', E'Pemerintah desa, BPD, tokoh masyarakat, dan perwakilan warga mengikuti musyawarah untuk menyusun prioritas program pembangunan desa tahun berikutnya. Forum ini menjadi ruang bagi setiap wilayah untuk menyampaikan kebutuhan dan usulan.\n\nPembahasan mencakup perbaikan sarana umum, pelayanan masyarakat, penguatan pertanian, serta kegiatan pemberdayaan warga. Setiap usulan dicatat dan dipertimbangkan berdasarkan tingkat kebutuhan, manfaat, serta kemampuan anggaran desa.\n\nHasil musyawarah akan digunakan sebagai bahan penyusunan rencana kerja pemerintah desa. Warga akan memperoleh informasi lanjutan setelah tahapan verifikasi dan penetapan prioritas selesai dilakukan.', 'Musyawarah desa membahas prioritas pembangunan berdasarkan kebutuhan masyarakat.', '/images/hero-bg.png', 'Pemerintahan', false, '2026-06-27 10:00:00+07', '2026-06-27 10:00:00+07')
on conflict (slug) do update set
  title = excluded.title,
  content = excluded.content,
  excerpt = excluded.excerpt,
  image_url = excluded.image_url,
  category = excluded.category,
  is_published = excluded.is_published,
  updated_at = excluded.updated_at;

insert into public.gallery_items
  (id, title, image_url, album, description, created_at)
values
  ('20000000-0000-4000-8000-000000000001', 'Gotong Royong Saluran Irigasi', '/images/hero-bg.png', 'Kegiatan Warga', 'Kebersamaan warga membersihkan saluran irigasi desa.', '2026-07-12 10:00:00+07'),
  ('20000000-0000-4000-8000-000000000002', 'Hamparan Pertanian Desa', '/images/hero-bg.png', 'Potensi Desa', 'Lahan pertanian produktif sebagai penopang ekonomi warga.', '2026-07-10 08:00:00+07'),
  ('20000000-0000-4000-8000-000000000003', 'Pertemuan Kelompok Tani', '/images/hero-bg.png', 'Pertanian', 'Pertemuan rutin untuk koordinasi musim tanam.', '2026-07-08 11:00:00+07'),
  ('20000000-0000-4000-8000-000000000004', 'Pelatihan Pemuda Desa', '/images/hero-bg.png', 'Pemberdayaan', 'Dokumentasi kegiatan peningkatan keterampilan pemuda.', '2026-07-03 15:00:00+07'),
  ('20000000-0000-4000-8000-000000000005', 'Musyawarah Desa', '/images/hero-bg.png', 'Pemerintahan', 'Warga menyampaikan usulan pembangunan dalam musyawarah desa.', '2026-06-27 13:00:00+07')
on conflict (id) do update set
  title = excluded.title,
  image_url = excluded.image_url,
  album = excluded.album,
  description = excluded.description;

insert into public.population_stats
  (id, category, label, value, year, updated_at)
values
  ('30000000-0000-4000-8000-000000000001', 'Ringkasan', 'Jumlah Penduduk', 3700, 2026, now()),
  ('30000000-0000-4000-8000-000000000002', 'Ringkasan', 'Kepala Keluarga', 1433, 2026, now()),
  ('30000000-0000-4000-8000-000000000003', 'Ringkasan', 'Jumlah Dusun', 6, 2026, now()),
  ('30000000-0000-4000-8000-000000000004', 'Wilayah', 'Luas Wilayah (km²)', 6.89, 2026, now()),
  ('30000000-0000-4000-8000-000000000005', 'Kelompok Usia', '0–14 tahun', 814, 2026, now()),
  ('30000000-0000-4000-8000-000000000006', 'Kelompok Usia', '15–24 tahun', 666, 2026, now()),
  ('30000000-0000-4000-8000-000000000007', 'Kelompok Usia', '25–44 tahun', 1258, 2026, now()),
  ('30000000-0000-4000-8000-000000000008', 'Mata Pencaharian', 'Petani', 64, 2026, now()),
  ('30000000-0000-4000-8000-000000000009', 'Mata Pencaharian', 'Wiraswasta', 15, 2026, now()),
  ('30000000-0000-4000-8000-000000000010', 'Mata Pencaharian', 'Karyawan', 11, 2026, now())
on conflict (id) do update set
  category = excluded.category,
  label = excluded.label,
  value = excluded.value,
  year = excluded.year,
  updated_at = excluded.updated_at;
