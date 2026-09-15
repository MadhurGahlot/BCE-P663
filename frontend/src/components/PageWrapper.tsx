import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
}

/**
 * Wraps page content with smooth enter/exit animations.
 *
 * - initial: faded out + shifted 12px down
 * - animate: fully visible at natural position
 * - exit:    faded out + shifted 8px up
 *
 * Duration is kept at 0.3s for a fast, production-ready feel.
 */
export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
}
