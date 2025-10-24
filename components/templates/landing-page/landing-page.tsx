'use client';

import { Video } from '@/components/atoms/video';
import { Hero } from '@/components/organisms/hero';
import { Navbar } from '@/components/organisms/navbar';
import { HowItWorks } from '@/components/organisms/how-it-works';
import { Features } from '@/components/organisms/features';
import { Footer } from '@/components/organisms/footer';
import { Loading } from '@/components/molecules/loading';

export function LandingPageTemplate() {
  // const { isAuthLoading, login } = useAuth();
  const isAuthLoading = false;
  const login = () => {
    window.location.href = process.env.NEXT_PUBLIC_APP_AUTH_URL ?? '#';
  }

  return (
    <main>
      {isAuthLoading && <Loading />}
      <div className="relative">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="w-full h-full
                       bg-[radial-gradient(ellipse_at_top_center,rgba(56,189,248,0.15),transparent_85%)]
                       dark:bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.15),transparent_50%)]"
          />
        </div>
        <Navbar login={login} isAuthLoading={isAuthLoading} />
        <Hero login={login} isAuthLoading={isAuthLoading} />
      </div>

      <div className="max-w-5xl mx-auto">
        <Video src="https://youtu.be/yPJR6dhhftk?si=CbVmcQQCMS9zQfiJ" thumbnail="/thumbnail.png" />
      </div>
      <HowItWorks />
      <Features />
      <Footer />
    </main>
  );
}
