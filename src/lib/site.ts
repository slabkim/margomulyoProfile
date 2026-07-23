export const SITE_URL = 'https://margomulyo.site';
export const SITE_NAME = 'Desa Margomulyo';
export const GOOGLE_SITE_VERIFICATION = 'k0PP79PN79ZBlcZpn3Q-WutCmFPItniT0s3Mt2n9B60';
export const SITE_DESCRIPTION =
  'Portal resmi Pemerintah Desa Margomulyo, Kecamatan Tegineneng, Kabupaten Pesawaran, Lampung. Temukan profil desa, layanan warga, data, berita, dan potensi desa.';

export const VILLAGE_LOCATION = {
  latitude: -5.154402370581577,
  longitude: 105.1494179157779,
  streetAddress: 'Jl. Simpang Masgar, Desa Margomulyo',
  addressLocality: 'Tegineneng',
  addressRegion: 'Lampung',
  postalCode: '35363',
  addressCountry: 'ID',
} as const;

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString();
}
