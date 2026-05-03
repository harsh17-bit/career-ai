import React from 'react';
import { motion } from 'framer-motion';

export default function StepTimeline({
  steps,
  currentStep,
  onStepSelect,
  disabled = false,
}) {
  return (
    <div className="assessment-timeline p-4 md:p-8 border-r border-white/[0.08] h-full overflow-y-auto">
      <div className="space-y-2 md:space-y-3">
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isCompleted = idx < currentStep;
          const Icon = step.icon;

          return (
            <motion.button
              key={step.id}
              onClick={() => !disabled && onStepSelect(idx)}
              disabled={disabled}
              whileHover={!disabled ? { x: 4 } : {}}
              whileTap={!disabled ? { x: 2 } : {}}
              className={`w-full text-left p-3 md:p-4 rounded-xl transition-all duration-300 flex items-start gap-3 ${
                isActive
                  ? 'bg-apple-blue/20 border border-apple-blue/50'
                  : isCompleted
                    ? 'bg-green-500/10 border border-green-500/30 hover:bg-green-500/15'
                    : 'bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06]'
              }`}
            >
              {/* Timeline dot */}
              <div className="flex flex-col items-center gap-1 mt-1">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    isActive
                      ? 'bg-apple-blue text-white'
                      : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-white/10 text-white/50'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-6 md:h-8 ${
                      isCompleted
                        ? 'bg-green-500/30'
                        : isActive
                          ? 'bg-apple-blue/30'
                          : 'bg-white/[0.08]'
                    }`}
                  />
                )}
              </div>

              {/* Step info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive
                        ? 'text-apple-blue'
                        : isCompleted
                          ? 'text-green-500'
                          : 'text-white/40'
                    }`}
                  />
                  <span className="text-xs font-semibold uppercase tracking-wide text-white/60">
                    Step {idx + 1}
                  </span>
                </div>
                <h3
                  className={`text-sm font-semibold truncate ${
                    isActive ? 'text-apple-blue' : 'text-white'
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-xs text-white/40 truncate hidden sm:block">
                  {step.subtitle}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
