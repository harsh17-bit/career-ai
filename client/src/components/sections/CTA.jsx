import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Button from '../ui/Button';

export default function CTA() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-apple relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[2.5rem] overflow-hidden"
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
          <div className="relative z-10 text-center py-20 md:py-28 px-8">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Ready to find your
              <br />
              perfect career?
            </h2>
            <p className="text-lg text-white/70 max-w-xl mx-auto mb-10">
              Join thousands of students who've already discovered their dream
              careers. Start your personalized AI assessment today — it's
              completely free.
            </p>
            <Link to="/signup">
              <Button
                variant="secondary"
                size="lg"
                className="!bg-white !text-black hover:!bg-white/90 !shadow-2xl !shadow-black/20"
              >
                Get Started for Free
                <FiArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
