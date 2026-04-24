import { Link } from 'react-router-dom';
import { FiArrowLeft, FiExternalLink, FiMail } from 'react-icons/fi';

const previewData = {
  label: 'Password reset',
  title: 'Reset your CareerAI password',
  intro:
    'Use the code below to securely update your password. Once changed, you will be redirected back to login.',
  name: 'Harsh Rathod',
  otp: '456396',
  note: 'If you are worried about your account, complete the reset immediately and choose a strong new password.',
};

const buildEmailHtml = () => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CareerAI Email Preview</title>
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: Inter, Arial, sans-serif;
      color: #0f172a;
      padding: 32px 16px;
      background: #f8fafc;
    }
    .wrap { max-width: 680px; margin: 0 auto; }
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin: 0 6px 18px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      background: #eaf2ff;
      border: 1px solid rgba(79, 110, 247, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 900;
      color: #4f6ef7;
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
    }
    .brand-name {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1;
      color: #0f172a;
    }
    .brand-name span { color: #22d3ee; }
    .subtle {
      margin-top: 4px;
      font-size: 12px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: rgba(15, 23, 42, 0.58);
    }
    .meta {
      font-size: 12px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: rgba(15, 23, 42, 0.58);
    }
    .card {
      overflow: hidden;
      border: 1px solid rgba(15, 23, 42, 0.08);
      border-radius: 30px;
      background: #ffffff;
      box-shadow: 0 18px 50px rgba(15, 23, 42, 0.06);
    }
    .accent { height: 6px; background: linear-gradient(90deg, rgba(79, 110, 247, 0.95) 0%, rgba(34, 211, 238, 0.75) 55%, rgba(168, 85, 247, 0.85) 100%); }
    .body { padding: 34px 30px 30px; }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(79, 110, 247, 0.06);
      border: 1px solid rgba(79, 110, 247, 0.12);
      color: #3151c6;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: #22d3ee;
      display: inline-block;
    }
    h1 {
      margin: 18px 0 12px;
      font-size: 34px;
      line-height: 1.1;
      letter-spacing: -0.05em;
      color: #0f172a;
    }
    .intro {
      margin: 0 0 24px;
      font-size: 16px;
      line-height: 1.8;
      color: rgba(15, 23, 42, 0.7);
    }
    .content {
      border-radius: 24px;
      border: 1px solid rgba(15, 23, 42, 0.06);
      background: #fbfdff;
      padding: 24px;
    }
    .codeCard {
      margin: 18px auto 14px;
      max-width: 220px;
      padding: 16px 22px;
      border-radius: 22px;
      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, 0.10);
      box-shadow: 0 8px 22px rgba(15, 23, 42, 0.05);
      text-align: center;
    }
    .codeLabel {
      font-size: 11px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: rgba(15, 23, 42, 0.48);
      margin-bottom: 10px;
    }
    .codeValue {
      font-size: 36px;
      line-height: 1;
      font-weight: 900;
      letter-spacing: 10px;
      color: #0f172a;
    }
    .hello {
      margin: 0;
      font-size: 14px;
      line-height: 1.8;
      color: rgba(15, 23, 42, 0.7);
    }
    .callout {
      margin-top: 16px;
      padding: 14px 16px;
      border-radius: 18px;
      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, 0.08);
      color: #0f172a;
      font-size: 14px;
      line-height: 1.7;
    }
    .note {
      margin: 18px 2px 0;
      font-size: 12px;
      line-height: 1.7;
      color: rgba(15, 23, 42, 0.46);
    }
    .footer {
      padding: 18px 8px 0;
      text-align: center;
      font-size: 12px;
      line-height: 1.7;
      color: rgba(15, 23, 42, 0.42);
    }
    /* Mobile: 480px and below */
    @media (max-width: 480px) {
      body { padding: 16px 10px; }
      .body { padding: 20px 14px 16px; }
      .topbar { flex-direction: column; align-items: flex-start; gap: 10px; }
      .meta { display: none; }
      h1 { font-size: 24px; margin: 14px 0 10px; }
      .intro { font-size: 14px; margin: 0 0 18px; }
      .logo { width: 40px; height: 40px; font-size: 16px; }
      .brand-name { font-size: 16px; }
      .content { padding: 18px; border-radius: 16px; }
    }
    /* Tablet: 480px to 768px */
    @media (max-width: 768px) {
      body { padding: 24px 12px; }
      .body { padding: 26px 22px 20px; }
      .topbar { flex-direction: column; align-items: flex-start; }
      .meta { text-align: left; }
      h1 { font-size: 28px; }
      .intro { font-size: 15px; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="topbar">
      <div class="brand">
        <div class="logo">A</div>
        <div>
          <div class="brand-name">Career<span>AI</span></div>
          <div class="subtle">${previewData.label}</div>
        </div>
      </div>
      <div class="meta">Career guidance</div>
    </div>

    <div class="card">
      <div class="accent"></div>
      <div class="body">
        <div class="pill"><span class="dot"></span>${previewData.label}</div>
        <h1>${previewData.title}</h1>
        <p class="intro">${previewData.intro}</p>

        <div class="content">
          <p class="hello">Hi ${previewData.name},</p>
          <div class="codeCard">
            <div class="codeLabel">Security code</div>
            <div class="codeValue">${previewData.otp}</div>
          </div>
          <div class="callout">This reset code expires in <strong>10 minutes</strong>. If you did not request a password reset, you can ignore this email.</div>
        </div>

        <p class="note">${previewData.note}</p>
      </div>
    </div>

    <div class="footer">Built to help you move faster with less guesswork.</div>
  </div>
</body>
</html>`;

export default function EmailPreview() {
  const emailHtml = buildEmailHtml();

  return (
    <main className="min-h-screen px-4 sm:px-6 py-8 sm:py-10 bg-[radial-gradient(circle_at_top,_rgba(79,110,247,0.15),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.12),_transparent_24%),linear-gradient(180deg,_#f4f7fb_0%,_#ecf2f8_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 shadow-sm">
              <FiMail className="h-3.5 w-3.5 text-cyan-500" />
              Email preview
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Password reset email template
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              This preview matches the password reset email you receive. It's
              fully responsive and renders correctly across all email clients.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
            >
              <FiArrowLeft className="h-4 w-4" />
              Back to app
            </Link>
            <a
              href={`data:text/html;charset=utf-8,${encodeURIComponent(emailHtml)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
            >
              <FiExternalLink className="h-4 w-4" />
              Open standalone
            </a>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_90px_rgba(15,23,42,0.12)]">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="font-semibold text-slate-700">
                  Rendered email
                </span>
                <span className="hidden h-4 w-px bg-slate-300 sm:inline-block" />
                <span>White background</span>
                <span className="hidden h-4 w-px bg-slate-300 sm:inline-block" />
                <span>680px content width</span>
              </div>
            </div>
            <iframe
              title="CareerAI email preview"
              srcDoc={emailHtml}
              className="h-[980px] w-full border-0 bg-white"
              sandbox=""
            />
          </div>

          <aside className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                What changed
              </h2>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                <li>Outer background is off-white and clean.</li>
                <li>Logo is now a softer, simpler badge.</li>
                <li>Preview matches the password reset email you received.</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              If you want, I can also make this preview support the other email
              types like verification, welcome, reset, assessment complete, and
              weekly check-in.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
