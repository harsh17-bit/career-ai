import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiExternalLink,
  FiMail,
} from 'react-icons/fi';

const emailTheme = {
  bg: '#eef2f7',
  panel: '#ffffff',
  panelSoft: '#f7fafc',
  border: 'rgba(15, 23, 42, 0.09)',
  text: '#0f172a',
  muted: '#475569',
  accent: '#3151c6',
  accent2: '#0f766e',
  note: '#64748b',
};

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const ctaButton = (href, text) => `
  <div class="cta-wrap">
    <!--[if mso]>
    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${escapeHtml(
      href
    )}" style="height:48px;v-text-anchor:middle;width:240px;" arcsize="50%" stroke="f" fillcolor="#1d4ed8">
      <w:anchorlock />
      <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">${escapeHtml(
        text
      )}</center>
    </v:roundrect>
    <![endif]-->
    <!--[if !mso]><!-- -->
    <a class="button" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
      text
    )}</a>
    <!--<![endif]-->
  </div>`;

const shell = ({ label, title, intro, content, note }) => `<!doctype html>
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
      color: ${emailTheme.text};
      padding: 32px 16px;
      background-color: ${emailTheme.bg};
      background-image: radial-gradient(circle at top, rgba(79, 70, 229, 0.08), transparent 32%), radial-gradient(circle at 85% 10%, rgba(20, 184, 166, 0.10), transparent 24%);
    }
    .wrap { max-width: 680px; margin: 0 auto; }
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin: 0 6px 18px;
    }
    .brand { display: flex; align-items: center; gap: 12px; }
    .logo {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      background: linear-gradient(135deg, #1d4ed8, #14b8a6);
      border: 1px solid rgba(29, 78, 216, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 900;
      color: #ffffff;
      box-shadow: 0 12px 28px rgba(15, 23, 42, 0.10);
    }
    .brand-name {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1;
      color: ${emailTheme.text};
    }
    .brand-name span { color: ${emailTheme.accent2}; }
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
      border: 1px solid ${emailTheme.border};
      border-radius: 30px;
      background: ${emailTheme.panel};
      box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
    }
    .accent { height: 7px; background: linear-gradient(90deg, #3151c6 0%, #14b8a6 52%, #f59e0b 100%); }
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
      background: ${emailTheme.accent2};
      display: inline-block;
    }
    h1 {
      margin: 18px 0 12px;
      font-size: 35px;
      line-height: 1.1;
      letter-spacing: -0.05em;
      color: ${emailTheme.text};
    }
    .intro {
      margin: 0 0 24px;
      font-size: 16px;
      line-height: 1.8;
      color: ${emailTheme.muted};
    }
    .content {
      border-radius: 24px;
      border: 1px solid rgba(15, 23, 42, 0.06);
      background: linear-gradient(180deg, ${emailTheme.panelSoft} 0%, #ffffff 100%);
      padding: 24px;
    }
    .stack { display: grid; gap: 12px; }
    .feature {
      padding: 16px 18px;
      border-radius: 18px;
      border: 1px solid rgba(15, 23, 42, 0.06);
      background: #ffffff;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.03);
      font-size: 14px;
      line-height: 1.7;
      color: ${emailTheme.muted};
    }
    .feature strong { color: ${emailTheme.text}; }
    .cta-wrap { margin-top: 22px; text-align: center; }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%);
      border-radius: 999px;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.02em;
      padding: 14px 22px;
      box-shadow: 0 14px 28px rgba(15, 23, 42, 0.12);
    }
    .footer {
      padding: 18px 8px 0;
      text-align: center;
      font-size: 12px;
      line-height: 1.7;
      color: rgba(15, 23, 42, 0.42);
    }
    .note {
      margin: 18px 2px 0;
      font-size: 12px;
      line-height: 1.7;
      color: ${emailTheme.note};
    }
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
      .feature { padding: 14px 15px; }
    }
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
          <div class="subtle">${escapeHtml(label)}</div>
        </div>
      </div>
      <div class="meta">Career guidance</div>
    </div>

    <div class="card">
      <div class="accent"></div>
      <div class="body">
        <div class="pill"><span class="dot"></span>${escapeHtml(label)}</div>
        <h1>${escapeHtml(title)}</h1>
        <p class="intro">${intro}</p>

        <div class="content">
          ${content}
        </div>

        ${note ? `<p class="note">${note}</p>` : ''}
      </div>
    </div>

    <div class="footer">Built to help you move faster with less guesswork.</div>
  </div>
</body>
</html>`;

const codeBadge = (code) => `
  <div style="margin:18px auto 14px;max-width:220px;padding:16px 22px;border-radius:22px;background:#ffffff;border:1px solid rgba(15,23,42,0.10);box-shadow:0 8px 22px rgba(15,23,42,0.05);text-align:center;">
    <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(15,23,42,0.48);margin-bottom:10px;">Security code</div>
    <div style="font-size:36px;line-height:1;font-weight:900;letter-spacing:10px;color:${emailTheme.text};">${escapeHtml(code)}</div>
  </div>`;

const chip = (text) => `
  <div style="padding:16px 18px;border-radius:18px;border:1px solid rgba(15,23,42,0.06);background:#ffffff;box-shadow:0 8px 20px rgba(15,23,42,0.03);font-size:14px;line-height:1.7;color:${emailTheme.muted};">
    ${text}
  </div>`;

const buildWelcomeEmailHtml = () =>
  shell({
    label: 'Welcome to CareerAI',
    title: 'Your career planning workspace is ready',
    intro:
      'Your account is verified. You can now move through assessment, roadmap planning, and personalized recommendations in one streamlined experience.',
    content: `
      <p style="margin:0;font-size:14px;line-height:1.8;color:${emailTheme.muted};">Hi Harsh Rathod,</p>
      <div class="stack" style="margin-top:18px;">
        <div class="feature"><strong>Assessment-first guidance.</strong> Get a clear snapshot of your strengths and the roles that fit your profile.</div>
        <div class="feature"><strong>Premium roadmap tracking.</strong> Turn your next steps into a structured plan with milestones you can actually follow.</div>
        <div class="feature"><strong>Always-available support.</strong> Revisit your dashboard anytime and reach out whenever you need help.</div>
      </div>
      ${ctaButton('https://career-ai-3btq.onrender.com/', 'Open your dashboard')}
      <p style="margin:18px 0 0;font-size:14px;line-height:1.8;color:${emailTheme.muted};">If you ever need help getting started, reply to this email or visit <a href="https://careerai.com/support" style="color:${emailTheme.accent};text-decoration:none;font-weight:700;">our support page</a>.</p>`,
    note: 'We are glad to have you here. Your next best move starts with a focused plan.',
  });

const buildResetEmailHtml = () =>
  shell({
    label: 'Password reset',
    title: 'Reset your CareerAI password',
    intro:
      'Use the code below to securely update your password. Once changed, you will be redirected back to login.',
    content: `
      <p style="margin:0;font-size:14px;line-height:1.8;color:${emailTheme.muted};">Hi Harsh Rathod,</p>
      <div style="margin:18px auto 14px;max-width:220px;padding:16px 22px;border-radius:22px;background:#ffffff;border:1px solid rgba(15,23,42,0.10);box-shadow:0 8px 22px rgba(15,23,42,0.05);text-align:center;">
        <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(15,23,42,0.48);margin-bottom:10px;">Security code</div>
        <div style="font-size:36px;line-height:1;font-weight:900;letter-spacing:10px;color:${emailTheme.text};">456396</div>
      </div>
      <div style="margin-top:16px;padding:14px 16px;border-radius:18px;background:#ffffff;border:1px solid rgba(15, 23, 42, 0.08);color:${emailTheme.text};font-size:14px;line-height:1.7;">This reset code expires in <strong>10 minutes</strong>. If you did not request a password reset, you can ignore this email.</div>`,
    note: 'If you are worried about your account, complete the reset immediately and choose a strong new password.',
  });

const buildVerificationEmailHtml = () =>
  shell({
    label: 'Email verification',
    title: 'Confirm your CareerAI account',
    intro:
      'Use the security code below to verify your email and unlock your dashboard, roadmap, and AI recommendations.',
    content: `
      <p style="margin:0;font-size:14px;line-height:1.8;color:${emailTheme.muted};">Hi Harsh Rathod,</p>
      ${codeBadge('481205')}
      <p style="margin:0;font-size:14px;line-height:1.8;color:${emailTheme.muted};">This code expires in <strong style="color:${emailTheme.text};">10 minutes</strong>. If you did not request it, you can safely ignore this message.</p>`,
    note: 'For your security, never share this code with anyone. CareerAI will never ask for it in chat or over social media.',
  });

const buildAssessmentEmailHtml = () =>
  shell({
    label: 'Assessment complete',
    title: 'Your career map is ready',
    intro:
      'Your assessment is finished and your personalized recommendation set is ready for review.',
    content: `
      <p style="margin:0;font-size:14px;line-height:1.8;color:${emailTheme.muted};">Hi Harsh Rathod,</p>
      <div class="stack" style="margin-top:18px;">
        ${chip(`<strong style="color:${emailTheme.text};">Top match:</strong> Product Designer`)}
        ${chip('Open your dashboard to export a PDF summary, review skill gaps, and continue your roadmap.')}
      </div>`,
    note: 'Your career recommendations are personalized based on the assessment you completed today.',
  });

const buildWeeklyCheckInEmailHtml = () =>
  shell({
    label: 'Weekly check-in',
    title: 'Your weekly career pulse',
    intro:
      'A small reminder to keep your roadmap alive, your progress visible, and your next milestone within reach.',
    content: `
      <p style="margin:0;font-size:14px;line-height:1.8;color:${emailTheme.muted};">Hi Harsh Rathod,</p>
      <div class="stack" style="margin-top:18px;">
        ${chip(`<strong style="color:${emailTheme.text};">Focus area:</strong> Frontend development`)}
        ${chip('Complete a milestone, review your skill gap, or export your progress as PDF.')}
      </div>`,
    note: 'You can adjust reminders and pace inside your roadmap as you progress.',
  });

const templates = [
  {
    id: 'verification',
    label: 'Verification',
    title: 'Email verification template',
    description: 'A secure code-based verification email for new accounts.',
    html: buildVerificationEmailHtml(),
  },
  {
    id: 'welcome',
    label: 'Welcome',
    title: 'Premium welcome email',
    description: 'A polished onboarding template for new verified users.',
    html: buildWelcomeEmailHtml(),
  },
  {
    id: 'reset',
    label: 'Password reset',
    title: 'Security reset email',
    description: 'A secure code-based template for password recovery.',
    html: buildResetEmailHtml(),
  },
  {
    id: 'assessment',
    label: 'Assessment',
    title: 'Assessment complete email',
    description: 'A polished results email for completed assessments.',
    html: buildAssessmentEmailHtml(),
  },
  {
    id: 'weekly',
    label: 'Weekly check-in',
    title: 'Weekly check-in email',
    description: 'A recurring progress reminder for roadmap momentum.',
    html: buildWeeklyCheckInEmailHtml(),
  },
];

export default function EmailPreview() {
  const [activeTemplateId, setActiveTemplateId] = useState('welcome');

  const activeTemplate =
    templates.find((template) => template.id === activeTemplateId) ??
    templates[0];

  const emailHtml = useMemo(() => activeTemplate.html, [activeTemplate]);

  return (
    <main className="min-h-screen px-4 py-8 text-slate-900 sm:px-6 sm:py-10 bg-[radial-gradient(circle_at_top,_rgba(79,110,247,0.15),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.12),_transparent_24%),linear-gradient(180deg,_#f4f7fb_0%,_#ecf2f8_100%)]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 shadow-sm">
              <FiMail className="h-3.5 w-3.5 text-cyan-500" />
              Mail section
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Email template studio
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Switch between premium email templates, review the rendered
              output, and keep the mail section consistent with the product
              brand.
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

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => {
            const isActive = template.id === activeTemplateId;

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => setActiveTemplateId(template.id)}
                className={`rounded-[1.75rem] border p-5 text-left shadow-[0_16px_45px_rgba(15,23,42,0.06)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 ${
                  isActive
                    ? 'border-slate-900 bg-slate-900 text-white shadow-[0_18px_50px_rgba(15,23,42,0.15)]'
                    : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div
                      className={`text-xs font-semibold uppercase tracking-[0.22em] ${isActive ? 'text-cyan-300' : 'text-slate-500'}`}
                    >
                      {template.label}
                    </div>
                    <h2 className="mt-2 text-lg font-black tracking-tight">
                      {template.title}
                    </h2>
                  </div>
                  {isActive ? (
                    <FiCheckCircle className="h-5 w-5 text-cyan-300" />
                  ) : (
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  )}
                </div>
                <p
                  className={`mt-3 text-sm leading-6 ${isActive ? 'text-slate-200' : 'text-slate-600'}`}
                >
                  {template.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_90px_rgba(15,23,42,0.12)]">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="font-semibold text-slate-700">
                  Rendered email
                </span>
                <span className="hidden h-4 w-px bg-slate-300 sm:inline-block" />
                <span>{activeTemplate.label}</span>
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
                Mail section notes
              </h2>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                <li>Premium shell matches the server-side email renderer.</li>
                <li>
                  Verification, welcome, reset, assessment, and weekly templates
                  are all available here.
                </li>
                <li>
                  Standalone export uses the exact HTML currently in view.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              The mail section now covers the full lifecycle: first sign-in,
              onboarding, account recovery, assessment results, and ongoing
              progress nudges.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
