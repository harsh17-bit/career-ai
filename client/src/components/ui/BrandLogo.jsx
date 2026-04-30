import { Link } from 'react-router-dom';

export default function BrandLogo({
  to = '/',
  className = '',
  textClassName = '',
  badgeClassName = '',
  showText = true,
  size = 48,
  label = 'Career.AI home',
}) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-3 ${className}`}
      aria-label={label}
    >
      <span
        className={`inline-flex items-center justify-center rounded-[14px] border border-black/10 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.10)] ${badgeClassName}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <svg
          fill="none"
          height="48"
          viewBox="0 0 48 48"
          width="48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            d="m0 24c15.2548 0 24-8.7452 24-24 0 15.2548 8.7452 24 24 24-15.2548 0-24 8.7452-24 24 0-15.2548-8.7452-24-24-24z"
            fill="#0a0a0a"
            fillRule="evenodd"
          />
        </svg>
      </span>

      {showText && (
        <span
          className={`font-extrabold tracking-[-0.04em] text-[1.03rem] leading-none ${textClassName}`}
        >
          Career.AI
        </span>
      )}
    </Link>
  );
}
