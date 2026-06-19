export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface Link {
  id: string;
  slug: string;
  targetUrl: string;
  shortUrl: string;
  clickCount: number;
  isActive: boolean;
  expiresAt: string | null;
  maxClicks: number | null;
  hasPassword: boolean;
  createdAt: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AnalyticsResult {
  slug: string;
  from: string;
  to: string;
  total: number;
  byDay: { date: string; count: number }[];
  byCountry: { country: string; count: number }[];
  byDevice: { device: string; count: number }[];
}

export interface CreateLinkInput {
  targetUrl: string;
  customSlug?: string;
  expiresAt?: string;
  maxClicks?: number;
  password?: string;
}

export interface UpdateLinkInput {
  targetUrl?: string;
  expiresAt?: string | null;
  maxClicks?: number | null;
  isActive?: boolean;
  password?: string;
}
