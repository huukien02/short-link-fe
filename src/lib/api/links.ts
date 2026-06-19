import { API_URL, apiFetch, ApiError } from '../api';
import { tokenStorage } from '../auth-storage';
import { CreateLinkInput, Link, Paginated, UpdateLinkInput } from '../types';

export function listLinks(page = 1, limit = 20) {
  return apiFetch<Paginated<Link>>(`/links?page=${page}&limit=${limit}`);
}

export function createLink(input: CreateLinkInput) {
  return apiFetch<Link>('/links', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateLink(id: string, input: UpdateLinkInput) {
  return apiFetch<Link>(`/links/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteLink(id: string) {
  return apiFetch<{ id: string }>(`/links/${id}`, { method: 'DELETE' });
}

/**
 * Tải QR code của link về dạng Blob (endpoint cần JWT nên không dùng <img src>
 * trực tiếp được). Caller tự tạo object URL để hiển thị / tải xuống.
 */
export async function fetchLinkQr(
  id: string,
  format: 'png' | 'svg' = 'png',
): Promise<Blob> {
  const res = await fetch(`${API_URL}/links/${id}/qr?format=${format}`, {
    headers: { Authorization: `Bearer ${tokenStorage.getAccess() ?? ''}` },
  });
  if (!res.ok) throw new ApiError('Không tạo được QR', res.status);
  return res.blob();
}

/**
 * Mở khóa link có mật khẩu (endpoint công khai, không cần đăng nhập).
 * Dùng fetch thuần thay vì apiFetch để tránh logic refresh/clear token
 * (sai mật khẩu trả 401 nhưng KHÔNG phải lỗi phiên đăng nhập).
 */
export async function unlockLink(
  slug: string,
  password: string,
): Promise<{ targetUrl: string }> {
  const res = await fetch(`${API_URL}/r/${slug}/unlock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const json = (await res.json().catch(() => null)) as {
    success: boolean;
    data?: { targetUrl: string };
    error?: { message: string | string[] };
  } | null;

  if (!res.ok || !json?.data) {
    const msg = json?.error?.message ?? 'Mở khóa thất bại';
    throw new ApiError(Array.isArray(msg) ? msg.join(', ') : msg, res.status);
  }
  return json.data;
}
