import React from 'react';

export default function RoadmapCard({
  title = 'Frontend Engineer',
  progress = 0.42,
  etaWeeks = 12,
  nextSteps = ['Resume polish', 'Build portfolio project'],
}) {
  const pct = Math.round(progress * 100);
  return (
    <div className="w-full bg-white/5 border border-white/[0.06] rounded-2xl p-4 text-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-white font-semibold">{title} Roadmap</h4>
          <p className="text-white/60 text-xs">
            Estimated time: {etaWeeks} weeks
          </p>
        </div>
        <div className="text-right">
          <div className="text-white font-medium">{pct}%</div>
          <div className="text-white/60 text-xs">to goal</div>
        </div>
      </div>

      <div className="w-full bg-white/6 rounded-full h-2 mt-3 overflow-hidden">
        <div style={{ width: `${pct}%` }} className="h-2 bg-white/40" />
      </div>

      <div className="mt-3 text-white/80">
        <div className="text-xs font-semibold mb-1">Next steps</div>
        <ul className="text-xs list-disc list-inside space-y-1">
          {nextSteps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
