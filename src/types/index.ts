// TypeScript type definitions for the village website

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  category: string;
  is_published: boolean;
  event_at: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  album: string;
  description: string | null;
  created_at: string;
}

export interface Album {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface VillageProfile {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
}

export interface PopulationStat {
  id: string;
  category: string;
  label: string;
  value: number;
  year: number;
  updated_at: string;
}

export interface GovernmentMember {
  id: string;
  name: string;
  position: string;
  photo_url: string | null;
  order_index: number;
  created_at: string;
}

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

export interface CategoryIcon {
  icon: React.ReactNode;
  label: string;
  href: string;
  description: string;
}

export interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  icon?: React.ReactNode;
}
