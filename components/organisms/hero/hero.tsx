'use client';

import { Button } from '@/components/ui/button';
import { AuroraText } from '@/components/magicui/aurora-text';
import { Container } from '@/components/atoms/container';

interface HeroProps {
  login: (callbackUrl: string) => void;
  isAuthLoading: boolean;
}

export function Hero({ login, isAuthLoading }: HeroProps) {
  return (
    <section
      id="home"
      className="relative md:min-h-[600px] h-[500px] flex items-center justify-center"
    >
      <Container className="text-center">
        <h1 className="flex flex-col space-y-4 md:text-6xl text-3xl  font-bold">
          <span>Revolutionize HR with</span>
          <AuroraText>AI Intelligence</AuroraText>
        </h1>

        <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your hiring with intelligent CV analysis. Get detailed candidate insights,
          comprehensive scoring with justification, key strengths and weaknesses analysis, and smart
          ranking to make confident hiring decisions faster.
        </p>

        <div className="mt-10 space-x-4">
          <Button
            disabled={isAuthLoading}
            onClick={() => login('/hiring')}
            className="px-6 cursor-pointer text-sm rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700"
          >
            Get Started
          </Button>
        </div>
      </Container>
    </section>
  );
}
