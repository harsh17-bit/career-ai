import nodemailer from 'nodemailer';

const createTransporter = () => {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const passRaw =
    process.env.GOOGLE_APP_PASSWORD ||
    process.env.EMAIL_APP_PASSWORD ||
    process.env.SMTP_PASS;
  const pass = passRaw ? passRaw.replace(/\s+/g, '') : '';

  if (!user || !pass) return null;

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 465);

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

const getFromAddress = () =>
  process.env.EMAIL_FROM ||
  process.env.SMTP_FROM ||
  `CareerAI <${process.env.EMAIL_USER || process.env.SMTP_USER || 'no-reply@careerai.local'}>`;

const theme = {
  bg: '#f8fafc',
  panel: '#ffffff',
  panelSoft: '#fbfdff',
  border: 'rgba(15, 23, 42, 0.08)',
  text: '#0f172a',
  muted: 'rgba(15, 23, 42, 0.70)',
  accent: '#4f6ef7',
  accent2: '#22d3ee',
  accent3: '#a855f7',
  note: 'rgba(15, 23, 42, 0.46)',
};

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const shell = ({ label, title, intro, content, note }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CareerAI Email</title>
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: Inter, Arial, sans-serif;
      color: ${theme.text};
      padding: 32px 16px;
      background: ${theme.bg};
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
      color: ${theme.accent};
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
    }
    .brand-name {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1;
      color: ${theme.text};
    }
    .brand-name span { color: ${theme.accent2}; }
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
      border: 1px solid ${theme.border};
      border-radius: 30px;
      background: ${theme.panel};
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
      background: ${theme.accent2};
      display: inline-block;
    }
    h1 {
      margin: 18px 0 12px;
      font-size: 34px;
      line-height: 1.1;
      letter-spacing: -0.05em;
      color: ${theme.text};
    }
    .intro {
      margin: 0 0 24px;
      font-size: 16px;
      line-height: 1.8;
      color: ${theme.muted};
    }
    .content {
      border-radius: 24px;
      border: 1px solid rgba(15, 23, 42, 0.06);
      background: ${theme.panelSoft};
      padding: 24px;
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
      color: ${theme.note};
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
  <div style="margin:18px 0 14px;text-align:center;">
    <div style="display:inline-block;padding:16px 22px;border-radius:22px;background:#ffffff;border:1px solid rgba(15,23,42,0.10);box-shadow:0 8px 22px rgba(15,23,42,0.05);">
      <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(15,23,42,0.48);margin-bottom:10px;">Security code</div>
      <div style="font-size:36px;line-height:1;font-weight:900;letter-spacing:10px;color:${theme.text};">${escapeHtml(code)}</div>
    </div>
  </div>`;

const chip = (text, style = 'blue') => {
  const styles = {
    blue: 'background:rgba(79,110,247,0.08);border-color:rgba(79,110,247,0.18);color:#1d4ed8;',
    cyan: 'background:rgba(34,211,238,0.08);border-color:rgba(34,211,238,0.18);color:#0e7490;',
    white: 'background:#ffffff;border-color:rgba(15,23,42,0.08);color:#0f172a;',
  };

  return `<div style="padding:14px 16px;border-radius:18px;border:1px solid ${style === 'blue' ? 'rgba(79,110,247,0.18)' : style === 'cyan' ? 'rgba(34,211,238,0.18)' : 'rgba(15,23,42,0.08)'};${styles[style]}font-size:14px;line-height:1.7;">${text}</div>`;
};

export const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = createTransporter();
  if (!transporter) {
    throw new Error(
      'Email is not configured. Set EMAIL_USER and GOOGLE_APP_PASSWORD.'
    );
  }

  await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject,
    text,
    html,
  });
};

export const sendVerificationEmail = async ({ to, name, otp }) => {
  const subject = 'Verify your CareerAI account';
  const text = `Hi ${name},\n\nYour CareerAI verification code is ${otp}. It expires in 10 minutes.\n\nIf you did not request this, you can ignore this email.`;
  const html = shell({
    label: 'Email verification',
    title: 'Confirm your CareerAI account',
    intro:
      'Use the security code below to verify your email and unlock your dashboard, roadmap, and AI recommendations.',
    content: `
      <p style="margin:0;font-size:14px;line-height:1.8;color:${theme.muted};">Hi ${escapeHtml(
        name
      )},</p>
      ${codeBadge(otp)}
      <p style="margin:0;font-size:14px;line-height:1.8;color:${theme.muted};">This code expires in <strong style="color:${theme.text};">10 minutes</strong>. If you did not request it, you can safely ignore this message.</p>`,
    note: 'For your security, never share this code with anyone. CareerAI will never ask for it in chat or over social media.',
  });

  return sendEmail({ to, subject, text, html });
};

export const sendWelcomeEmail = async ({ to, name }) => {
  const subject = 'Welcome to CareerAI';
  const text = `Hi ${name},\n\nWelcome to CareerAI. Your account has been verified successfully. You can now explore your assessment, roadmap, and career recommendations.\n\nWe’re glad to have you here.`;
  const html = shell({
    label: 'Welcome',
    title: 'Your account is ready',
    intro:
      'You are in. CareerAI is now set up to guide you through assessment, roadmap planning, and personalized recommendations.',
    content: `
      <p style="margin:0;font-size:14px;line-height:1.8;color:${theme.muted};">Hi ${escapeHtml(
        name
      )},</p>
      <div style="margin-top:18px;display:grid;gap:12px;">
        ${chip('Start your assessment to generate AI career matches.', 'blue')}
        ${chip('Build a roadmap and track milestones with streaks and badges.', 'cyan')}
        ${chip('Use the dashboard to export your progress and revisit recommendations anytime.', 'white')}
      </div>
      <p style="margin:18px 0 0;font-size:14px;line-height:1.8;color:${theme.muted};">We’re glad to have you here.</p>`,
  });

  return sendEmail({ to, subject, text, html });
};

export const sendPasswordResetOtpEmail = async ({ to, name, otp }) => {
  const subject = 'CareerAI password reset code';
  const text = `Hi ${name},\n\nYour password reset code is ${otp}. It expires in 10 minutes.\n\nIf you did not request this, you can ignore this email.`;
  const html = shell({
    label: 'Password reset',
    title: 'Reset your CareerAI password',
    intro:
      'Use the code below to securely update your password. Once changed, you will be redirected back to login.',
    content: `
      <p style="margin:0;font-size:14px;line-height:1.8;color:${theme.muted};">Hi ${escapeHtml(
        name
      )},</p>
      ${codeBadge(otp)}
      <p style="margin:0;font-size:14px;line-height:1.8;color:${theme.muted};">This reset code expires in <strong style="color:${theme.text};">10 minutes</strong>. If you did not request a password reset, you can ignore this email.</p>`,
    note: 'If you are worried about your account, complete the reset immediately and choose a strong new password.',
  });

  return sendEmail({ to, subject, text, html });
};

export const sendAssessmentCompletedEmail = async ({
  to,
  name,
  careerName,
}) => {
  const subject = 'Your CareerAI assessment is complete';
  const text = `Hi ${name},\n\nYour assessment is complete and your career recommendations are ready${careerName ? `, with ${careerName} as your top match` : ''}. Log in to review your roadmap and next steps.`;
  const html = shell({
    label: 'Assessment complete',
    title: 'Your career map is ready',
    intro:
      'Your assessment is finished and your personalized recommendation set is ready for review.',
    content: `
      <p style="margin:0;font-size:14px;line-height:1.8;color:${theme.muted};">Hi ${escapeHtml(
        name
      )},</p>
      <div style="margin-top:18px;display:grid;gap:12px;">
        ${chip(`Top match: <strong style="color:${theme.text};">${escapeHtml(careerName || 'Your recommendation')}</strong>`, 'blue')}
        ${chip('Open your dashboard to export a PDF summary, review skill gaps, and continue your roadmap.', 'white')}
      </div>`,
    note: 'Your career recommendations are personalized based on the assessment you completed today.',
  });

  return sendEmail({ to, subject, text, html });
};

export const sendRoadmapMilestoneEmail = async ({
  to,
  name,
  career,
  milestone,
  progress,
}) => {
  const subject = `Milestone completed for ${career}`;
  const text = `Hi ${name},\n\nYou completed ${milestone} in your ${career} roadmap. Your progress is now ${progress}%. Keep going and unlock the next stage.`;
  const html = shell({
    label: 'Milestone unlocked',
    title: 'Progress just leveled up',
    intro:
      'Every completed milestone pushes your roadmap forward. You just crossed a major step in your journey.',
    content: `
      <p style="margin:0;font-size:14px;line-height:1.8;color:${theme.muted};">Hi ${escapeHtml(
        name
      )},</p>
      <div style="margin-top:18px;border-radius:22px;padding:18px 20px;background:linear-gradient(135deg, rgba(79,110,247,0.18), rgba(34,211,238,0.12));border:1px solid rgba(148,163,184,0.18);">
        <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(229,238,251,0.54);margin-bottom:10px;">Completed milestone</div>
        <div style="font-size:22px;font-weight:800;line-height:1.3;color:#ffffff;">${escapeHtml(milestone)}</div>
        <div style="margin-top:8px;font-size:14px;line-height:1.8;color:${theme.muted};">Career: <strong style="color:${theme.text};">${escapeHtml(career)}</strong></div>
        <div style="margin-top:10px;font-size:14px;line-height:1.8;color:${theme.muted};">Current progress: <strong style="color:${theme.text};">${escapeHtml(String(progress))}%</strong></div>
      </div>
      <div style="margin-top:16px;padding:14px 16px;border-radius:18px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:${theme.text};font-size:14px;line-height:1.7;">Keep the momentum going to unlock the next phase and raise your completion badge.</div>`,
    note: 'Small wins add up quickly. Keep moving and your streak will turn into a stronger badge.',
  });

  return sendEmail({ to, subject, text, html });
};

export const sendWeeklyCheckInEmail = async ({ to, name, career }) => {
  const subject = 'Your CareerAI weekly check-in';
  const text = `Hi ${name},\n\nHere is your weekly check-in${career ? ` for ${career}` : ''}. Open CareerAI to continue your roadmap, complete milestones, and stay on track.`;
  const html = shell({
    label: 'Weekly check-in',
    title: 'Your weekly career pulse',
    intro:
      'A small reminder to keep your roadmap alive, your progress visible, and your next milestone within reach.',
    content: `
      <p style="margin:0;font-size:14px;line-height:1.8;color:${theme.muted};">Hi ${escapeHtml(
        name
      )},</p>
      <div style="margin-top:18px;display:grid;gap:12px;">
        ${chip(career ? `Focus area: <strong style="color:${theme.text};">${escapeHtml(career)}</strong>` : 'Open your dashboard to review your active roadmap.', 'blue')}
        ${chip('Complete a milestone, review your skill gap, or export your progress as PDF.', 'white')}
      </div>`,
    note: 'You can adjust reminders and pace inside your roadmap as you progress.',
  });

  return sendEmail({ to, subject, text, html });
};
