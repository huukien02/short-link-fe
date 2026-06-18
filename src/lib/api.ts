import { tokenStorage } from './auth-storage';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: { statusCode: number; message: string | string[]; error: string };
}

async function doRefresh(): Promise<boolean> {
  const refreshToken = tokenStorage.getRefresh();
  if (!refreshToken) return false;

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return false;

  const json = (await res.json()) as ApiEnvelope<{
    accessToken: string;
    refreshToken: string;
  }>;
  if (!json.data) return false;

  tokenStorage.set(json.data.accessToken, json.data.refreshToken);
  return true;
}

// Single-flight: nhiều request 401 đồng thời chỉ kích hoạt MỘT lần refresh.
// Backend xoay refresh token nên gọi refresh song song với cùng RT sẽ làm
// các lời gọi sau thất bại oan — gộp chung 1 promise để tránh.
let refreshPromise: Promise<boolean> | null = null;

function refreshTokens(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

/**
 * Gọi API backend. Tự đính JWT, tự bóc envelope {success,data},
 * tự refresh token 1 lần khi gặp 401.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const access = tokenStorage.getAccess();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (access) headers.Authorization = `Bearer ${access}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const json = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!res.ok) {
    // Thử refresh 1 lần rồi retry
    if (res.status === 401 && retry && (await refreshTokens())) {
      return apiFetch<T>(path, options, false);
    }
    // 401 không cứu được (không có hoặc hết refresh token) → dọn phiên, guard tự về /login.
    if (res.status === 401) tokenStorage.clear();
    const msg = json?.error?.message ?? 'Đã có lỗi xảy ra';
    throw new ApiError(Array.isArray(msg) ? msg.join(', ') : msg, res.status);
  }

  return json!.data as T;
}
