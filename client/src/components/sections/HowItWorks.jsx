import { motion } from 'framer-motion';
import { FiList, FiHeadphones, FiArrowRight } from 'react-icons/fi';

const steps = [
  {
    number: '01',
    icon: FiList,
    title: 'Take the Assessment',
    description:
      'Complete a quick, comprehensive assessment covering your education, skills, interests, and career goals. It only takes 5 minutes.',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    number: '02',
    icon: FiHeadphones,
    title: 'Get AI Recommendations',
    description:
      'Our AI analyzes your profile and recommends 5 best-fit careers with match scores, salary ranges, and growth potential.',
    color: 'from-purple-500 to-pink-400',
  },
  {
    number: '03',
    icon: FiArrowRight,
    title: 'Follow Your Roadmap',
    description:
      'Generate a structured learning roadmap with resources, milestones, and timelines. Track your progress and land your dream job.',
    color: 'from-pink-500 to-orange-400',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section-padding relative overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] gradient-mesh-strong rounded-full opacity-30" />

      <div className="container-apple relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <span className="text-apple-purple text-sm font-semibold tracking-widest uppercase mb-4 block">
            How It Works
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Three steps to your
            <br />
            <span className="gradient-text">dream career.</span>
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">
            Our streamlined process makes career discovery effortless and
            actionable.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`relative flex flex-col md:flex-row items-center gap-8 mb-16 last:mb-0 ${
                index % 2 !== 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Number circle */}
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-16 h-16 z-10">
                <div
                  className={`w-full h-full rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                >
                  <span className="text-white font-bold text-lg">
                    {step.number}
                  </span>
                </div>
              </div>

              {/* Content card */}
              <div
                className={`flex-1 ${index % 2 === 0 ? 'md:pr-20 md:text-right' : 'md:pl-20'}`}
              >
                <div className="card-apple">
                  <div
                    className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} items-center justify-center mb-5 md:hidden`}
                  >
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-center gap-3 mb-2 md:hidden">
                    <span
                      className={`text-sm font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}
                    >
                      STEP {step.number}
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-white/40 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Spacer for opposite side */}
              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
