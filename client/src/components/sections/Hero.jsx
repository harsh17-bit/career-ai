import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiPlay,
  FiStar,
  FiHeadphones,
  FiTarget,
  FiArrowUp,
} from 'react-icons/fi';
import Button from '../ui/Button';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0">
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
      <div className="absolute inset-0 dot-pattern opacity-30" />

      <div className="container-apple relative z-10 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-8"
          >
            <FiStar className="w-4 h-4 text-apple-blue" />
            <span className="text-sm font-medium text-white/70">
              AI-Powered Career Guidance
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-hero font-bold tracking-tight text-white mb-8"
          >
            Find Your Perfect
            <br />
            <span className="gradient-text">Career Path</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
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
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
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
            className="relative max-w-4xl mx-auto"
          >
            {/* Main preview card */}
            <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/[0.08]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all duration-500"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-4`}
                    >
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1 tracking-tight">
                      {item.label}
                    </h3>
                    <p className="text-sm text-white/40">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Decorative gradient */}
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-2/3 h-40 gradient-mesh-strong rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
