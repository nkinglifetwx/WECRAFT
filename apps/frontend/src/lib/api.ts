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

/**
 * Vérifie si le Worker est accessible
 */
export async function checkWorkerHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${WORKER_URL}/flags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function loginDiscord(code: string, redirect_uri: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${WORKER_URL}/auth/discord`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirect_uri }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'authentification Discord');
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Impossible de se connecter au serveur ReLink');
  }
}

export async function getMe(): Promise<any> {
  return apiFetch('/me');
}

export async function getFlags(): Promise<{ sections: Record<string, boolean>; require_auth: boolean }> {
  return apiFetch('/flags');
}
