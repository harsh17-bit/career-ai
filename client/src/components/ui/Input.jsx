import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  tone = 'dark',
  className = '',
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const isLight = tone === 'light';

  const labelClass = isLight
    ? focused
      ? 'text-blue-600'
      : 'text-slate-600'
    : focused
      ? 'text-apple-blue'
      : 'text-white/50';

  const iconClass = isLight
    ? focused
      ? 'text-blue-600'
      : 'text-slate-400'
    : focused
      ? 'text-apple-blue'
      : 'text-white/30';

  const inputToneClass = isLight
    ? '!bg-white !border-slate-200 !text-slate-900 !shadow-sm placeholder:!text-slate-400 focus:!border-blue-400 focus:!shadow-[0_0_0_4px_rgba(37,99,235,0.12)]'
    : '';

  const passwordButtonClass = isLight
    ? 'text-slate-400 hover:text-slate-600'
    : 'text-white/30 hover:text-white/60';

  const errorClass = isLight ? 'text-rose-500' : 'text-red-400';

  return (
    <div className={`relative ${className}`}>
      {label && (
        <motion.label
          className={`block text-sm font-medium mb-2 transition-colors duration-300 ${labelClass}`}
          animate={{
            color: isLight
              ? focused
                ? '#2563eb'
                : 'rgba(71,85,105,0.85)'
              : focused
                ? '#0071E3'
                : 'rgba(255,255,255,0.5)',
          }}
        >
          {label}
        </motion.label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${iconClass}`}
          />
        )}
        <input
          type={isPassword && showPassword ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`input-apple ${inputToneClass} ${Icon ? 'pl-12' : ''} ${isPassword ? 'pr-12' : ''} ${
            error
              ? isLight
                ? '!border-rose-400 focus:!border-rose-500 !shadow-[0_0_0_4px_rgba(244,63,94,0.12)]'
                : 'border-red-500/50 focus:border-red-500'
              : ''
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${passwordButtonClass}`}
          >
            {showPassword ? (
              <FiEyeOff className="w-5 h-5" />
            ) : (
              <FiEye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`${errorClass} text-sm mt-2`}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
