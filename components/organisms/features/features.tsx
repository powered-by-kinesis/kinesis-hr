'use client';
import { motion } from 'motion/react';
import { Brain, BarChart3, Workflow } from 'lucide-react';
import { FeatureCard } from '@/components/molecules/feature-card';
import { Container } from '@/components/atoms/container';

export function Features() {
  const features = [
    {
      title: 'Intelligent CV Analysis',
      description:
        'Get deep insights from every CV with AI-powered analysis. Our system provides detailed justification, identifies key strengths and weaknesses, and matches candidates to your exact requirements.',
      Icon: Brain,
    },
    {
      title: 'Smart Scoring & Ranking',
      description:
        'Receive comprehensive candidate scores with transparent reasoning. Our AI evaluates skills, experience, and culture fit, then ranks candidates to help you focus on top talent.',
      Icon: BarChart3,
    },
    {
      title: 'Streamlined Decision Making',
      description:
        'Make confident hiring decisions with actionable insights. Get clear recommendations, detailed analysis reports, and data-driven justifications for every candidate.',
      Icon: Workflow,
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center md:mb-16 mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Platform Features</h2>
          <p className="mt-4 md:text-lg text-base text-muted-foreground">
            Unlock a smarter, faster, and more effective hiring experience with our AI-powered
            tools.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-stretch">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} className="h-full" />
          ))}
        </div>
      </Container>
    </section>
  );
}
