export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-white/10 text-white/70 border-white/10',
    blue: 'bg-apple-blue/20 text-blue-400 border-apple-blue/30',
    purple: 'bg-apple-purple/20 text-purple-400 border-apple-purple/30',
    pink: 'bg-apple-pink/20 text-pink-400 border-apple-pink/30',
    green: 'bg-apple-green/20 text-green-400 border-green-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
