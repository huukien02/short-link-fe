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
  createdAt: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateLinkInput {
  targetUrl: string;
  customSlug?: string;
  expiresAt?: string;
  maxClicks?: number;
  password?: string;
}
