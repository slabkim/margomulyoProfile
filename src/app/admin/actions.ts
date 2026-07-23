'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import sharp from 'sharp';
import { parseVillageDateTime } from '@/lib/news-schedule';
import { createClient } from '@/lib/supabase/server';
import { AGE_GROUP_OPTIONS, HOME_STATISTIC_OPTIONS, calculateAgeGroupCounts, canonicalManagedStatisticLabel } from '@/lib/statistics';

const IMAGE_BUCKET = 'village-media';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 40_000_000;
const IMAGE_INPUT_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'avif', 'tif', 'tiff', 'gif']);
const HEIC_INPUT_EXTENSIONS = new Set(['heic', 'heif']);

export type AuthState = { error?: string } | undefined;

async function requireAdmin() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect('/admin/login');

  const { data: admin } = await supabase.from('admin_users').select('user_id').eq('user_id', userId).eq('is_active', true).maybeSingle();
  if (!admin) redirect('/admin/login?error=unauthorized');
  return supabase;
}

export async function login(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  if (!email || !password) return { error: 'Email dan kata sandi wajib diisi.' };
  if (email.length > 254 || password.length > 1024) return { error: 'Email atau kata sandi tidak sesuai.' };

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return { error: 'Email atau kata sandi tidak sesuai.' };

    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', data.user.id)
      .eq('is_active', true)
      .maybeSingle();

    if (adminError) {
      await supabase.auth.signOut();
      return { error: 'Data administrator belum dapat diperiksa. Silakan coba kembali.' };
    }
    if (!admin) {
      await supabase.auth.signOut();
      return { error: 'Akun ini tidak memiliki akses administrator.' };
    }
  } catch {
    return { error: 'Layanan autentikasi sedang tidak dapat dijangkau. Periksa koneksi lalu coba kembali.' };
  }

  redirect('/admin');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

function value(formData: FormData, key: string) { return String(formData.get(key) || '').trim(); }
function limitedValue(formData: FormData, key: string, maxLength: number) {
  const result = value(formData, key);
  return result.length <= maxLength ? result : null;
}
function slugify(text: string) { return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
function isUuid(valueToCheck: string) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(valueToCheck); }

async function convertImageToWebp(input: Buffer, extension: string) {
  if (HEIC_INPUT_EXTENSIONS.has(extension)) {
    // Sharp bawaan Vercel tidak selalu menyertakan codec HEVC. Decode HEIC/HEIF
    // menjadi piksel RGBA terlebih dahulu, baru gunakan Sharp untuk kompresi WebP.
    const { default: decodeHeic } = await import('heic-decode');
    const decoded = await decodeHeic({ buffer: input });
    const pixelCount = decoded.width * decoded.height;

    if (!Number.isSafeInteger(pixelCount) || pixelCount <= 0 || pixelCount > MAX_IMAGE_PIXELS) {
      throw new Error('Invalid HEIC dimensions');
    }

    return sharp(Buffer.from(decoded.data), {
      raw: { width: decoded.width, height: decoded.height, channels: 4 },
    })
      .webp({ quality: 85, effort: 4 })
      .toBuffer();
  }

  return sharp(input, { failOn: 'error', limitInputPixels: MAX_IMAGE_PIXELS, pages: 1 })
    .rotate()
    .webp({ quality: 85, effort: 4 })
    .toBuffer();
}

async function uploadImage(supabase: Awaited<ReturnType<typeof createClient>>, formData: FormData, folder: string) {
  const image = formData.get('image');
  if (!(image instanceof File) || image.size === 0) return { url: null, path: null, error: null };
  if (image.size > MAX_IMAGE_SIZE) return { url: null, path: null, error: 'Ukuran gambar maksimal 5 MB.' };
  const extension = image.name.split('.').pop()?.toLowerCase() || '';
  if (!IMAGE_INPUT_EXTENSIONS.has(extension)) return { url: null, path: null, error: 'Format gambar tidak didukung. Gunakan JPG, PNG, WebP, HEIC/HEIF, AVIF, TIFF, atau GIF.' };

  let convertedImage: Buffer;
  try {
    const input = Buffer.from(await image.arrayBuffer());
    convertedImage = await convertImageToWebp(input, extension);
  } catch {
    const error = HEIC_INPUT_EXTENSIONS.has(extension)
      ? 'File HEIC/HEIF tidak dapat didekode. Pastikan file selesai disalin, tidak rusak, dan benar-benar berformat HEIC/HEIF.'
      : 'File tidak dapat dibaca sebagai gambar. Pastikan file tidak rusak dan formatnya sesuai dengan ekstensi file.';
    return { url: null, path: null, error };
  }
  if (convertedImage.length > MAX_IMAGE_SIZE) return { url: null, path: null, error: 'Ukuran gambar setelah diproses masih melebihi 5 MB. Pilih gambar dengan resolusi lebih kecil.' };

  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, convertedImage, {
    contentType: 'image/webp',
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) return { url: null, path: null, error: error.message };
  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path, error: null };
}

function storagePath(url: string) {
  const marker = `/storage/v1/object/public/${IMAGE_BUCKET}/`;
  const index = url.indexOf(marker);
  return index >= 0 ? decodeURIComponent(url.slice(index + marker.length)) : null;
}

async function removeImage(supabase: Awaited<ReturnType<typeof createClient>>, url: string | null | undefined) {
  if (!url) return;
  const path = storagePath(url);
  if (path) await supabase.storage.from(IMAGE_BUCKET).remove([path]);
}

export async function saveNews(formData: FormData) {
  const supabase = await requireAdmin();
  const id = value(formData, 'id');
  if (id && !isUuid(id)) redirect('/admin/berita?error=ID berita tidak valid');
  const title = limitedValue(formData, 'title', 180);
  const content = limitedValue(formData, 'content', 50000);
  const excerpt = limitedValue(formData, 'excerpt', 500);
  const category = limitedValue(formData, 'category', 60);
  const eventAt = parseVillageDateTime(value(formData, 'event_at'));
  if (!title || content === null || excerpt === null || category === null || !eventAt) redirect('/admin/berita?error=Tanggal, waktu, atau konten berita tidak valid');
  const { data: existingArticle } = id
    ? await supabase.from('news_articles').select('image_url').eq('id', id).maybeSingle()
    : { data: null };
  const currentImage = existingArticle?.image_url || null;
  const upload = await uploadImage(supabase, formData, 'news');
  if (upload.error) redirect(`/admin/berita/${id || 'baru'}?error=${encodeURIComponent(upload.error)}`);
  const payload = { title, slug: slugify(limitedValue(formData, 'slug', 200) || title), excerpt: excerpt || null, content, category: category || 'Berita', image_url: upload.url || currentImage, event_at: eventAt, is_published: formData.get('is_published') === 'on', updated_at: new Date().toISOString() };
  const result = id ? await supabase.from('news_articles').update(payload).eq('id', id) : await supabase.from('news_articles').insert(payload);
  if (result.error) {
    if (upload.path) await supabase.storage.from(IMAGE_BUCKET).remove([upload.path]);
    redirect(`/admin/berita?error=${encodeURIComponent(result.error.message)}`);
  }
  if (upload.url && currentImage) await removeImage(supabase, currentImage);
  revalidatePath('/berita'); revalidatePath('/admin'); revalidatePath('/admin/berita');
  redirect('/admin/berita?success=Berita berhasil disimpan');
}

export async function deleteNews(formData: FormData) {
  const supabase = await requireAdmin();
  const id = value(formData, 'id');
  if (!isUuid(id)) redirect('/admin/berita?error=ID berita tidak valid');
  const { data: article } = await supabase.from('news_articles').select('image_url').eq('id', id).maybeSingle();
  const { error } = await supabase.from('news_articles').delete().eq('id', id);
  if (error) redirect(`/admin/berita?error=${encodeURIComponent(error.message)}`);
  await removeImage(supabase, article?.image_url);
  revalidatePath('/berita'); revalidatePath('/admin'); revalidatePath('/admin/berita');
}

export async function saveGallery(formData: FormData) {
  const supabase = await requireAdmin();
  const id = value(formData, 'id');
  if (id && !isUuid(id)) redirect('/admin/galeri?error=ID galeri tidak valid');
  const errorPath = id ? `/admin/galeri/${id}` : '/admin/galeri';
  const title = limitedValue(formData, 'title', 180);
  const album = limitedValue(formData, 'album', 80);
  const description = limitedValue(formData, 'description', 500);
  if (!title || album === null || description === null) redirect(`${errorPath}?error=Konten tidak valid atau terlalu panjang`);
  const { data: existingItem } = id
    ? await supabase.from('gallery_items').select('image_url').eq('id', id).maybeSingle()
    : { data: null };
  const upload = await uploadImage(supabase, formData, 'gallery');
  if (upload.error) redirect(`${errorPath}?error=${encodeURIComponent(upload.error)}`);
  const imageUrl = upload.url || existingItem?.image_url;
  if (!imageUrl) redirect(`${errorPath}?error=Gambar wajib dipilih`);
  const payload = { title, image_url: imageUrl, album: album || 'Kegiatan', description: description || null };
  const { error } = id
    ? await supabase.from('gallery_items').update(payload).eq('id', id)
    : await supabase.from('gallery_items').insert(payload);
  if (error) {
    if (upload.path) await supabase.storage.from(IMAGE_BUCKET).remove([upload.path]);
    redirect(`${errorPath}?error=${encodeURIComponent(error.message)}`);
  }
  if (upload.url && existingItem?.image_url) await removeImage(supabase, existingItem.image_url);
  revalidatePath('/galeri'); revalidatePath('/admin'); revalidatePath('/admin/galeri');
  redirect(`/admin/galeri?success=${id ? 'Galeri berhasil diperbarui' : 'Foto berhasil ditambahkan'}`);
}

export async function deleteGallery(formData: FormData) {
  const supabase = await requireAdmin();
  const id = value(formData, 'id');
  if (!isUuid(id)) redirect('/admin/galeri?error=ID galeri tidak valid');
  const { data: item } = await supabase.from('gallery_items').select('image_url').eq('id', id).maybeSingle();
  const { error } = await supabase.from('gallery_items').delete().eq('id', id);
  if (error) redirect(`/admin/galeri?error=${encodeURIComponent(error.message)}`);
  await removeImage(supabase, item?.image_url);
  revalidatePath('/galeri'); revalidatePath('/admin'); revalidatePath('/admin/galeri');
}

export async function saveStatistic(formData: FormData) {
  const supabase = await requireAdmin();
  const id = value(formData, 'id');
  if (id && !isUuid(id)) redirect('/admin/statistik?error=ID statistik tidak valid');
  if (id) {
    const { data: existingStatistic } = await supabase.from('population_stats').select('label').eq('id', id).maybeSingle();
    if (existingStatistic && canonicalManagedStatisticLabel(existingStatistic.label)) {
      redirect('/admin/statistik?error=Data utama dan kelompok usia harus diedit melalui formulir terpadu');
    }
  }
  const errorPath = id ? `/admin/statistik/${id}` : '/admin/statistik';
  const mode = value(formData, 'mode');
  const label = limitedValue(formData, 'label', 120);
  const requestedCategory = limitedValue(formData, 'category', 80);
  const category = mode === 'homepage' ? 'Ringkasan' : requestedCategory;
  const rawNumericValue = value(formData, 'value');
  const rawYear = value(formData, 'year');
  const numericValue = Number(rawNumericValue);
  const year = Number(rawYear);
  const validHomepageLabel = HOME_STATISTIC_OPTIONS.some((option) => option.label === label);
  if (!label || category === null || !rawNumericValue || !rawYear || (mode === 'homepage' && !validHomepageLabel) || !Number.isFinite(numericValue) || numericValue < 0 || numericValue > 1_000_000_000 || !Number.isInteger(year) || year < 1900 || year > new Date().getFullYear() + 1) redirect(`${errorPath}?error=Data statistik tidak valid`);
  const payload = { category: category || 'Umum', label, value: numericValue, year, updated_at: new Date().toISOString() };
  let targetId = id;
  if (!targetId) {
    const { data: existing } = await supabase
      .from('population_stats')
      .select('id')
      .eq('category', category || 'Umum')
      .eq('label', label)
      .eq('year', year)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    targetId = existing?.id || '';
  }
  const { error } = targetId
    ? await supabase.from('population_stats').update(payload).eq('id', targetId)
    : await supabase.from('population_stats').insert(payload);
  if (error) redirect(`${errorPath}?error=${encodeURIComponent(error.message)}`);
  revalidatePath('/'); revalidatePath('/statistik'); revalidatePath('/admin'); revalidatePath('/admin/statistik');
  redirect(`/admin/statistik?success=${mode === 'homepage' ? 'Ringkasan beranda berhasil diperbarui' : 'Data statistik berhasil disimpan'}`);
}

export async function saveVillageStatistics(formData: FormData) {
  const supabase = await requireAdmin();
  const rawYear = value(formData, 'year');
  const rawPopulation = value(formData, 'population');
  const rawHouseholds = value(formData, 'households');
  const rawHamlets = value(formData, 'hamlets');
  const rawArea = value(formData, 'area');
  const year = Number(rawYear);
  const population = Number(rawPopulation);
  const households = Number(rawHouseholds);
  const hamlets = Number(rawHamlets);
  const area = Number(rawArea);
  const rawPercentages = AGE_GROUP_OPTIONS.map((option) => value(formData, option.field));
  const percentages = rawPercentages.map(Number);
  const percentageTotal = percentages.reduce((sum, percentage) => sum + percentage, 0);
  const maximumYear = new Date().getFullYear() + 1;

  const invalidMainValues = !rawYear || !rawPopulation || !rawHouseholds || !rawHamlets || !rawArea
    || !Number.isInteger(year) || year < 1900 || year > maximumYear
    || !Number.isInteger(population) || population <= 0 || population > 1_000_000_000
    || !Number.isInteger(households) || households < 0 || households > population
    || !Number.isInteger(hamlets) || hamlets <= 0 || hamlets > 100_000
    || !Number.isFinite(area) || area <= 0 || area > 1_000_000_000;
  const invalidPercentages = rawPercentages.some((percentage) => percentage === '')
    || percentages.some((percentage) => !Number.isFinite(percentage) || percentage < 0 || percentage > 100)
    || Math.abs(percentageTotal - 100) > 0.01;

  if (invalidMainValues) redirect('/admin/statistik?error=Data utama belum lengkap atau nilainya tidak valid');
  if (invalidPercentages) redirect(`/admin/statistik?error=${encodeURIComponent('Total persentase kelompok usia harus tepat 100%')}`);

  const ageCounts = calculateAgeGroupCounts(population, percentages);
  const now = new Date().toISOString();
  const records: Array<{ category: string; label: string; value: number; year: number; updated_at: string }> = [
    { category: 'Ringkasan', label: HOME_STATISTIC_OPTIONS[0].label, value: population, year, updated_at: now },
    { category: 'Ringkasan', label: HOME_STATISTIC_OPTIONS[1].label, value: households, year, updated_at: now },
    { category: 'Ringkasan', label: HOME_STATISTIC_OPTIONS[2].label, value: hamlets, year, updated_at: now },
    { category: 'Ringkasan', label: HOME_STATISTIC_OPTIONS[3].label, value: area, year, updated_at: now },
    ...AGE_GROUP_OPTIONS.map((option, index) => ({ category: 'Kelompok Usia', label: option.label, value: ageCounts[index], year, updated_at: now })),
  ];

  const { data: existingRows, error: readError } = await supabase
    .from('population_stats')
    .select('id,label')
    .eq('year', year);
  if (readError) redirect(`/admin/statistik?error=${encodeURIComponent(readError.message)}`);

  const operations = records.map((record) => {
    const existing = existingRows?.find((row) => canonicalManagedStatisticLabel(row.label) === record.label);
    return existing
      ? supabase.from('population_stats').update(record).eq('id', existing.id)
      : supabase.from('population_stats').insert(record);
  });
  const results = await Promise.all(operations);
  const writeError = results.find((result) => result.error)?.error;
  if (writeError) redirect(`/admin/statistik?error=${encodeURIComponent(writeError.message)}`);

  revalidatePath('/'); revalidatePath('/statistik'); revalidatePath('/admin'); revalidatePath('/admin/statistik');
  redirect('/admin/statistik?success=Data utama dan kelompok usia berhasil diselaraskan');
}

export async function deleteStatistic(formData: FormData) {
  const supabase = await requireAdmin();
  const id = value(formData, 'id');
  if (!isUuid(id)) redirect('/admin/statistik?error=ID statistik tidak valid');
  const { error } = await supabase.from('population_stats').delete().eq('id', id);
  if (error) redirect(`/admin/statistik?error=${encodeURIComponent(error.message)}`);
  revalidatePath('/'); revalidatePath('/statistik'); revalidatePath('/admin'); revalidatePath('/admin/statistik');
}

export async function saveVillageHead(formData: FormData) {
  const supabase = await requireAdmin();
  const id = value(formData, 'id');
  if (id && !isUuid(id)) redirect('/admin/kepala-desa?error=ID kepala desa tidak valid');

  const errorPath = id ? `/admin/kepala-desa/${id}` : '/admin/kepala-desa';
  const name = limitedValue(formData, 'name', 120);
  const profile = limitedValue(formData, 'profile', 2000);
  const rawStartYear = value(formData, 'start_year');
  const rawEndYear = value(formData, 'end_year');
  const startYear = Number(rawStartYear);
  const endYear = Number(rawEndYear);
  const invalidPeriod = !rawStartYear || !rawEndYear || !Number.isInteger(startYear) || !Number.isInteger(endYear)
    || startYear < 1900 || endYear > 2100 || endYear < startYear;

  if (!name || profile === null || invalidPeriod) {
    redirect(`${errorPath}?error=${encodeURIComponent('Nama, periode, atau profil kepala desa tidak valid')}`);
  }

  const { data: existingHead } = id
    ? await supabase.from('village_heads').select('image_url').eq('id', id).maybeSingle()
    : { data: null };
  const upload = await uploadImage(supabase, formData, 'village-heads');
  if (upload.error) redirect(`${errorPath}?error=${encodeURIComponent(upload.error)}`);

  const imageUrl = upload.url || existingHead?.image_url;
  if (!imageUrl) redirect(`${errorPath}?error=${encodeURIComponent('Foto kepala desa wajib dipilih')}`);

  const payload = {
    name,
    start_year: startYear,
    end_year: endYear,
    profile: profile || '',
    image_url: imageUrl,
    is_published: formData.get('is_published') === 'on',
    is_current: formData.get('is_current') === 'on',
    updated_at: new Date().toISOString(),
  };
  const { error } = id
    ? await supabase.from('village_heads').update(payload).eq('id', id)
    : await supabase.from('village_heads').insert(payload);

  if (error) {
    if (upload.path) await supabase.storage.from(IMAGE_BUCKET).remove([upload.path]);
    redirect(`${errorPath}?error=${encodeURIComponent(error.message)}`);
  }
  if (upload.url && existingHead?.image_url) await removeImage(supabase, existingHead.image_url);

  revalidatePath('/profil'); revalidatePath('/admin'); revalidatePath('/admin/kepala-desa');
  redirect(`/admin/kepala-desa?success=${encodeURIComponent(id ? 'Profil kepala desa berhasil diperbarui' : 'Kepala desa berhasil ditambahkan')}`);
}

export async function deleteVillageHead(formData: FormData) {
  const supabase = await requireAdmin();
  const id = value(formData, 'id');
  if (!isUuid(id)) redirect('/admin/kepala-desa?error=ID kepala desa tidak valid');

  const { data: head } = await supabase.from('village_heads').select('image_url').eq('id', id).maybeSingle();
  const { error } = await supabase.from('village_heads').delete().eq('id', id);
  if (error) redirect(`/admin/kepala-desa?error=${encodeURIComponent(error.message)}`);
  await removeImage(supabase, head?.image_url);

  revalidatePath('/profil'); revalidatePath('/admin'); revalidatePath('/admin/kepala-desa');
}
