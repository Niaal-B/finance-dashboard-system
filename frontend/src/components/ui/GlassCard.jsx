import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const GlassCard = ({ children, className, animate = true, hover = true, onClick }) => {
  const Tag = animate ? motion.div : 'div';
  const motionProps = animate ? {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' },
    whileHover: hover ? { y: -2, transition: { duration: 0.2 } } : undefined,
  } : {};

  return (
    <Tag
      className={clsx('glass rounded-2xl', hover && 'glass-hover', onClick && 'cursor-pointer', className)}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Tag>
  );
};

export default GlassCard;
