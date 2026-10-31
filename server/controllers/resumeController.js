import Resume from '../models/Resume.js';
import analyzeResume from '../ai/chains/resumeChain.js';

const clean = (value, maxLength) =>
  typeof value === 'string'
    ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, maxLength)
    : '';

export const listResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .select('-content')
      .sort({ updatedAt: -1 })
      .lean();
    res.json(resumes);
  } catch (error) {
    console.error('List resumes error:', error);
    res.status(500).json({ message: 'Failed to load resumes.' });
  }
};

export const createResume = async (req, res) => {
  try {
    const title = clean(req.body.title, 120);
    const content = clean(req.body.content, 30000);
    if (!title || content.length < 40) {
      return res.status(400).json({
        message: 'Add a title and at least 40 characters of resume content.',
      });
    }

    const resume = await Resume.create({ user: req.user._id, title, content });
    res.status(201).json(resume);
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ message: 'Failed to save resume.' });
  }
};

export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).lean();
    if (!resume) return res.status(404).json({ message: 'Resume not found.' });
    res.json(resume);
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ message: 'Failed to load resume.' });
  }
};

export const analyzeSavedResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!resume) return res.status(404).json({ message: 'Resume not found.' });

    const analysis = await analyzeResume(resume.content);
    resume.analysis = { ...analysis, analyzedAt: new Date() };
    await resume.save();
    res.json(resume);
  } catch (error) {
    console.error('Analyze resume error:', error);
    res.status(500).json({ message: 'Failed to analyze resume. Please retry.' });
  }
};
