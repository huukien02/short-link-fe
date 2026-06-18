'use client';

import { useSyncExternalStore } from 'react';
import { tokenStorage } from './auth-storage';

export type AuthStatus = 'loading' | 'authed' | 'guest';

/**
 * Trạng thái đăng nhập an toàn với SSR/hydration.
 * - Server + lần render đầu khi hydrate: 'loading' → chưa quyết định gì.
 * - Sau hydrate: đọc localStorage thật → 'authed' | 'guest'.
 *
 * Việc tách 'loading' khỏi 'guest' là then chốt: guard chỉ redirect khi
 * CHẮC CHẮN 'guest', nên F5 không còn bị đá nhầm về /login khi token vẫn còn.
 * Dùng useSyncExternalStore thay cho setState-in-effect.
 */
export function useAuthStatus(): AuthStatus {
  return useSyncExternalStore<AuthStatus>(
    tokenStorage.subscribe,
    () => (tokenStorage.getAccess() ? 'authed' : 'guest'),
    () => 'loading',
  );
}
