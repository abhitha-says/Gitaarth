import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { useTier } from './tier';

/**
 * Makes the still tier (reduced motion, or ?tier=still) hold for everything:
 * framer animations through MotionConfig, CSS loops through html[data-tier].
 */
export default function TierMotion({ children }) {
  const tier = useTier();
  useEffect(() => { document.documentElement.dataset.tier = tier; }, [tier]);
  return <MotionConfig reducedMotion={tier === 'still' ? 'always' : 'user'}>{children}</MotionConfig>;
}
