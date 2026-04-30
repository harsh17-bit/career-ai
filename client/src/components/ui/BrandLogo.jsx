import { Link } from 'react-router-dom';

export default function BrandLogo({
  to = '/',
  className = '',
  size = 48,
  label = 'Career.AI home',
}) {
  // Height is fixed; width is set to 'auto' so the SVG's aspect ratio (680:122 ≈ 5.57:1) is preserved.
  return (
    <Link
      to={to}
      className={`inline-flex items-center group ${className}`}
      aria-label={label}
    >
      <img
        src="/career_ai_inline_logo.svg"
        alt="Career.Ai"
        style={{ height: size, width: 'auto' }}
        draggable={false}
      />
    </Link>
  );
}
