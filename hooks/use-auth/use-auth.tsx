import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export function useAuth() {
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const login = async () => {
    try {
      setIsAuthLoading(true);
      setError(null);
      await signIn('google', { callbackUrl: '/chat' });
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsAuthLoading(true);
      setError(null);
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Logout failed');
    } finally {
      setIsAuthLoading(false);
    }
  };

  return {
    isAuthLoading,
    error,
    session,
    login,
    logout,
    isAuthenticated: !!session,
  };
}
