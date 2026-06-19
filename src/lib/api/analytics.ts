import { apiFetch } from '../api';
import { AnalyticsResult } from '../types';

/** Lấy thống kê 1 link theo slug. Khoảng thời gian tùy chọn (mặc định 30 ngày). */
export function getAnalytics(
  slug: string,
  range?: { from?: string; to?: string },
) {
  const qs = new URLSearchParams();
  if (range?.from) qs.set('from', range.from);
  if (range?.to) qs.set('to', range.to);
  const q = qs.toString();
  return apiFetch<AnalyticsResult>(`/analytics/${slug}${q ? `?${q}` : ''}`);
}
