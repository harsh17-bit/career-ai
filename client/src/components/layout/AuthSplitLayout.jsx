import BrandLogo from '../ui/BrandLogo';

const chartSeries = [
  {
    d: 'M24 164C48 158 54 118 78 121C102 124 108 90 130 92C154 94 160 70 184 74C208 78 214 56 238 58C262 60 268 42 292 45C316 48 322 34 348 30',
    opacity: '0.95',
  },
  {
    d: 'M24 192C48 188 54 172 78 169C102 166 108 150 130 148C154 146 160 132 184 132C208 132 214 122 238 123C262 124 268 116 292 116C316 116 322 110 348 108',
    opacity: '0.55',
  },
  {
    d: 'M24 208C48 200 54 192 78 190C102 188 108 180 130 176C154 172 160 170 184 166C208 162 214 154 238 150C262 146 268 142 292 136C316 130 322 120 348 114',
    opacity: '0.9',
  },
];

export default function AuthSplitLayout({
  children,
  className = '',
  title = 'Welcome to your new dashboard',
  description = "Sign in to explore changes we've made.",
  logoLabel = 'Career.AI home',
}) {
  return (
    <div className={`auth-split-layout ${className}`}>
      <section className="auth-split-left">
        <BrandLogo
          to="/"
          label={logoLabel}
          className="auth-split-brand"
          textClassName="text-slate-900"
          badgeClassName="auth-split-brand-mark"
          size={34}
        />

        <div className="auth-split-left-content">
          <div className="auth-split-left-inner">{children}</div>
        </div>
      </section>

      <aside className="auth-split-right" aria-hidden="true">
        <div className="auth-split-right-glow auth-split-right-glow-top" />
        <div className="auth-split-right-glow auth-split-right-glow-bottom" />

        <div className="auth-split-showcase">
          <div className="auth-chart-card">
            <div className="auth-chart-card-header">Users over time</div>
            <svg
              viewBox="0 0 372 220"
              className="auth-chart-card-svg"
              role="presentation"
            >
              <line
                x1="12"
                y1="28"
                x2="360"
                y2="28"
                className="auth-chart-grid-line"
              />
              <line
                x1="12"
                y1="88"
                x2="360"
                y2="88"
                className="auth-chart-grid-line"
              />
              <line
                x1="12"
                y1="148"
                x2="360"
                y2="148"
                className="auth-chart-grid-line"
              />
              {chartSeries.map((series, index) => (
                <path
                  key={index}
                  d={series.d}
                  className="auth-chart-series"
                  style={{ opacity: series.opacity }}
                />
              ))}
              <g className="auth-chart-axis">
                <text x="14" y="210">
                  Jan
                </text>
                <text x="72" y="210">
                  Mar
                </text>
                <text x="132" y="210">
                  May
                </text>
                <text x="192" y="210">
                  Jul
                </text>
                <text x="252" y="210">
                  Sep
                </text>
                <text x="314" y="210">
                  Nov
                </text>
              </g>
            </svg>
          </div>

          <div className="auth-ring-card">
            <div className="auth-ring-card-figure">
              <svg
                viewBox="0 0 220 220"
                className="auth-ring-svg"
                role="presentation"
              >
                <circle cx="110" cy="110" r="82" className="auth-ring-track" />
                <circle
                  cx="110"
                  cy="110"
                  r="64"
                  className="auth-ring-track auth-ring-track-soft"
                />
                <circle
                  cx="110"
                  cy="110"
                  r="46"
                  className="auth-ring-track auth-ring-track-softest"
                />
                <circle
                  cx="110"
                  cy="110"
                  r="82"
                  className="auth-ring-progress auth-ring-progress-a"
                />
                <circle
                  cx="110"
                  cy="110"
                  r="64"
                  className="auth-ring-progress auth-ring-progress-b"
                />
                <circle
                  cx="110"
                  cy="110"
                  r="46"
                  className="auth-ring-progress auth-ring-progress-c"
                />
              </svg>
              <div className="auth-ring-copy">
                <span>Active users</span>
                <strong>1,000</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-split-copy">
          <h2>{title}</h2>
          <p>{description}</p>

          <div className="auth-split-carousel">
            <button
              type="button"
              className="auth-split-nav-btn"
              aria-label="Previous slide"
            >
              <span>‹</span>
            </button>
            <div className="auth-split-dots" aria-hidden="true">
              <span className="is-active" />
              <span />
              <span />
              <span />
            </div>
            <button
              type="button"
              className="auth-split-nav-btn"
              aria-label="Next slide"
            >
              <span>›</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
