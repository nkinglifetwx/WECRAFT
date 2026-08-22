'use client';

import { useEffect, useState } from 'react';
import { getUser, isAuthenticated } from '@/lib/auth';
import { getDiscordAuthUrl } from '@/lib/auth';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getUser());
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-bg to-card">
        <div className="text-center max-w-2xl px-6">
          <div className="text-6xl mb-6">⚜️</div>
          <h1 className="text-4xl font-bold mb-4">WECRAFT</h1>
          <p className="text-xl text-muted mb-8">Le wiki-streaming de nos aventures</p>
          <a
            href={getDiscordAuthUrl()}
            className="inline-block px-8 py-3 bg-accent text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            Se connecter avec Discord
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Bienvenue, {user.pseudo}!</h1>
        <p className="text-muted">Connecté en tant que {user.discord_id}</p>
      </div>
    </div>
  );
}
