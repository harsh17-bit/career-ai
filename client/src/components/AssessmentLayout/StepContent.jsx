import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OptionGrid from '../ui/OptionGrid';
import {
  EDUCATION_LEVELS,
  STREAMS,
  SUBJECTS,
  INTERESTS,
  SKILLS,
} from '../../utils/constants';

export default function StepContent({
  currentStep,
  steps,
  form,
  direction,
  onFormChange,
  toggleArray,
}) {
  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 300 : -300, opacity: 0 }),
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <OptionGrid
            options={EDUCATION_LEVELS}
            selected={form.educationLevel}
            onSelect={(v) => onFormChange({ ...form, educationLevel: v })}
          />
        );

      case 1:
        return (
          <OptionGrid
            options={STREAMS}
            selected={form.stream}
            onSelect={(v) => onFormChange({ ...form, stream: v })}
          />
        );

      case 2:
        return (
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">
                Subjects{' '}
                <span className="text-white/30 text-sm font-normal">
                  (min 2)
                </span>
              </h3>
              <OptionGrid
                options={SUBJECTS}
                selected={form.subjects}
                onSelect={(v) => toggleArray('subjects', v)}
                multi
              />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">
                Interests{' '}
                <span className="text-white/30 text-sm font-normal">
                  (min 2)
                </span>
              </h3>
              <OptionGrid
                options={INTERESTS}
                selected={form.interests}
                onSelect={(v) => toggleArray('interests', v)}
                multi
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">
              Your Skills{' '}
              <span className="text-white/30 text-sm font-normal">(min 2)</span>
            </h3>
            <OptionGrid
              options={SKILLS}
              selected={form.skills}
              onSelect={(v) => toggleArray('skills', v)}
              multi
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/50 mb-2">
                Academic Score (%)
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full gradient-bg"
                    animate={{ width: `${form.marks}%` }}
                    transition={{ duration: 0.35 }}
                  />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-white w-14 sm:w-16 text-right">
                  {form.marks}%
                </span>
              </div>
              <p className="text-xs text-white/35 mt-2">
                Auto-calculated from your selected education, stream, subjects,
                interests, skills, and career goals.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/50 mb-2">
                Career Goals
              </label>
              <textarea
                value={form.goals}
                onChange={(e) =>
                  onFormChange({ ...form, goals: e.target.value })
                }
                placeholder="Describe your dream career and what you want to achieve..."
                rows={4}
                className="input-apple resize-none"
              />
              <p className="text-xs text-white/30 mt-1">
                {form.goals.length}/200 characters (min 10)
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={currentStep}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="space-y-5 sm:space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              {(() => {
                const Icon = steps[currentStep].icon;
                return <Icon className="w-6 h-6 text-apple-blue" />;
              })()}
              <span className="text-sm font-semibold text-apple-blue uppercase tracking-wider">
                Step {currentStep + 1}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
              {steps[currentStep].title}
            </h2>
            <p className="text-sm sm:text-base text-white/40">
              {steps[currentStep].subtitle}
            </p>
          </div>

          {/* Content */}
          <div>{renderStepContent()}</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
