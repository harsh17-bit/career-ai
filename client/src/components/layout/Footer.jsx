import { Link } from 'react-router-dom';
import {
  FiStar,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiMail,
} from 'react-icons/fi';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#' },
    { label: 'Roadmap', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Community', href: '#' },
    { label: 'Support', href: '#' },
    { label: 'API', href: '#' },
  ],
  Legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Cookies', href: '#' },
  ],
};

const socials = [
  { icon: FiGithub, href: '#', label: 'GitHub' },
  { icon: FiTwitter, href: '#', label: 'Twitter' },
  { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
  { icon: FiMail, href: '#', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="footer-root relative border-t border-white/[0.06] bg-black">
      <div className="container-apple px-6 pt-20 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 md:gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center">
                <FiStar className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Career<span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
              AI-powered career guidance platform. Discover your perfect path
              with personalized recommendations and learning roadmaps.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4 tracking-tight">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/40 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} CareerAI. All rights reserved.
          </p>
          <p className="text-sm text-white/30">
            Built with <span className="text-apple-pink">♥</span> and AI
          </p>
        </div>
      </div>
    </footer>
  );
}
