import 'dotenv/config';
import { sendWelcomeEmail } from './utils/mailer.js';

async function run() {
  const to = process.argv[2] || process.env.TEST_EMAIL;
  const name = process.argv[3] || 'Test User';

  if (!to) {
    console.error('Usage: node sendWelcomeTest.js <recipient@example.com> [Name]');
    process.exit(1);
  }

  try {
    await sendWelcomeEmail({ to, name });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error('Failed to send email:', err);
    process.exit(2);
  }
}

run();
