import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import type { NewsArticle } from '@/types';

export const fallbackNewsArticles: NewsArticle[] = [
  {
    id: '1',
    category: 'Pertanian',
    created_at: '2024-05-12',
    updated_at: '2024-05-12',
    title: 'Gotong Royong Perbaikan Saluran Irigasi Menjelang Musim Tanam',
    slug: 'gotong-royong-perbaikan-saluran-irigasi',
    excerpt: 'Warga bersama pemerintah desa membersihkan saluran utama untuk mendukung musim tanam berikutnya.',
    content: 'Warga Desa Margo Mulyo bersama pemerintah desa melaksanakan gotong royong membersihkan saluran irigasi utama menjelang musim tanam. Kegiatan difokuskan pada pengangkatan lumpur, sampah, dan rumput yang menghambat aliran air menuju lahan pertanian.\n\nSejak pagi, warga membawa peralatan kerja masing-masing dan membagi tugas di sejumlah titik saluran. Pemerintah desa turut mendampingi kegiatan serta membantu menyiapkan kebutuhan kerja bersama.\n\nPembersihan ini diharapkan membuat pembagian air lebih lancar dan merata sehingga petani dapat memulai masa tanam sesuai jadwal. Warga juga diajak menjaga saluran dengan tidak membuang sampah dan melakukan pemeriksaan secara berkala.\n\nKegiatan ditutup dengan evaluasi singkat bersama kelompok tani untuk menentukan bagian saluran yang masih memerlukan perbaikan lanjutan.',
    image_url: null,
    is_published: true,
  },
  {
    id: '2',
    category: 'Pemberdayaan',
    created_at: '2024-05-08',
    updated_at: '2024-05-08',
    title: 'Bantuan Bibit Jagung Unggul untuk Kelompok Tani',
    slug: 'penyaluran-bibit-jagung-unggul',
    excerpt: 'Lima kelompok tani menerima bantuan bibit sebagai dukungan peningkatan produktivitas.',
    content: 'Pemerintah Desa Margo Mulyo menyalurkan bantuan bibit jagung unggul kepada lima kelompok tani sebagai bagian dari program penguatan sektor pertanian desa. Penyaluran dilakukan secara bertahap agar setiap kelompok menerima bibit sesuai luas lahan yang akan ditanami.\n\nSebelum bantuan diserahkan, pemerintah desa bersama perwakilan kelompok tani melakukan pendataan penerima dan kebutuhan lahan. Pendataan tersebut dilakukan untuk memastikan bantuan tepat sasaran dan dapat dimanfaatkan pada musim tanam yang sedang dipersiapkan.\n\nSelain menerima bibit, para petani memperoleh arahan mengenai pemilihan waktu tanam, jarak tanam, pemupukan, serta perawatan tanaman. Pendampingan akan dilanjutkan melalui pertemuan kelompok agar kendala di lapangan dapat segera dibahas bersama.\n\nBantuan ini diharapkan membantu meningkatkan produktivitas dan kualitas hasil panen warga. Pemerintah desa mengajak kelompok penerima merawat bantuan dengan baik serta mencatat perkembangan tanaman sebagai bahan evaluasi program berikutnya.',
    image_url: null,
    is_published: true,
  },
  {
    id: '3',
    category: 'Kegiatan',
    created_at: '2024-05-02',
    updated_at: '2024-05-02',
    title: 'Pelatihan Pupuk Organik bagi Pemuda Desa',
    slug: 'pelatihan-pupuk-organik-pemuda-desa',
    excerpt: 'Pemuda desa mempelajari pengolahan sisa pertanian menjadi pupuk yang bernilai guna.',
    content: 'Pemuda Desa Margo Mulyo mengikuti pelatihan pembuatan pupuk organik dengan memanfaatkan sisa pertanian dan limbah rumah tangga. Kegiatan ini bertujuan menambah keterampilan sekaligus mendorong praktik pertanian yang lebih ramah lingkungan.\n\nPeserta mempelajari cara memilih bahan, menyusun campuran, menjaga kelembapan, dan mengenali proses penguraian yang baik. Materi disampaikan melalui penjelasan singkat yang dilanjutkan dengan praktik langsung secara berkelompok.\n\nPupuk yang dihasilkan dapat dimanfaatkan untuk kebun rumah maupun lahan pertanian. Penggunaan bahan yang tersedia di sekitar desa juga diharapkan membantu warga mengurangi limbah dan menekan biaya pemupukan.\n\nSetelah pelatihan, peserta didorong melakukan praktik mandiri dan membagikan pengetahuan kepada warga lainnya. Pemerintah desa akan memantau hasil kegiatan untuk melihat peluang pengembangan menjadi usaha produktif pemuda.',
    image_url: null,
    is_published: true,
  },
];

export const getPublishedNewsBySlug = cache(async (slug: string): Promise<NewsArticle | null> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from('news_articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  return (data as NewsArticle | null) ?? fallbackNewsArticles.find((article) => article.slug === slug) ?? null;
});
