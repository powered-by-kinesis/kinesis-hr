import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: async () => true, // We'll handle the actual auth check in the routes
  },
});

export const config = {
  matcher: [
    '/chat/:path*',
    '/hiring/:path*',
    '/candidates/:path*',
    '/ai-interviewer/:path*',
    '/home/:path*',
  ],
};
