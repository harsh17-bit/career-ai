const audiences = [
  {
    title: 'Students',
    text: 'Choosing a first career path and needing direction.',
  },
  {
    title: 'Switchers',
    text: 'Moving into a better-fit role with a clearer plan.',
  },
  {
    title: 'Planners',
    text: 'Wanting a simple roadmap before spending time and money.',
  },
];

export default function WhoItIsFor() {
  return (
    <section id="who-it-is-for" className="section-padding">
      <div className="container-apple">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
          <span className="text-apple-pink text-sm font-semibold tracking-widest uppercase block mb-3">
            Who it is for
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-tight">
            Built for people who need clarity.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/45 max-w-2xl mx-auto leading-relaxed">
            Whether you are starting fresh or changing direction, CareerAI n+
            helps you narrow the options and move with confidence.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid gap-4 sm:grid-cols-3">
          {audiences.map((item) => (
            <div key={item.title} className="card-apple p-5 text-left">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 mb-4 flex items-center justify-center text-white/80 text-xs font-semibold">
                {item.title.slice(0, 2).toUpperCase()}
              </div>
              <p className="text-sm font-semibold text-white mb-2">
                {item.title}
              </p>
              <p className="text-sm text-white/55 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
