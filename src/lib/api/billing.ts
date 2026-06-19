import { apiFetch } from '../api';

/**
 * Bắt đầu mua gói (pro | business): BE tạo Checkout Session, trả URL hosted.
 * Caller tự redirect (`window.location.href = url`).
 */
export function createCheckout(plan: string) {
  return apiFetch<{ url: string }>('/billing/checkout', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  });
}

/** Mở Customer Portal (đổi gói / hủy / cập nhật thẻ) — trả URL hosted. */
export function openPortal() {
  return apiFetch<{ url: string }>('/billing/portal', { method: 'POST' });
}
