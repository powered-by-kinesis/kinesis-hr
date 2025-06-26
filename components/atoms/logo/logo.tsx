'use client';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface LogoProps {
  width?: number;
  height?: number;
  logoClassName?: string;
  textClassName?: string;
  className?: string;
}

export function Logo({
  width = 8,
  height = 8,
  logoClassName,
  textClassName,
  className,
}: LogoProps) {
  const router = useRouter();
  return (
    <motion.div
      className={cn('flex items-center gap-3 cursor-pointer', className)}
      onClick={() => router.push('/')}
    >
      <motion.div
        className={cn(`relative w-${width} h-${height}`, logoClassName)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute inset-0  rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full relative">
          <path d="M12 3l8 4v10l-8 4-8-4V7l8-4z" className="text-blue-500/10" fill="currentColor" />

          <motion.path
            d="M12 3v18M4 7l16 10M20 7L4 17"
            className="text-blue-500"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinecap="round"
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {[
            { cx: 12, cy: 3, color: 'text-cyan-500' },
            { cx: 12, cy: 21, color: 'text-blue-500' },
            { cx: 4, cy: 7, color: 'text-blue-400' },
            { cx: 20, cy: 7, color: 'text-blue-400' },
            { cx: 4, cy: 17, color: 'text-blue-600' },
            { cx: 20, cy: 17, color: 'text-blue-600' },
          ].map((dot, i) => (
            <motion.circle
              key={i}
              cx={dot.cx}
              cy={dot.cy}
              r="1.5"
              className={dot.color}
              fill="currentColor"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </svg>
      </motion.div>

      <motion.div
        className={cn('font-bold text-base flex items-center cursor-pointer', textClassName)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span>Kinesis</span>
        <span className="text-blue-500">HR</span>
      </motion.div>
    </motion.div>
  );
}
