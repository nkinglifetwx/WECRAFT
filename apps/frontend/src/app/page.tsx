'use client';

import { useEffect, useState } from 'react';
import { getUser, isAuthenticated, getDiscordAuthUrl, checkWorkerConnection } from '@/lib/auth';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [workerError, setWorkerError] = useState<string | null>(null);
  const [checkingWorker, setCheckingWorker] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getUser());
    }
    setLoading(false);
  }, []);

  const handleLoginClick = async () => {
    setCheckingWorker(true);
    setWorkerError(null);
    const health = await checkWorkerConnection();
    setCheckingWorker(false);

    if (!health.ok) {
      setWorkerError(health.error || 'Erreur de connexion');
      return;
    }

    // Rediriger vers Discord
    window.location.href = getDiscordAuthUrl();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚜️</div>
          <p className="text-muted">Chargement...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Bienvenue, {user.pseudo}!</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Informations</h2>
              <div className="space-y-3 text-muted">
                <div>
                  <span className="text-sm">Discord ID</span>
                  <p className="font-mono text-sm mt-1">{user.discord_id}</p>
                </div>
                <div>
                  <span className="text-sm">Email</span>
                  <p className="text-sm mt-1">{user.email || 'Non fourni'}</p>
                </div>
                {user.minecraft_username && (
                  <div>
                    <span className="text-sm">Minecraft</span>
                    <p className="text-sm mt-1 text-success">✓ {user.minecraft_username}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm">Éclats</span>
                  <p className="text-accent font-bold text-lg mt-1">💎 {user.eclats || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Navigation</h2>
              <ul className="space-y-2 text-muted">
                <li><a href="/server" className="hover:text-accent transition">📊 Info Serveur</a></li>
                <li><a href="/clans" className="hover:text-accent transition">⚔️ Clans</a></li>
                <li><a href="/team" className="hover:text-accent transition">👥 Mon Équipe</a></li>
                <li><a href="/rewards" className="hover:text-accent transition">💎 Récompenses</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-bg to-card">
      <div className="text-center max-w-2xl px-6">
        <div className="text-6xl mb-6">⚜️</div>
        <h1 className="text-4xl font-bold mb-4">WECRAFT</h1>
        <p className="text-xl text-muted mb-2">Le wiki-streaming de nos aventures</p>
        <p className="text-muted mb-8">
          Un espace unique qui recense partenaires, aventures et events, pensé façon Netflix — 
          placé sous le signe du phénix, symbole d'élévation et d'ambition.
        </p>

        {workerError && (
          <div className="bg-danger-bg border border-danger rounded-lg p-4 mb-6 text-danger">
            <p className="text-sm">⚠️ {workerError}</p>
          </div>
        )}

        <button
          onClick={handleLoginClick}
          disabled={checkingWorker}
          className="inline-block px-8 py-3 bg-accent text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {checkingWorker ? 'Vérification en cours...' : 'Se connecter avec Discord'}
        </button>

        <p className="text-muted text-sm mt-6">
          Connexion sécurisée via Discord OAuth2
        </p>
      </div>
    </div>
  );
}
