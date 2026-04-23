import User from '../models/User.js';
import getCareerRecommendations from '../ai/chains/careerChain.js';
import { sendAssessmentCompletedEmail } from '../utils/mailer.js';

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

    const recommendations = await getCareerRecommendations({
      educationLevel,
      stream,
      marks,
      subjects,
      interests,
      skills,
      goals,
    });

    // Save to user profile
    const user = await User.findById(req.user._id);
    user.profile = {
      educationLevel,
      stream,
      marks,
      subjects,
      interests,
      skills,
      goals,
    };
    user.careerRecommendations = recommendations;
    user.assessmentCompleted = true;
    await user.save();

    try {
      await sendAssessmentCompletedEmail({
        to: user.email,
        name: user.name,
        careerName: recommendations?.[0]?.name,
      });
    } catch (emailError) {
      console.error('Assessment completion email failed:', emailError.message);
    }

    res.json({ careers: recommendations });
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
