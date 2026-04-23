import { motion } from 'framer-motion';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-apple text-white/70 hover:text-white hover:bg-white/5',
  danger: 'btn-apple bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30',
};

const sizes = {
  sm: '!px-5 !py-2.5 !text-sm',
  md: '!px-8 !py-4 !text-base',
  lg: '!px-10 !py-5 !text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`${variants[variant]} ${sizes[size]} ${className} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } relative inline-flex items-center justify-center gap-2`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
}
