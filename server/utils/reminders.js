import User from '../models/User.js';
import Roadmap from '../models/Roadmap.js';
import { sendWeeklyCheckInEmail } from './mailer.js';

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

export const sendWeeklyCheckIns = async () => {
  const users = await User.find({
    isEmailVerified: true,
    assessmentCompleted: true,
  });

  for (const user of users) {
    const lastSent = user.lastWeeklyCheckInAt
      ? new Date(user.lastWeeklyCheckInAt).getTime()
      : 0;
    if (lastSent && Date.now() - lastSent < WEEK_IN_MS) {
      continue;
    }

    const latestRoadmap = await Roadmap.findOne({ user: user._id })
      .sort({ updatedAt: -1 })
      .lean();

    try {
      await sendWeeklyCheckInEmail({
        to: user.email,
        name: user.name,
        career: latestRoadmap?.career,
      });
      user.lastWeeklyCheckInAt = new Date();
      await user.save();
    } catch (error) {
      console.error(
        `Weekly check-in email failed for ${user.email}:`,
        error.message
      );
    }
  }
};
