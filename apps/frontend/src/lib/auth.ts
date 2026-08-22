import { loginDiscord, checkWorkerHealth } from './api';

const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '';
const REDIRECT_URI = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI || 'http://localhost:3000/auth/callback';

export function getDiscordAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'identify email',
  });
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

/**
 * Vérifie si le Worker est accessible avant de rediriger vers Discord
 */
export async function checkWorkerConnection(): Promise<{ ok: boolean; error?: string }> {
  try {
    const isHealthy = await checkWorkerHealth();
    if (!isHealthy) {
      return {
        ok: false,
        error: 'Le serveur ReLink est actuellement inaccessible. Veuillez réessayer dans quelques instants.',
      };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: 'Impossible de vérifier la connexion au serveur ReLink.',
    };
  }
}

/**
 * Traite le callback Discord : échange le code pour un token
 */
export async function handleAuthCallback(code: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Vérifier que le Worker est accessible
    const health = await checkWorkerConnection();
    if (!health.ok) {
      return { success: false, error: health.error };
    }

    // Envoyer le code au Worker
    const data = await loginDiscord(code, REDIRECT_URI);

    // Stocker le token et les données utilisateur
    localStorage.setItem('auth_token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data));

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur d\'authentification inconnue';
    return {
      success: false,
      error: message,
    };
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function getUser(): any {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
