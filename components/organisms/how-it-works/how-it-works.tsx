'use client';
import { motion } from 'motion/react';
import { Upload, BotMessageSquare, Settings2, Trophy, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/atoms/container';

export function HowItWorks() {
  const steps = [
    {
      icon: <Settings2 className="w-6 h-6 md:w-8 md:h-8 " />,
      title: 'Set Up Your Assistant',
      description:
        'Begin by configuring your assistant with your job requirements and preferred language. Tailor the process to fit your unique needs.',
      position: 'left',
      features: ['Custom job description', 'Local language support'],
      bgAccent: 'from-blue-500 to-blue-600',
    },
    {
      icon: <Upload className="w-6 h-6 md:w-8 md:h-8 " />,
      title: 'Upload CV',
      description:
        'Upload candidate CVs in seconds. Our AI instantly analyzes PDF and DOC files, giving you rapid insights to accelerate your screening.',
      position: 'right',
      features: ['Supports multiple file formats', 'Instant, automated analysis'],
      bgAccent: 'from-blue-500 to-blue-600',
    },
    {
      icon: <Trophy className="w-6 h-6 md:w-8 md:h-8 " />,
      title: 'AI Analysis & Ranking',
      description:
        'Get comprehensive candidate insights with AI-powered analysis. Our system evaluates each CV with detailed justification, identifies key strengths and weaknesses, then provides accurate scoring and ranking to help you make confident hiring decisions.',
      position: 'left',
      features: [
        'Detailed AI justification',
        'Key strengths & weaknesses analysis',
        'Smart scoring & ranking',
      ],
      bgAccent: 'from-blue-500 to-blue-600',
    },
    {
      icon: <BotMessageSquare className="w-6 h-6 md:w-8 md:h-8 " />,
      title: 'Chat with your assistant',
      description:
        'Interact with your AI assistant to get personalized candidate recommendations and make confident hiring decisions.',
      position: 'right',
      features: ['Interactive chat', 'Tailored candidate suggestions'],
      bgAccent: 'from-blue-500 to-blue-600',
    },
  ];

  return (
    <section id="how-it-works" className=" py-16 md:py-32 overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center md:mb-32 mb-8"
        >
          <h2 className="md:text-4xl text-3xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-muted-foreground md:text-xl text-base max-w-3xl mx-auto leading-relaxed">
            Discover a smarter, faster way to hire. Our AI-driven platform streamlines every stage
            of recruitment making your hiring process simpler, quicker, and more effective.
          </p>
        </motion.div>

        {/* Mobile Version */}
        <div className="md:hidden relative">
          <div className="absolute left-8 top-0 w-[2px] h-full bg-gradient-to-b from-primary/10 via-primary/20 to-primary/10" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.2,
                  duration: 0.5,
                  type: 'spring',
                  stiffness: 100,
                }}
                className="relative pl-16 pr-4"
              >
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: index * 0.2 + 0.2,
                    type: 'spring',
                    stiffness: 200,
                  }}
                  className={`absolute left-[0.8rem] top-0 w-10 h-10 rounded-full 
                    bg-gradient-to-br ${step.bgAccent}
                    flex items-center justify-center shadow-lg
                    hover:scale-110 transition-all duration-300 z-10`}
                >
                  {step.icon}
                </motion.div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 + 0.3 }}
                  className="space-y-3"
                >
                  <h3 className="font-bold text-xl">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {step.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 + 0.4 + i * 0.1 }}
                        className="flex items-center gap-2 text-muted-foreground"
                      >
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Progress Line */}
          <motion.div
            initial={{ height: '0%' }}
            animate={{ height: '100%' }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute left-8 top-0 w-[2px] bg-gradient-to-b from-primary via-primary to-primary/50"
          />
        </div>

        <div className="hidden md:block relative min-h-[900px]">
          {/* Background Elements */}
          <div className="absolute inset-0 grid grid-cols-2 gap-32 opacity-5">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="h-px bg-primary"
              />
            ))}
          </div>

          {/* Central Line */}
          <div className="absolute left-1/2 top-0 w-1 h-full bg-gradient-to-b from-primary/10 via-primary/20 to-primary/10 -translate-x-1/2 rounded-full" />

          <div className="relative space-y-40">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  x: step.position === 'left' ? -100 : 100,
                }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.3,
                  duration: 0.8,
                  type: 'spring',
                  stiffness: 100,
                }}
                className={`flex items-center gap-20 ${
                  step.position === 'left' ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Content Box */}
                <div
                  className={`w-[calc(50%-4rem)] ${
                    step.position === 'left' ? 'text-right' : 'text-left'
                  }`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.3 + 0.2 }}
                    className="space-y-6"
                  >
                    <h3 className="font-bold md:text-3xl text-lg">{step.title}</h3>
                    <p className="text-muted-foreground md:text-lg text-base leading-relaxed">
                      {step.description}
                    </p>

                    {/* Feature List */}
                    <ul
                      className={`space-y-3 text-sm ${step.position === 'left' ? 'ml-auto' : ''}`}
                    >
                      {step.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          initial={{
                            opacity: 0,
                            x: step.position === 'left' ? 20 : -20,
                          }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.3 + 0.4 + i * 0.1 }}
                          className="flex items-center gap-2 text-muted-foreground"
                        >
                          <CheckCircle2 className="md:w-5 md:h-5 w-4 h-4  flex-shrink-0" />
                          <span className="md:text-sm text-xs">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Center Icon */}
                <div className="relative">
                  {/* Connecting Line */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.3 + 0.2 }}
                    className={`absolute top-1/2 -translate-y-1/2 w-20 h-1 
                      bg-gradient-to-r ${
                        step.position === 'left'
                          ? 'from-primary to-transparent -right-20'
                          : 'from-transparent to-primary -left-20'
                      }`}
                  />

                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: index * 0.3 + 0.3,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.bgAccent}
                      flex items-center justify-center shadow-xl relative z-10
                      hover:shadow-2xl hover:scale-110 transition-all duration-300
                      hover:rotate-6`}
                    style={{
                      boxShadow: `0 20px 40px -10px ${
                        step.bgAccent.includes('blue')
                          ? 'rgba(59, 130, 246, 0.3)'
                          : step.bgAccent.includes('purple')
                            ? 'rgba(147, 51, 234, 0.3)'
                            : step.bgAccent.includes('green')
                              ? 'rgba(34, 197, 94, 0.3)'
                              : 'rgba(249, 115, 22, 0.3)'
                      }`,
                    }}
                  >
                    {step.icon}
                  </motion.div>
                </div>

                <div className="w-[calc(50%-4rem)]" />
              </motion.div>
            ))}
          </div>

          {/* Progress Line */}
          <motion.div
            initial={{ height: '0%' }}
            animate={{ height: '100%' }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute left-1/2 top-0 w-1 bg-gradient-to-b from-primary via-primary to-primary/50 
              -translate-x-1/2 rounded-full"
          />
        </div>
      </Container>
    </section>
  );
}
