import { motion } from 'framer-motion';
import {
  FiHeadphones,
  FiTarget,
  FiMap,
  FiMessageCircle,
  FiShield,
  FiZap,
} from 'react-icons/fi';

const features = [
  {
    icon: FiHeadphones,
    title: 'AI-Powered Analysis',
    description:
      'Our advanced AI analyzes your skills, interests, and academic background to identify career paths that truly match your potential.',
    color: 'from-blue-500 to-cyan-400',
    shadow: 'shadow-blue-500/20',
  },
  {
    icon: FiTarget,
    title: 'Precision Matching',
    description:
      'Get 5 personalized career recommendations with match percentages, salary insights, and future growth projections.',
    color: 'from-purple-500 to-pink-400',
    shadow: 'shadow-purple-500/20',
  },
  {
    icon: FiMap,
    title: 'Learning Roadmaps',
    description:
      'Structured 5-phase roadmaps from foundation to job-ready, with curated resources from top learning platforms.',
    color: 'from-pink-500 to-rose-400',
    shadow: 'shadow-pink-500/20',
  },
  {
    icon: FiMessageCircle,
    title: 'AI Mentor Chat',
    description:
      '24/7 AI career mentor that provides personalized advice, study tips, interview prep, and emotional support.',
    color: 'from-orange-500 to-amber-400',
    shadow: 'shadow-orange-500/20',
  },
  {
    icon: FiShield,
    title: 'Data Privacy',
    description:
      'Your career data is encrypted and protected. We never share your personal information with third parties.',
    color: 'from-green-500 to-emerald-400',
    shadow: 'shadow-green-500/20',
  },
  {
    icon: FiZap,
    title: 'Instant Results',
    description:
      'Get AI-powered insights in seconds, not days. Our technology processes your profile and delivers results instantly.',
    color: 'from-yellow-500 to-orange-400',
    shadow: 'shadow-yellow-500/20',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Features() {
  return (
    <section id="features" className="section-padding relative">
      <div className="container-apple">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <span className="text-apple-blue text-sm font-semibold tracking-widest uppercase mb-4 block">
            Features
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Everything you need to
            <br />
            <span className="gradient-text">launch your career</span>
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">
            A comprehensive AI platform that guides you from career discovery to
            your first job, powered by cutting-edge technology.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group card-apple hover:border-white/[0.15] relative overflow-hidden"
            >
              {/* Glow effect on hover */}
              {/* <div
                className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`}
              /> */}

              <div
                className={`w-14 h-14 rounded-2xl ${feature.color} ${feature.shadow} flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-white/40 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
