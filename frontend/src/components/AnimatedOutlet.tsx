import { useLocation, useOutlet } from 'react-router';
import { AnimatePresence } from 'motion/react';
import PageWrapper from './PageWrapper';

/**
 * Drop-in replacement for <Outlet /> that animates page transitions.
 *
 * Uses AnimatePresence to detect when the outlet content changes (keyed by
 * location.pathname) and plays exit/enter animations via PageWrapper.
 *
 * Usage: Replace <Outlet /> with <AnimatedOutlet /> in any layout component.
 */
export default function AnimatedOutlet() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <AnimatePresence mode="wait">
      <PageWrapper key={location.pathname}>
        {outlet}
      </PageWrapper>
    </AnimatePresence>
  );
}
