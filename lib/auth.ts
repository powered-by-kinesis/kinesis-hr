import { getServerSession } from 'next-auth';
import { signIn } from 'next-auth/react';

export async function requireAuth() {
  const session = await getServerSession();

  if (!session) {
    signIn('google', {
      callbackUrl: '/hiring',
      redirect: true,
    });
  }

  return session;
}
