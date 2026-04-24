import User from '../models/User.js';
import getCareerRecommendations from '../ai/chains/careerChain.js';
import { sendAssessmentCompletedEmail } from '../utils/mailer.js';

const sanitizeText = (value, maxLength = 300) => {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
};

const sanitizeList = (value, maxItems = 10, maxLength = 60) => {
  if (!Array.isArray(value)) return [];

  const unique = new Set();
  for (const item of value) {
    const cleaned = sanitizeText(item, maxLength);
    if (cleaned) unique.add(cleaned);
    if (unique.size >= maxItems) break;
  }

  return [...unique];
};

const sanitizeRecommendations = (recommendations) => {
  if (!Array.isArray(recommendations)) return [];

  return recommendations.slice(0, 5).map((career) => ({
    name: sanitizeText(career?.name, 120),
    matchPercentage: Math.max(
      0,
      Math.min(100, Number(career?.matchPercentage) || 0)
    ),
    reason: sanitizeText(career?.reason, 400),
    requiredSkills: sanitizeList(career?.requiredSkills, 8, 50),
    salaryRange: sanitizeText(career?.salaryRange, 80),
    futureScope: sanitizeText(career?.futureScope, 220),
    difficulty: sanitizeText(career?.difficulty, 20),
    nextStep: sanitizeText(career?.nextStep, 260),
  }));
};

// @desc    Get career recommendations
// @route   POST /api/career/recommend
export const recommendCareers = async (req, res) => {
  try {
    const {
      educationLevel,
      stream,
      marks,
      subjects,
      interests,
      skills,
      goals,
    } = req.body;

    const sanitizedProfile = {
      educationLevel: sanitizeText(educationLevel, 80),
      stream: sanitizeText(stream, 80),
      marks: Math.max(0, Math.min(100, Number(marks) || 0)),
      subjects: sanitizeList(subjects, 12, 60),
      interests: sanitizeList(interests, 12, 60),
      skills: sanitizeList(skills, 12, 60),
      goals: sanitizeText(goals, 300),
    };

    const recommendations = await getCareerRecommendations(sanitizedProfile);
    const purifiedRecommendations = sanitizeRecommendations(recommendations);

    // Save to user profile
    const user = await User.findById(req.user._id);
    user.profile = sanitizedProfile;
    user.careerRecommendations = purifiedRecommendations;
    user.assessmentCompleted = true;
    await user.save();

    try {
      await sendAssessmentCompletedEmail({
        to: user.email,
        name: user.name,
        careerName: purifiedRecommendations?.[0]?.name,
      });
    } catch (emailError) {
      console.error('Assessment completion email failed:', emailError.message);
    }

    res.json({ careers: purifiedRecommendations });
  } catch (error) {
    console.error('Career recommendation error:', error);

    if (
      (error?.message || '').includes(
        'Gemini is busy across all configured models'
      )
    ) {
      return res.status(503).json({
        message:
          'AI is experiencing high demand right now. Please retry in a few seconds.',
      });
    }

    res.status(500).json({
      message: 'Failed to generate recommendations. Please try again.',
    });
  }
};
