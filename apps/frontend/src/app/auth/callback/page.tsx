'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleAuthCallback } from '@/lib/auth';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (!code) {
      setError('Code d\'authentification manquant');
      setTimeout(() => router.push('/'), 3000);
      return;
    }

    // Traiter le callback
    handleAuthCallback(code).then(result => {
      if (result.success) {
        // Authentification réussie → redirection vers l'accueil
        router.push('/');
      } else {
        // Erreur lors de l'authentification
        setError(result.error || 'Erreur d\'authentification inconnue');
        setTimeout(() => router.push('/?error=auth_failed'), 3000);
      }
    });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="text-4xl mb-4">⚜️</div>
        
        {error ? (
          <>
            <h2 className="text-2xl font-bold text-danger mb-2">Erreur d'authentification</h2>
            <p className="text-muted mb-4">{error}</p>
            <p className="text-sm text-muted">Redirection dans quelques instants...</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2">Authentification en cours</h2>
            <p className="text-muted">Veuillez patienter pendant que nous vérifions vos identifiants...</p>
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
