import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiPlay,
  FiHeadphones,
  FiTarget,
  FiArrowUp,
} from 'react-icons/fi';
import Button from '../ui/Button';
import '../../styles/features/hero.css';

export default function Hero() {
  return (
    <section className="hero-section">
      {/* Animated gradient mesh background */}
      <div className="hero-bg-layer">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(0,113,227,0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(175,82,222,0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,55,95,0.1) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* Dot pattern */}
      <div className="hero-dot-pattern" />

      <div className="container-apple hero-container">
        <div className="hero-inner">
          {/* Badge */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-8"
          >
            <FiStar className="w-4 h-4 text-apple-blue" />
            <span className="text-sm font-medium text-white/70">
              AI-Powered Career Guidance
            </span>
          </motion.div> */}

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="hero-title"
          >
            Step to Perfect
            <br />
            <span className="gradient-text">Future Path</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="hero-subtext"
          >
            Powered by advanced AI, CareerAI analyzes your skills, interests,
            and goals to recommend personalized career paths with detailed
            learning roadmaps.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hero-ctas"
          >
            <Link to="/signup">
              <Button variant="primary" size="lg">
                Start Free Assessment
                <FiArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="secondary" size="lg">
                <FiPlay className="w-5 h-5" />
                See How It Works
              </Button>
            </a>
          </motion.div>

          {/* Floating Preview Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="hero-preview"
          >
            {/* Main preview card */}
            <div className="glass-card hero-preview-card">
              <div className="hero-feature-grid">
                {[
                  {
                    icon: FiHeadphones,
                    label: 'AI Analysis',
                    desc: 'Deep skill assessment',
                    color: 'from-blue-500 to-cyan-400',
                  },
                  {
                    icon: FiTarget,
                    label: 'Career Match',
                    desc: '5 personalized paths',
                    color: 'from-purple-500 to-pink-400',
                  },
                  {
                    icon: FiArrowUp,
                    label: 'Roadmap',
                    desc: 'Step-by-step guide',
                    color: 'from-pink-500 to-orange-400',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.15 }}
                    className="hero-feature-item"
                  >
                    <div className={`hero-feature-icon ${item.color}`}>
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="hero-feature-title">{item.label}</h3>
                    <p className="hero-feature-desc">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Decorative gradient */}
            <div className="hero-preview-glow gradient-mesh-strong" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
