import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

/** Content that settles into place as it scrolls into view, once. */
export default function Reveal({ as = 'div', delay = 0, y = 28, duration = 0.95, className, children, ...rest }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
