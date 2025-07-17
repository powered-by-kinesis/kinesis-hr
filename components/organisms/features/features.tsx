'use client';
import { motion } from 'motion/react';
import { FileText, Users, BotMessageSquare } from 'lucide-react';
import { FeatureCard } from '@/components/molecules/feature-card';
import { Container } from '@/components/atoms/container';

export function Features() {
  const features = [
    {
      title: 'Smart Job Template Builder',
      description:
        'Utilize pre-built templates and AI-powered suggestions to create compelling job posts. Our intelligent system helps you craft competitive packages and optimize job descriptions to attract top talent.',
      Icon: FileText,
    },
    {
      title: 'Advanced Applicant Tracking',
      description:
        'Keep your hiring organized with our comprehensive tracking system. Monitor candidate progress, set automated reminders, and collaborate with your team through our centralized recruitment dashboard.',
      Icon: Users,
    },
    {
      title: 'Intelligent Interview Engine',
      description:
        'Powered by advanced AI technology that adapts questions based on candidate responses. Features natural language processing, real-time evaluation, and detailed post-interview analytics.',
      Icon: BotMessageSquare,
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
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Powerful Features That Drive Results
          </h2>
          <p className="mt-4 md:text-lg text-base text-muted-foreground">
            Our comprehensive suite of recruitment tools combines AI innovation with practical
            functionality to streamline every aspect of your hiring process.
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
