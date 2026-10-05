'use client';

import { useEffect } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginGooglePage() {
  useEffect(() => {
    // Automatically trigger Google sign-in when this page loads
    signIn('google', { callbackUrl: '/' });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-main)] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-accent-400/30 border-t-accent-400 rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-[var(--color-text-muted)] text-sm">Redirigiendo al inicio de sesión con Google...</p>
      </div>
    </div>
  );
}
