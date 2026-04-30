import {
  FiStar,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiMail,
  FiZap,
  FiShield,
  FiArrowUpRight,
} from 'react-icons/fi';
import BrandLogo from '../ui/BrandLogo';

const footerLinks = {
  Explore: [
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Testimonials', href: '/#testimonials' },
    { label: 'Assessment', href: '/assessment' },
  ],
  Career: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Roadmap', href: '/roadmap' },
    { label: 'Profile', href: '/profile' },
    { label: 'Chat Mentor', href: '/#' },
  ],
  Support: [
    { label: 'Login', href: '/login' },
    { label: 'Sign Up', href: '/signup' },
    { label: 'Reset Password', href: '/forgot-password' },
    { label: 'Contact', href: 'mailto:hr9012454@gmail.com' },
  ],
  Legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ],
};

const socials = [
  { icon: FiGithub, href: '#', label: 'GitHub' },
  { icon: FiTwitter, href: '#', label: 'Twitter' },
  { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
  { icon: FiMail, href: 'mailto:hr9012454@gmail.com', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="footer-root relative overflow-hidden border-t border-white/[0.06] bg-black">
      <div className="footer-glow footer-glow-left" />
      <div className="footer-glow footer-glow-right" />

      <div className="container-apple px-4 sm:px-6 pt-14 sm:pt-18 md:pt-24 pb-8 sm:pb-10 md:pb-12 relative z-10">
        <div className="footer-panel">
          <div className="footer-brand-block">
            <BrandLogo
              to="/"
              label="Career.AI home"
              className="footer-brand-link"
              textClassName="text-white"
              badgeClassName="h-11 w-11 rounded-[15px]"
              size={44}
            />
            <p className="footer-subtitle">
              Career guidance with a clean, focused, AI-first workflow. Discover
              your path, build your roadmap, and move with clarity.
            </p>

            <div className="footer-pills">
              <span className="footer-pill">
                <FiZap />
                Fast recommendations
              </span>
              <span className="footer-pill">
                <FiShield />
                Private by design
              </span>
            </div>
          </div>

          <div className="footer-links-grid">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="footer-link-column">
                <h4>{title}</h4>
                <ul>
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="footer-link"
                        target={
                          link.href.startsWith('http') ||
                          link.href.startsWith('mailto:')
                            ? '_blank'
                            : undefined
                        }
                        rel={
                          link.href.startsWith('http') ||
                          link.href.startsWith('mailto:')
                            ? 'noreferrer'
                            : undefined
                        }
                      >
                        <span>{link.label}</span>
                        <FiArrowUpRight className="footer-link-icon" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="footer-social-row" aria-label="Social links">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="footer-social-link"
                target={
                  social.href.startsWith('http') ||
                  social.href.startsWith('mailto:')
                    ? '_blank'
                    : undefined
                }
                rel={
                  social.href.startsWith('http') ||
                  social.href.startsWith('mailto:')
                    ? 'noreferrer'
                    : undefined
                }
              >
                <social.icon />
              </a>
            ))}
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} CareerAI. All rights reserved.</p>
            <div className="footer-status">
              <span>Service: high efficiency</span>
              <span>AI optimized</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
