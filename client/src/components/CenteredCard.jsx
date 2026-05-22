import { motion } from 'framer-motion';
import styles from './CenteredCard.module.css';

export default function CenteredCard({ children, className = '', hover = false }) {
  return (
    <motion.div
      className={`${styles.card} ${className}`}
      whileHover={
        hover
          ? {
              scale: 1.02,
              boxShadow:
                '0 20px 40px rgba(8, 145, 178, 0.2), 0 0 20px rgba(8, 145, 178, 0.1)',
            }
          : undefined
      }
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
