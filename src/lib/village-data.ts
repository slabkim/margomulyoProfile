export type HamletDemographic = {
  name: string;
  households_total: number;
  households_female: number;
  households_male: number;
  population_male: number;
  population_female: number;
  religion_islam: number;
  religion_christian: number;
  religion_catholic: number;
  age_0_5: number;
  age_6_12: number;
  age_13_17: number;
  age_18_21: number;
  age_22_59: number;
  age_60_plus: number;
  year: number;
};

export type VillagePotential = {
  section: string;
  label: string;
  value_text: string;
  numeric_value?: number | null;
  unit?: string | null;
  source_year: number;
  sort_order: number;
};

export const OFFICIAL_DATA_YEAR = 2026;
export const POTENTIAL_DATA_YEAR = 2019;

export const OFFICIAL_VISION = 'Terwujudnya Masyarakat Margomulyo yang mandiri, demokratis, dan handal dalam sumber daya manusia serta menjadi pusat keunggulan pertanian untuk meningkatkan ekonomi masyarakat dalam pembangunan di era pemerintah global.';

export const OFFICIAL_MISSIONS = [
  'Meningkatkan pendapatan dan kesejahteraan masyarakat melalui peningkatan produksi pertanian.',
  'Meningkatkan sumber daya manusia di bidang ilmu pengetahuan dan teknologi (IPTEK).',
  'Meningkatkan pelayanan umum terhadap masyarakat.',
];

export const OFFICIAL_HAMLET_DEMOGRAPHICS: HamletDemographic[] = [
  { name: 'Margomulyo I', households_total: 277, households_female: 35, households_male: 242, population_male: 435, population_female: 455, religion_islam: 883, religion_christian: 7, religion_catholic: 0, age_0_5: 44, age_6_12: 94, age_13_17: 86, age_18_21: 53, age_22_59: 500, age_60_plus: 113, year: 2026 },
  { name: 'Margomulyo II', households_total: 197, households_female: 12, households_male: 185, population_male: 333, population_female: 326, religion_islam: 659, religion_christian: 0, religion_catholic: 0, age_0_5: 20, age_6_12: 70, age_13_17: 50, age_18_21: 32, age_22_59: 390, age_60_plus: 97, year: 2026 },
  { name: 'Windumulyo', households_total: 205, households_female: 29, households_male: 176, population_male: 337, population_female: 347, religion_islam: 639, religion_christian: 21, religion_catholic: 24, age_0_5: 24, age_6_12: 60, age_13_17: 59, age_18_21: 47, age_22_59: 382, age_60_plus: 112, year: 2026 },
  { name: 'Tegal Rejo', households_total: 215, households_female: 23, households_male: 192, population_male: 365, population_female: 372, religion_islam: 726, religion_christian: 0, religion_catholic: 11, age_0_5: 21, age_6_12: 88, age_13_17: 74, age_18_21: 37, age_22_59: 424, age_60_plus: 93, year: 2026 },
  { name: 'Tridadi I', households_total: 191, households_female: 14, households_male: 177, population_male: 329, population_female: 301, religion_islam: 601, religion_christian: 1, religion_catholic: 28, age_0_5: 29, age_6_12: 68, age_13_17: 42, age_18_21: 28, age_22_59: 376, age_60_plus: 87, year: 2026 },
  { name: 'Tridadi II', households_total: 141, households_female: 17, households_male: 124, population_male: 251, population_female: 230, religion_islam: 431, religion_christian: 5, religion_catholic: 45, age_0_5: 21, age_6_12: 57, age_13_17: 34, age_18_21: 32, age_22_59: 272, age_60_plus: 65, year: 2026 },
];

export const OFFICIAL_POPULATION_STATS = [
  { category: 'Ringkasan', label: 'Jumlah Penduduk', value: 4081, year: 2026 },
  { category: 'Ringkasan', label: 'Kepala Keluarga', value: 1226, year: 2026 },
  { category: 'Ringkasan', label: 'Jumlah Dusun', value: 6, year: 2026 },
  { category: 'Ringkasan', label: 'Luas Wilayah (km²)', value: 6.957, year: 2019 },
  { category: 'Jenis Kelamin', label: 'Laki-laki', value: 2050, year: 2026 },
  { category: 'Jenis Kelamin', label: 'Perempuan', value: 2031, year: 2026 },
  { category: 'Kepala Keluarga', label: 'KK Perempuan', value: 130, year: 2026 },
  { category: 'Kepala Keluarga', label: 'KK Laki-laki', value: 1096, year: 2026 },
  { category: 'Agama', label: 'Islam', value: 3939, year: 2026 },
  { category: 'Agama', label: 'Kristen', value: 34, year: 2026 },
  { category: 'Agama', label: 'Katolik', value: 108, year: 2026 },
  { category: 'Kelompok Usia', label: '0–5 tahun', value: 159, year: 2026 },
  { category: 'Kelompok Usia', label: '6–12 tahun', value: 437, year: 2026 },
  { category: 'Kelompok Usia', label: '13–17 tahun', value: 345, year: 2026 },
  { category: 'Kelompok Usia', label: '18–21 tahun', value: 229, year: 2026 },
  { category: 'Kelompok Usia', label: '22–59 tahun', value: 2344, year: 2026 },
  { category: 'Kelompok Usia', label: 'Di atas 60 tahun', value: 567, year: 2026 },
  ...OFFICIAL_HAMLET_DEMOGRAPHICS.map((hamlet) => ({ category: 'Penduduk per Dusun', label: hamlet.name, value: hamlet.population_male + hamlet.population_female, year: hamlet.year })),
];

export const OFFICIAL_POTENTIALS: VillagePotential[] = [
  { section: 'Batas Wilayah', label: 'Sebelah utara', value_text: 'Desa Rengas, Kecamatan Bekri, Lampung Tengah', source_year: 2019, sort_order: 1 },
  { section: 'Batas Wilayah', label: 'Sebelah selatan', value_text: 'Desa Gedung Gumanti, Kecamatan Tegineneng, Pesawaran', source_year: 2019, sort_order: 2 },
  { section: 'Batas Wilayah', label: 'Sebelah timur', value_text: 'Desa Bumi Agung, Kecamatan Tegineneng, Pesawaran', source_year: 2019, sort_order: 3 },
  { section: 'Batas Wilayah', label: 'Sebelah barat', value_text: 'Desa Binjai Agung, Kecamatan Bekri, Lampung Tengah', source_year: 2019, sort_order: 4 },
  { section: 'Legalitas Wilayah', label: 'Penetapan batas', value_text: 'Sudah ada', source_year: 2019, sort_order: 5 },
  { section: 'Legalitas Wilayah', label: 'Dasar hukum', value_text: 'Perda No. 7 Tahun 1988', source_year: 2019, sort_order: 6 },
  { section: 'Legalitas Wilayah', label: 'Peta wilayah', value_text: 'Ada', source_year: 2019, sort_order: 7 },
  { section: 'Penggunaan Lahan', label: 'Pemukiman / pekarangan', value_text: '11,25 ha', numeric_value: 11.25, unit: 'ha', source_year: 2019, sort_order: 8 },
  { section: 'Penggunaan Lahan', label: 'Persawahan', value_text: '500,75 ha', numeric_value: 500.75, unit: 'ha', source_year: 2019, sort_order: 9 },
  { section: 'Penggunaan Lahan', label: 'Perkebunan', value_text: '15,00 ha', numeric_value: 15, unit: 'ha', source_year: 2019, sort_order: 10 },
  { section: 'Penggunaan Lahan', label: 'Kuburan', value_text: '1,00 ha', numeric_value: 1, unit: 'ha', source_year: 2019, sort_order: 11 },
  { section: 'Penggunaan Lahan', label: 'Tegal / perladangan', value_text: '96,00 ha', numeric_value: 96, unit: 'ha', source_year: 2019, sort_order: 12 },
  { section: 'Penggunaan Lahan', label: 'Perkantoran', value_text: '0,25 ha', numeric_value: .25, unit: 'ha', source_year: 2019, sort_order: 13 },
  { section: 'Penggunaan Lahan', label: 'Prasarana umum lainnya', value_text: '16,90 ha', numeric_value: 16.9, unit: 'ha', source_year: 2019, sort_order: 14 },
  { section: 'Penggunaan Lahan', label: 'Lain-lain', value_text: '3,35 ha', numeric_value: 3.35, unit: 'ha', source_year: 2019, sort_order: 15 },
  { section: 'Penggunaan Lahan', label: 'Total luas', value_text: '695,70 ha', numeric_value: 695.7, unit: 'ha', source_year: 2019, sort_order: 16 },
  { section: 'Tanah Sawah', label: 'Irigasi teknis', value_text: '0 ha', numeric_value: 0, unit: 'ha', source_year: 2019, sort_order: 17 },
  { section: 'Tanah Sawah', label: 'Irigasi setengah teknis', value_text: '36 ha', numeric_value: 36, unit: 'ha', source_year: 2019, sort_order: 18 },
  { section: 'Tanah Sawah', label: 'Tadah hujan', value_text: '464 ha', numeric_value: 464, unit: 'ha', source_year: 2019, sort_order: 19 },
  { section: 'Tanah Sawah', label: 'Rawa', value_text: '0,75 ha', numeric_value: .75, unit: 'ha', source_year: 2019, sort_order: 20 },
  { section: 'Tanah Sawah', label: 'Total luas', value_text: '500,75 ha', numeric_value: 500.75, unit: 'ha', source_year: 2019, sort_order: 21 },
  { section: 'Tanah Kering', label: 'Tegal / ladang', value_text: '15 ha', numeric_value: 15, unit: 'ha', source_year: 2019, sort_order: 22 },
  { section: 'Tanah Kering', label: 'Pemukiman', value_text: '11,25 ha', numeric_value: 11.25, unit: 'ha', source_year: 2019, sort_order: 23 },
  { section: 'Tanah Kering', label: 'Pekarangan', value_text: '95 ha', numeric_value: 95, unit: 'ha', source_year: 2019, sort_order: 24 },
  { section: 'Tanah Kering', label: 'Lain-lain', value_text: '53,75 ha', numeric_value: 53.75, unit: 'ha', source_year: 2019, sort_order: 25 },
  { section: 'Tanah Kering', label: 'Total luas', value_text: '194,5 ha', numeric_value: 194.5, unit: 'ha', source_year: 2019, sort_order: 26 },
  { section: 'Tanah Basah', label: 'Tanah rawa', value_text: '0,75 ha', numeric_value: .75, unit: 'ha', source_year: 2019, sort_order: 27 },
  { section: 'Tanah Basah', label: 'Bantaran sungai', value_text: '10 ha', numeric_value: 10, unit: 'ha', source_year: 2019, sort_order: 28 },
  { section: 'Tanah Basah', label: 'Total luas', value_text: '12,8 ha', numeric_value: 12.8, unit: 'ha', source_year: 2019, sort_order: 29 },
  { section: 'Perkebunan', label: 'Perkebunan perorangan', value_text: '10 ha', numeric_value: 10, unit: 'ha', source_year: 2019, sort_order: 30 },
  { section: 'Perkebunan', label: 'Total luas', value_text: '10 ha', numeric_value: 10, unit: 'ha', source_year: 2019, sort_order: 31 },
  { section: 'Fasilitas Umum', label: 'Lapangan olahraga', value_text: '2 ha', numeric_value: 2, unit: 'ha', source_year: 2019, sort_order: 32 },
  { section: 'Fasilitas Umum', label: 'Perkantoran pemerintah', value_text: '1,45 ha', numeric_value: 1.45, unit: 'ha', source_year: 2019, sort_order: 33 },
  { section: 'Fasilitas Umum', label: 'Ruang publik / taman', value_text: '0,25 ha', numeric_value: .25, unit: 'ha', source_year: 2019, sort_order: 34 },
  { section: 'Fasilitas Umum', label: 'Tempat pembuangan sampah', value_text: '1 ha', numeric_value: 1, unit: 'ha', source_year: 2019, sort_order: 35 },
  { section: 'Fasilitas Umum', label: 'Sekolah / perguruan tinggi', value_text: '0,01 ha', numeric_value: .01, unit: 'ha', source_year: 2019, sort_order: 36 },
  { section: 'Fasilitas Umum', label: 'Pertokoan', value_text: '0,5 ha', numeric_value: .5, unit: 'ha', source_year: 2019, sort_order: 37 },
  { section: 'Fasilitas Umum', label: 'Fasilitas pasar', value_text: '0,25 ha', numeric_value: .25, unit: 'ha', source_year: 2019, sort_order: 38 },
  { section: 'Fasilitas Umum', label: 'Daerah tangkapan air', value_text: '12,9 km²', numeric_value: 12.9, unit: 'km²', source_year: 2019, sort_order: 39 },
  { section: 'Fasilitas Umum', label: 'Usaha perikanan', value_text: '16 ha', numeric_value: 16, unit: 'ha', source_year: 2019, sort_order: 40 },
  { section: 'Fasilitas Umum', label: 'Total luas', value_text: '33,56 ha', numeric_value: 33.56, unit: 'ha', source_year: 2019, sort_order: 41 },
];
