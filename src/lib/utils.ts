/**
 * Format a date string to Indonesian locale
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format a date string to short format (e.g., "7 Jun 2024")
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Format a number with thousand separators (Indonesian format)
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('id-ID');
}

/**
 * Supabase public images are served directly when the local DNS uses NAT64.
 * Next Image rejects NAT64 addresses as private upstream IPs during optimization.
 */
export function isSupabaseStorageUrl(url: string | null | undefined): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  return Boolean(url && supabaseUrl && url.startsWith(`${supabaseUrl}/storage/v1/object/public/`));
}

/**
 * Get relative time string (e.g., "2 hari yang lalu")
 */
export function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hari ini';
  if (diffDays === 1) return 'Kemarin';
  if (diffDays < 7) return `${diffDays} hari yang lalu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu yang lalu`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan yang lalu`;
  return `${Math.floor(diffDays / 365)} tahun yang lalu`;
}

/**
 * Create excerpt from HTML content
 */
export function createExcerpt(html: string, maxLength: number = 160): string {
  const text = html.replace(/<[^>]*>/g, '');
  return truncateText(text, maxLength);
}
