import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export function useAuth() {
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  const login = async (callbackUrl: string) => {
    try {
      setIsAuthLoading(true);
      setError(null);
      await signIn('google', { callbackUrl });
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
    isAuthenticated: status === 'authenticated',
  };
}
