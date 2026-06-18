import { apiFetch } from '../api';
import { CreateLinkInput, Link, Paginated } from '../types';

export function listLinks(page = 1, limit = 20) {
  return apiFetch<Paginated<Link>>(`/links?page=${page}&limit=${limit}`);
}

export function createLink(input: CreateLinkInput) {
  return apiFetch<Link>('/links', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function deleteLink(id: string) {
  return apiFetch<{ id: string }>(`/links/${id}`, { method: 'DELETE' });
}
