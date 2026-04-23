import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hover = true,
  glow = false,
  gradient = false,
  onClick,
  ...props
}) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`card-apple ${className} ${glow ? 'hover:shadow-lg hover:shadow-blue-500/10' : ''} ${
        gradient ? 'gradient-border' : ''
      } ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}
