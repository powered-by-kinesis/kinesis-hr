'use client';

import { signIn, useSession } from 'next-auth/react';
import { Loading } from '@/components/molecules/loading';

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { status } = useSession();

  return (
    <>
      {status === 'loading' && <Loading />}
      {status === 'unauthenticated' && signIn('google', { callbackUrl: '/chat' })}
      {status === 'authenticated' && children}
    </>
  );
}
