import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Button from '../ui/Button';
import useAuthStore from '../../store/authStore';

export default function CTA() {
  const user = useAuthStore((s) => s.user);
  const firstName =
    user?.firstName || (user?.name && user.name.split(' ')[0]) || null;
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-apple relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 gradient-bg opacity-90" />
          <div className="absolute inset-0 dot-pattern opacity-10" />

          {/* Animated orbs */}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-60 h-60 bg-white/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.5, 1, 1.5], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/20 rounded-full blur-3xl"
          />

          {/* Content */}
          <div className="relative z-10 text-center py-12 sm:py-16 md:py-28 px-4 sm:px-6 md:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-6xl font-bold tracking-tight text-white mb-4 sm:mb-6">
              {firstName ? (
                <>
                  Ready, {firstName}?
                  <br />
                  Let's find your ideal career.
                </>
              ) : (
                <>
                  Ready to find your
                  <br />
                  perfect career?
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-xl mx-auto mb-6 sm:mb-8 md:mb-10">
              We combine AI-powered assessments, personalized roadmaps, and
              practical resume & interview help — tailored for your goals.
            </p>

            {/* feature chips */}
            <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
              <span className="px-3 py-1.5 bg-white/10 text-white/90 rounded-full text-xs">
                Personalized Roadmaps
              </span>
              <span className="px-3 py-1.5 bg-white/10 text-white/90 rounded-full text-xs">
                Resume AI Suggestions
              </span>
              <span className="px-3 py-1.5 bg-white/10 text-white/90 rounded-full text-xs">
                Mock Interviews
              </span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Link to="/assessment">
                <Button
                  variant="primary"
                  size="lg"
                  className="!bg-white !text-black hover:!bg-white/95 !shadow-2xl !shadow-black/20 flex items-center gap-3"
                >
                  <span>Try AI Career Assistant</span>
                  <motion.span whileHover={{ x: 6 }} className="inline-flex">
                    <FiArrowRight className="w-5 h-5" />
                  </motion.span>
                </Button>
              </Link>

              <Link to="/signup">
                <Button
                  variant="secondary"
                  size="lg"
                  className="!bg-transparent !border !border-white/20 !text-white"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
