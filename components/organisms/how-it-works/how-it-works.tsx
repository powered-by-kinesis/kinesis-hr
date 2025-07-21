'use client';
import { motion } from 'motion/react';
import {
  FileText,
  Users,
  BotMessageSquare,
  ClipboardCheck,
  HelpCircle,
  CheckCircle2,
  X,
  LucideIcon,
} from 'lucide-react';
import { Container } from '@/components/atoms/container';
// import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useEffect, useState } from 'react';

interface ImageCarouselProps {
  sources: string[];
  title: string;
}

interface SingleImageProps {
  source: string;
  title: string;
}

const SingleImage = ({ source, title }: SingleImageProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="relative">
      <Image
        src={source}
        alt={title}
        width={800}
        height={800}
        className="rounded-lg shadow-blue-500 shadow-lg w-full h-auto cursor-pointer transition-transform hover:scale-[1.02]"
        onClick={() => setIsFullscreen(true)}
        priority
      />
      <ShowFullScreenImage
        title={title}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        sources={[source]}
      />
    </div>
  );
};

const ShowFullScreenImage = ({
  title,
  isFullscreen,
  setIsFullscreen,
  sources,
}: {
  title: string;
  isFullscreen: boolean;
  setIsFullscreen: (isFullscreen: boolean) => void;
  sources: string[];
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handlePrevious = () => {
    if (api) {
      api.scrollPrev();
    }
  };

  const handleNext = () => {
    if (api) {
      api.scrollNext();
    }
  };

  if (!isFullscreen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      <button
        onClick={() => setIsFullscreen(false)}
        className="absolute top-4 right-4 z-[9999] p-2 rounded-full bg-primary hover:bg-primary/80 cursor-pointer transition-colors"
      >
        <X className="h-8 w-8 text-white" />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white z-[9999] bg-primary rounded-4xl w-fit mx-auto py-2 px-4 mt-4">
        Image {current} of {count}
      </div>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-[9999]">
        <button
          onClick={handlePrevious}
          className="p-2 rounded-full bg-primary hover:bg-primary/80 cursor-pointer transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8 text-white"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-[9999]">
        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-primary hover:bg-primary/80 cursor-pointer transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8 text-white"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
      <Carousel className="w-screen h-screen" setApi={setApi}>
        <CarouselContent className="h-full">
          {sources.map((source, index) => (
            <CarouselItem key={index} className="h-full flex items-center justify-center p-0">
              <div className="relative w-screen h-screen flex items-center justify-center">
                <Image
                  src={source}
                  alt={`${title} - ${index + 1}`}
                  fill
                  className="object-contain"
                  priority
                  quality={100}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

const ImageCarousel = ({ sources, title }: ImageCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleImageClick = () => {
    setIsFullscreen(true);
  };

  return (
    <div className="w-full rounded-lg">
      <Carousel
        className="w-full rounded-lg shadow-blue-500 shadow-lg h-auto cursor-pointer transition-transform hover:scale-[1.02]"
        setApi={setApi}
      >
        <CarouselContent>
          {sources.map((source, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-[16/9]">
                <Image
                  src={source}
                  alt={`${title} - ${index + 1}`}
                  fill
                  className="rounded-lg object-contain"
                  onClick={handleImageClick}
                  priority
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="py-1 sm:py-2 text-center text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-4">
        Image {current} of {count}
      </div>
      <ShowFullScreenImage
        title={title}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        sources={sources}
      />
    </div>
  );
};

// interface VideoProps {
//   url: string;
//   className?: string;
// }

// const Video = ({ url, className }: VideoProps) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const videoRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         setIsVisible(entry.isIntersecting);
//       },
//       {
//         threshold: 0.5,
//       }
//     );

//     if (videoRef.current) {
//       observer.observe(videoRef.current);
//     }

//     return () => {
//       if (videoRef.current) {
//         observer.unobserve(videoRef.current);
//       }
//     };
//   }, []);

//   return (
//     <div ref={videoRef} className={`relative w-full aspect-video rounded-lg overflow-hidden shadow-lg ${className}`}>
//       <iframe
//         src={`${url}${isVisible ? '&autoplay=1' : ''}&loop=1&muted=1&controls=0`}
//         className="absolute inset-0 w-full h-full"
//         allow="autoplay; encrypted-media"
//         allowFullScreen
//       />
//     </div>
//   );
// };

interface HowItWorksStep {
  icon: LucideIcon;
  title: string;
  description: string;
  position: 'left' | 'right';
  features?: string[];
  bgAccent: string;
  sources?: string[];
}

export function HowItWorks() {
  const steps: HowItWorksStep[] = [
    {
      icon: FileText,
      title: 'Create and Customize Job Listings',
      description:
        'Effortlessly create detailed job listings with our intuitive interface. Define comprehensive job descriptions, competitive salary packages, employment terms, and more all with professional precision. Publish instantly or save drafts for team review.',
      position: 'left',
      features: [],
      bgAccent: 'from-blue-500 to-blue-600',
      sources: ['/job-post-2.png', '/job-post-1.png', '/job-post-3.png'],
    },
    {
      icon: Users,
      title: 'Streamline Candidate Management',
      description:
        'Take control of your recruitment pipeline with our powerful candidate management system. Access detailed profiles, track application status, and make data-driven decisions through our sophisticated yet user-friendly interface.',
      position: 'right',
      features: [],
      bgAccent: 'from-blue-500 to-blue-600',
      sources: [
        '/manage-candidate-1.png',
        '/manage-candidate-2.png',
        '/manage-candidate-3.png',
        '/manage-candidate-4.png',
      ],
    },
    {
      icon: BotMessageSquare,
      title: 'AI-Powered Interviews',
      description:
        'Transform your screening process with our cutting-edge AI interviewer. Conduct consistent, unbiased initial interviews 24/7, while gaining valuable insights into candidate qualifications and potential.',
      position: 'left',
      features: [],
      bgAccent: 'from-blue-500 to-blue-600',
      sources: [
        '/ai-interview-1.png',
        '/ai-interview-2.png',
        '/ai-interview-3.png',
        '/ai-interview-4.png',
        '/ai-interview-5.png',
        '/ai-interview-6.png',
        '/ai-interview-7.png',
        '/ai-interview-8.png',
        '/ai-interview-9.png',
        '/ai-interview-10.png',
      ],
    },
    {
      icon: ClipboardCheck,
      title: 'Seamless Application Process',
      description:
        'Provide candidates with a modern, friction-free application experience. Our streamlined process ensures higher completion rates while capturing all essential information for informed hiring decisions.',
      position: 'right',
      features: [],
      bgAccent: 'from-blue-500 to-blue-600',
      sources: ['/candidate-application-1.png', '/candidate-application-2.png'],
    },
    {
      icon: HelpCircle,
      title: 'Support AI Assistant',
      description:
        'Our AI assistant is available 24/7 to answer questions, provide information, and assist with any recruitment needs. It can handle routine inquiries, schedule interviews, and provide updates on candidate status.',
      position: 'left',
      features: [],
      bgAccent: 'from-blue-500 to-blue-600',
      sources: ['/ai-chat-bot.png'],
    },
  ];

  return (
    <section id="how-it-works" className="py-8 sm:py-12 md:py-16 lg:py-32 overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-16 md:mb-24 lg:mb-32"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Transform Your Hiring Process
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-xl max-w-3xl mx-auto leading-relaxed px-4 sm:px-6">
            Experience the future of recruitment with our AI-powered platform. We combine
            cutting-edge technology with intuitive design to deliver a recruitment solution that
            saves time, reduces costs, and helps you identify top talent with unprecedented
            efficiency.
          </p>
        </motion.div>

        {/* Mobile Version */}
        <div className="md:hidden relative">
          <div className="absolute left-4 sm:left-8 top-0 w-[2px] h-full bg-gradient-to-b from-primary/10 via-primary/20 to-primary/10" />

          <div className="space-y-8 sm:space-y-12">
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
                className="relative pl-12 sm:pl-16 pr-2 sm:pr-4"
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
                  className={`absolute left-[0.10rem] sm:left-[0.8rem] top-0 w-8 sm:w-10 h-8 sm:h-10 rounded-full 
                    bg-gradient-to-br ${step.bgAccent}
                    flex items-center justify-center shadow-lg
                    hover:scale-110 transition-all duration-300 z-10`}
                >
                  {step.icon && <step.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
                </motion.div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 + 0.3 }}
                  className="space-y-3"
                >
                  <h3 className="font-bold text-lg sm:text-xl">{step.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {/* Image */}
                  <div className="mt-4">
                    {step.sources && (
                      <>
                        {step.sources.length > 1 ? (
                          <ImageCarousel sources={step.sources} title={step.title} />
                        ) : (
                          <SingleImage source={step.sources[0]} title={step.title} />
                        )}
                      </>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2">
                    {step.features?.map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 + 0.4 + i * 0.1 }}
                        className="flex items-center gap-2 text-muted-foreground"
                      >
                        <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{feature}</span>
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
            className="absolute left-4 sm:left-8 top-0 w-[2px] bg-gradient-to-b from-primary via-primary to-primary/50"
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
                className={`flex items-center gap-20 ${step.position === 'left' ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Content Box */}
                <div
                  className={`w-[calc(50%-4rem)] ${step.position === 'left' ? 'text-right' : 'text-left'}`}
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
                      {step.features?.map((feature, i) => (
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
                          <CheckCircle2 className="md:w-5 md:h-5 w-4 h-4 flex-shrink-0" />
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
                    <step.icon className="text-white w-6 h-6 md:w-8 md:h-8" />
                  </motion.div>
                </div>

                <div className="w-[calc(50%-4rem)]">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.3 + 0.3 }}
                  >
                    {step.sources && (
                      <>
                        {step.sources.length > 1 ? (
                          <ImageCarousel sources={step.sources} title={step.title} />
                        ) : (
                          <SingleImage source={step.sources[0]} title={step.title} />
                        )}
                      </>
                    )}
                  </motion.div>
                </div>
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
