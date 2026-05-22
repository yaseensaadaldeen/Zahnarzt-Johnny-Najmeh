import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedCard({ children, className = '', delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: 'easeOut', delay }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 20px 40px rgba(8, 145, 178, 0.2), 0 0 20px rgba(8, 145, 178, 0.1)'
      }}
      className={`bg-card rounded-2xl border border-border overflow-hidden transition-all ${className}`}
    >
      {children}
    </motion.div>
  );
}
