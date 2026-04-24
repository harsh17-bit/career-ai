import Roadmap from '../models/Roadmap.js';
import generateRoadmapAI from '../ai/chains/roadmapChain.js';
import { sendRoadmapMilestoneEmail } from '../utils/mailer.js';

// @desc    Generate roadmap for a career
// @route   POST /api/roadmap/generate
export const generateRoadmap = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { career, level } = req.body;

    if (!career) {
      return res.status(400).json({ message: 'Career field is required' });
    }

    const profileContext = [
      `Education: ${req.user?.profile?.educationLevel || 'N/A'}`,
      `Stream: ${req.user?.profile?.stream || 'N/A'}`,
      `Marks: ${typeof req.user?.profile?.marks === 'number' ? req.user.profile.marks : 'N/A'}`,
      `Subjects: ${(req.user?.profile?.subjects || []).join(', ') || 'N/A'}`,
      `Interests: ${(req.user?.profile?.interests || []).join(', ') || 'N/A'}`,
      `Skills: ${(req.user?.profile?.skills || []).join(', ') || 'N/A'}`,
      `Goals: ${req.user?.profile?.goals || 'N/A'}`,
    ].join('\n');

    const roadmapData = await generateRoadmapAI(
      career,
      level || 'beginner',
      profileContext
    );

    // Delete existing roadmap for this user/career combo
    await Roadmap.deleteMany({ user: req.user._id, career });

    const roadmap = await Roadmap.create({
      user: req.user._id,
      career: roadmapData.career,
      level: roadmapData.level,
      totalDuration: roadmapData.totalDuration,
      phases: roadmapData.phases.map((phase) => ({
        ...phase,
        completed: false,
      })),
    });

    res.status(201).json(roadmap);
  } catch (error) {
    console.error('Roadmap generation error:', error);
    res
      .status(500)
      .json({ message: 'Failed to generate roadmap. Please try again.' });
  }
};

// @desc    Get user's roadmaps
// @route   GET /api/roadmap/me
export const getUserRoadmaps = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const roadmaps = await Roadmap.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(roadmaps);
  } catch (error) {
    console.error('Get roadmaps error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle milestone completion
// @route   PUT /api/roadmap/milestone
export const toggleMilestone = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { roadmapId, phaseIndex } = req.body;

    const roadmap = await Roadmap.findOne({
      _id: roadmapId,
      user: req.user._id,
    });
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    if (phaseIndex < 0 || phaseIndex >= roadmap.phases.length) {
      return res.status(400).json({ message: 'Invalid phase index' });
    }

    roadmap.phases[phaseIndex].completed =
      !roadmap.phases[phaseIndex].completed;
    roadmap.phases[phaseIndex].completedAt = roadmap.phases[phaseIndex]
      .completed
      ? new Date()
      : null;

    // Recalculate progress
    const completedCount = roadmap.phases.filter((p) => p.completed).length;
    roadmap.overallProgress = Math.round(
      (completedCount / roadmap.phases.length) * 100
    );

    await roadmap.save();

    if (roadmap.phases[phaseIndex].completed) {
      try {
        await sendRoadmapMilestoneEmail({
          to: req.user.email,
          name: req.user.name,
          career: roadmap.career,
          milestone: roadmap.phases[phaseIndex].title,
          progress: roadmap.overallProgress,
        });
      } catch (emailError) {
        console.error('Milestone email failed:', emailError.message);
      }
    }

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
