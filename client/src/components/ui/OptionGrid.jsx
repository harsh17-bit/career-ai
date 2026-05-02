import React from 'react';
import { motion } from 'framer-motion';

export default function OptionGrid({
  options = [],
  selected,
  onSelect,
  multi = false,
  name,
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3" role="list">
      {options.map((option) => {
        const isSelected = multi
          ? Array.isArray(selected) && selected.includes(option)
          : selected === option;

        return (
          <motion.button
            key={option}
            role="listitem"
            aria-pressed={isSelected}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(option)}
            className={`px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium text-left transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-apple-blue/40 ${
              isSelected
                ? 'bg-apple-blue/20 border-apple-blue/50 text-apple-blue'
                : 'bg-white/[0.03] border-white/[0.08] text-white/60 hover:bg-white/[0.06] hover:border-white/[0.15]'
            }`}
          >
            <span className="truncate">{option}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
