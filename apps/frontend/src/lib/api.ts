import type { AuthResponse } from '@/types/api';

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:8787';

function getAuthHeader(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers as Record<string, string> || {}),
  };

  const response = await fetch(`${WORKER_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

export async function loginDiscord(code: string, redirect_uri: string): Promise<AuthResponse> {
  return apiFetch('/auth/discord', {
    method: 'POST',
    body: JSON.stringify({ code, redirect_uri }),
  });
}

export async function getMe(): Promise<any> {
  return apiFetch('/me');
}
