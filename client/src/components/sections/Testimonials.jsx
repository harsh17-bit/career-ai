import { motion } from 'framer-motion';
import { FiStar, FiMessageSquare } from 'react-icons/fi';
import { TESTIMONIALS } from '../../utils/constants';

const colors = [
  'from-blue-500 to-cyan-400',
  'from-purple-500 to-pink-400',
  'from-pink-500 to-rose-400',
  'from-orange-500 to-amber-400',
  'from-green-500 to-emerald-400',
  'from-indigo-500 to-violet-400',
];

export default function Testimonials() {
  // Duplicate for infinite scroll
  const allTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section
      id="testimonials"
      className="section-padding relative overflow-hidden"
    >
      <div className="container-apple">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 sm:mb-14 md:mb-16"
        >
          <span className="text-apple-pink text-sm font-semibold tracking-widest uppercase mb-4 block">
            Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-6xl font-bold tracking-tight text-white mb-4 sm:mb-6">
            Loved by students
            <br />
            <span className="gradient-text">worldwide.</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white/40 max-w-2xl mx-auto">
            Join thousands of students who've discovered their dream careers
            with CareerAI.
          </p>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ x: { duration: 40, repeat: Infinity, ease: 'linear' } }}
          className="flex gap-3 sm:gap-5 md:gap-6 py-2 sm:py-3 md:py-4"
        >
          {allTestimonials.map((t, i) => (
            <div
              key={`${t.name}-${i}`}
              className="flex-shrink-0 w-[290px] sm:w-[330px] md:w-[380px] card-apple hover:scale-[1.02] group p-4 sm:p-6 md:p-8"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <FiStar
                    key={j}
                    className="w-4 h-4 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>

              {/* Quote */}
              <FiMessageSquare className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white/10 mb-2 sm:mb-3" />
              <p className="text-white/60 leading-relaxed mb-4 sm:mb-5 md:mb-6 text-xs sm:text-sm">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center text-xs sm:text-sm font-bold text-white`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    {t.name}
                  </p>
                  <p className="text-xs text-white/40">{t.career}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
