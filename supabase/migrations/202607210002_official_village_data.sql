create table if not exists public.village_profile (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text,
  updated_at timestamptz not null default now()
);

create table if not exists public.hamlet_demographics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  households_total integer not null,
  households_female integer not null,
  households_male integer not null,
  population_male integer not null,
  population_female integer not null,
  religion_islam integer not null,
  religion_christian integer not null,
  religion_catholic integer not null,
  age_0_5 integer not null,
  age_6_12 integer not null,
  age_13_17 integer not null,
  age_18_21 integer not null,
  age_22_59 integer not null,
  age_60_plus integer not null,
  year integer not null,
  updated_at timestamptz not null default now(),
  unique (name, year),
  constraint hamlet_demographics_nonnegative check (
    households_total >= 0 and households_female >= 0 and households_male >= 0
    and population_male >= 0 and population_female >= 0
    and religion_islam >= 0 and religion_christian >= 0 and religion_catholic >= 0
    and age_0_5 >= 0 and age_6_12 >= 0 and age_13_17 >= 0
    and age_18_21 >= 0 and age_22_59 >= 0 and age_60_plus >= 0
  ),
  constraint hamlet_demographics_year check (year between 1900 and 2100)
);

create table if not exists public.village_potentials (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  label text not null,
  value_text text not null,
  numeric_value numeric,
  unit text,
  source_year integer not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (section, label, source_year),
  constraint village_potentials_year check (source_year between 1900 and 2100),
  constraint village_potentials_numeric check (numeric_value is null or numeric_value >= 0)
);

alter table public.village_profile enable row level security;
alter table public.hamlet_demographics enable row level security;
alter table public.village_potentials enable row level security;

create policy "public can read village profile" on public.village_profile for select to anon, authenticated using (true);
create policy "admins can manage village profile" on public.village_profile for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy "public can read hamlet demographics" on public.hamlet_demographics for select to anon, authenticated using (true);
create policy "admins can manage hamlet demographics" on public.hamlet_demographics for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy "public can read village potentials" on public.village_potentials for select to anon, authenticated using (true);
create policy "admins can manage village potentials" on public.village_potentials for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

grant select on public.village_profile, public.hamlet_demographics, public.village_potentials to anon;
grant select, insert, update, delete on public.village_profile, public.hamlet_demographics, public.village_potentials to authenticated;

insert into public.village_profile (key, value, updated_at) values
  ('vision', 'Terwujudnya Masyarakat Margomulyo yang mandiri, demokratis, dan handal dalam sumber daya manusia serta menjadi pusat keunggulan pertanian untuk meningkatkan ekonomi masyarakat dalam pembangunan di era pemerintah global.', now()),
  ('mission_1', 'Meningkatkan pendapatan dan kesejahteraan masyarakat melalui peningkatan produksi pertanian.', now()),
  ('mission_2', 'Meningkatkan sumber daya manusia di bidang ilmu pengetahuan dan teknologi (IPTEK).', now()),
  ('mission_3', 'Meningkatkan pelayanan umum terhadap masyarakat.', now()),
  ('population_source_year', '2026', now()),
  ('potential_source_year', '2019', now()),
  ('area_hectares', '695,70', now()),
  ('boundary_regulation', 'Perda No. 7 Tahun 1988', now())
on conflict (key) do update set value = excluded.value, updated_at = excluded.updated_at;

insert into public.hamlet_demographics
  (name, households_total, households_female, households_male, population_male, population_female, religion_islam, religion_christian, religion_catholic, age_0_5, age_6_12, age_13_17, age_18_21, age_22_59, age_60_plus, year)
values
  ('Margomulyo I', 277, 35, 242, 435, 455, 883, 7, 0, 44, 94, 86, 53, 500, 113, 2026),
  ('Margomulyo II', 197, 12, 185, 333, 326, 659, 0, 0, 20, 70, 50, 32, 390, 97, 2026),
  ('Windumulyo', 205, 29, 176, 337, 347, 639, 21, 24, 24, 60, 59, 47, 382, 112, 2026),
  ('Tegal Rejo', 215, 23, 192, 365, 372, 726, 0, 11, 21, 88, 74, 37, 424, 93, 2026),
  ('Tridadi I', 191, 14, 177, 329, 301, 601, 1, 28, 29, 68, 42, 28, 376, 87, 2026),
  ('Tridadi II', 141, 17, 124, 251, 230, 431, 5, 45, 21, 57, 34, 32, 272, 65, 2026)
on conflict (name, year) do update set
  households_total = excluded.households_total, households_female = excluded.households_female, households_male = excluded.households_male,
  population_male = excluded.population_male, population_female = excluded.population_female,
  religion_islam = excluded.religion_islam, religion_christian = excluded.religion_christian, religion_catholic = excluded.religion_catholic,
  age_0_5 = excluded.age_0_5, age_6_12 = excluded.age_6_12, age_13_17 = excluded.age_13_17,
  age_18_21 = excluded.age_18_21, age_22_59 = excluded.age_22_59, age_60_plus = excluded.age_60_plus,
  updated_at = now();

delete from public.population_stats where year = 2026;
insert into public.population_stats (category, label, value, year, updated_at) values
  ('Ringkasan', 'Jumlah Penduduk', 4081, 2026, now()),
  ('Ringkasan', 'Kepala Keluarga', 1226, 2026, now()),
  ('Ringkasan', 'Jumlah Dusun', 6, 2026, now()),
  ('Jenis Kelamin', 'Laki-laki', 2050, 2026, now()),
  ('Jenis Kelamin', 'Perempuan', 2031, 2026, now()),
  ('Kepala Keluarga', 'KK Perempuan', 130, 2026, now()),
  ('Kepala Keluarga', 'KK Laki-laki', 1096, 2026, now()),
  ('Agama', 'Islam', 3939, 2026, now()),
  ('Agama', 'Kristen', 34, 2026, now()),
  ('Agama', 'Katolik', 108, 2026, now()),
  ('Kelompok Usia', '0–5 tahun', 159, 2026, now()),
  ('Kelompok Usia', '6–12 tahun', 437, 2026, now()),
  ('Kelompok Usia', '13–17 tahun', 345, 2026, now()),
  ('Kelompok Usia', '18–21 tahun', 229, 2026, now()),
  ('Kelompok Usia', '22–59 tahun', 2344, 2026, now()),
  ('Kelompok Usia', 'Di atas 60 tahun', 567, 2026, now()),
  ('Penduduk per Dusun', 'Margomulyo I', 890, 2026, now()),
  ('Penduduk per Dusun', 'Margomulyo II', 659, 2026, now()),
  ('Penduduk per Dusun', 'Windumulyo', 684, 2026, now()),
  ('Penduduk per Dusun', 'Tegal Rejo', 737, 2026, now()),
  ('Penduduk per Dusun', 'Tridadi I', 630, 2026, now()),
  ('Penduduk per Dusun', 'Tridadi II', 481, 2026, now());

delete from public.population_stats where label in ('Luas Wilayah (km²)', 'Luas Wilayah (kmÂ²)');
insert into public.population_stats (category, label, value, year, updated_at)
values ('Ringkasan', 'Luas Wilayah (km²)', 6.957, 2019, now());

insert into public.village_potentials (section, label, value_text, numeric_value, unit, source_year, sort_order) values
  ('Batas Wilayah', 'Sebelah utara', 'Desa Rengas, Kecamatan Bekri, Lampung Tengah', null, null, 2019, 1),
  ('Batas Wilayah', 'Sebelah selatan', 'Desa Gedung Gumanti, Kecamatan Tegineneng, Pesawaran', null, null, 2019, 2),
  ('Batas Wilayah', 'Sebelah timur', 'Desa Bumi Agung, Kecamatan Tegineneng, Pesawaran', null, null, 2019, 3),
  ('Batas Wilayah', 'Sebelah barat', 'Desa Binjai Agung, Kecamatan Bekri, Lampung Tengah', null, null, 2019, 4),
  ('Legalitas Wilayah', 'Penetapan batas', 'Sudah ada', null, null, 2019, 5),
  ('Legalitas Wilayah', 'Dasar hukum', 'Perda No. 7 Tahun 1988', null, null, 2019, 6),
  ('Legalitas Wilayah', 'Peta wilayah', 'Ada', null, null, 2019, 7),
  ('Penggunaan Lahan', 'Pemukiman / pekarangan', '11,25 ha', 11.25, 'ha', 2019, 8),
  ('Penggunaan Lahan', 'Persawahan', '500,75 ha', 500.75, 'ha', 2019, 9),
  ('Penggunaan Lahan', 'Perkebunan', '15,00 ha', 15, 'ha', 2019, 10),
  ('Penggunaan Lahan', 'Kuburan', '1,00 ha', 1, 'ha', 2019, 11),
  ('Penggunaan Lahan', 'Tegal / perladangan', '96,00 ha', 96, 'ha', 2019, 12),
  ('Penggunaan Lahan', 'Perkantoran', '0,25 ha', .25, 'ha', 2019, 13),
  ('Penggunaan Lahan', 'Prasarana umum lainnya', '16,90 ha', 16.9, 'ha', 2019, 14),
  ('Penggunaan Lahan', 'Lain-lain', '3,35 ha', 3.35, 'ha', 2019, 15),
  ('Penggunaan Lahan', 'Total luas', '695,70 ha', 695.7, 'ha', 2019, 16),
  ('Tanah Sawah', 'Irigasi teknis', '0 ha', 0, 'ha', 2019, 17),
  ('Tanah Sawah', 'Irigasi setengah teknis', '36 ha', 36, 'ha', 2019, 18),
  ('Tanah Sawah', 'Tadah hujan', '464 ha', 464, 'ha', 2019, 19),
  ('Tanah Sawah', 'Rawa', '0,75 ha', .75, 'ha', 2019, 20),
  ('Tanah Sawah', 'Total luas', '500,75 ha', 500.75, 'ha', 2019, 21),
  ('Tanah Kering', 'Tegal / ladang', '15 ha', 15, 'ha', 2019, 22),
  ('Tanah Kering', 'Pemukiman', '11,25 ha', 11.25, 'ha', 2019, 23),
  ('Tanah Kering', 'Pekarangan', '95 ha', 95, 'ha', 2019, 24),
  ('Tanah Kering', 'Lain-lain', '53,75 ha', 53.75, 'ha', 2019, 25),
  ('Tanah Kering', 'Total luas', '194,5 ha', 194.5, 'ha', 2019, 26),
  ('Tanah Basah', 'Tanah rawa', '0,75 ha', .75, 'ha', 2019, 27),
  ('Tanah Basah', 'Bantaran sungai', '10 ha', 10, 'ha', 2019, 28),
  ('Tanah Basah', 'Total luas', '12,8 ha', 12.8, 'ha', 2019, 29),
  ('Perkebunan', 'Perkebunan perorangan', '10 ha', 10, 'ha', 2019, 30),
  ('Perkebunan', 'Total luas', '10 ha', 10, 'ha', 2019, 31),
  ('Fasilitas Umum', 'Lapangan olahraga', '2 ha', 2, 'ha', 2019, 32),
  ('Fasilitas Umum', 'Perkantoran pemerintah', '1,45 ha', 1.45, 'ha', 2019, 33),
  ('Fasilitas Umum', 'Ruang publik / taman', '0,25 ha', .25, 'ha', 2019, 34),
  ('Fasilitas Umum', 'Tempat pembuangan sampah', '1 ha', 1, 'ha', 2019, 35),
  ('Fasilitas Umum', 'Sekolah / perguruan tinggi', '0,01 ha', .01, 'ha', 2019, 36),
  ('Fasilitas Umum', 'Pertokoan', '0,5 ha', .5, 'ha', 2019, 37),
  ('Fasilitas Umum', 'Fasilitas pasar', '0,25 ha', .25, 'ha', 2019, 38),
  ('Fasilitas Umum', 'Daerah tangkapan air', '12,9 km²', 12.9, 'km²', 2019, 39),
  ('Fasilitas Umum', 'Usaha perikanan', '16 ha', 16, 'ha', 2019, 40),
  ('Fasilitas Umum', 'Total luas', '33,56 ha', 33.56, 'ha', 2019, 41)
on conflict (section, label, source_year) do update set
  value_text = excluded.value_text, numeric_value = excluded.numeric_value, unit = excluded.unit,
  sort_order = excluded.sort_order, updated_at = now();
