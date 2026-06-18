import { apiFetch } from '../api';
import { tokenStorage } from '../auth-storage';
import { AuthUser } from '../types';

export function getMe() {
  return apiFetch<AuthUser>('/auth/me');
}

export async function logout() {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } finally {
    tokenStorage.clear();
  }
}
