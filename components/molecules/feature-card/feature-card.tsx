import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  index: number;
  className?: string;
}

export function FeatureCard({ title, description, Icon, index, className }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
    >
      <Card
        className={cn(
          'border border-border/50 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 bg-background/50 backdrop-blur-sm',
          className,
        )}
      >
        <CardContent className="pt-8 pb-6 px-6 text-center">
          <motion.div className="mb-6 flex justify-center" whileHover={{ scale: 1.1 }}>
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
              <Icon className="h-8 w-8 " />
            </div>
          </motion.div>
          <h3 className="md:text-xl text-lg font-semibold mb-3 ">{title}</h3>
          <p className="text-muted-foreground leading-relaxed text-start">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
