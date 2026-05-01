const careers = [
  [
    'Software Engineer',
    'Build products, solve problems, and prep for technical interviews.',
    'Best for: logic, coding, product thinking',
  ],
  [
    'Data Analyst',
    'Turn raw data into dashboards, reports, and useful business insights.',
    'Best for: spreadsheets, charts, decision-making',
  ],
  [
    'UI/UX Designer',
    'Design simple, polished interfaces and improve user experience.',
    'Best for: visuals, empathy, product design',
  ],
];

export default function CareerPreview() {
  return (
    <section id="career-preview" className="section-padding">
      <div className="container-apple">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
          <span className="text-apple-blue text-sm font-semibold tracking-widest uppercase block mb-3">
            Preview
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-tight">
            See the career paths before you start.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/45 max-w-2xl mx-auto leading-relaxed">
            Get a quick look at the kind of paths CareerAI can recommend so you
            know what to expect before taking the assessment.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {careers.map(([title, description, note], index) => (
            <div
              key={title}
              className="card-apple p-5 sm:p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 px-3 py-1 text-[11px] tracking-[0.2em] uppercase text-white/35">
                0{index + 1}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-white/80 text-sm font-semibold">
                {title.slice(0, 1)}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-white/45 leading-relaxed mb-4">
                {description}
              </p>
              <p className="text-xs text-white/65 border-t border-white/10 pt-3">
                {note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
