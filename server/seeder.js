import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Roadmap from './models/Roadmap.js';
import ChatHistory from './models/ChatHistory.js';

dotenv.config();

const DEMO_EMAIL = 'demo@careerai.dev';

const demoProfile = {
  educationLevel: 'Undergraduate',
  stream: 'Computer Science',
  marks: 82,
  subjects: ['Data Structures', 'Algorithms', 'Databases', 'Web Development'],
  interests: ['AI', 'Backend Development', 'Problem Solving'],
  skills: ['JavaScript', 'Node.js', 'React', 'MongoDB'],
  goals: 'Get an internship as a Software Engineer in the next 6 months.',
};

const demoRecommendations = [
  {
    name: 'Backend Developer',
    matchPercentage: 92,
    reason: 'Strong programming base and clear interest in scalable systems.',
    requiredSkills: ['Node.js', 'SQL/NoSQL', 'REST APIs', 'System Design'],
    salaryRange: '$65,000 - $110,000',
    futureScope: 'High demand across startups and enterprise teams.',
    difficulty: 'Medium',
    nextStep: 'Build 2 API-focused projects with testing and deployment.',
  },
  {
    name: 'AI Engineer',
    matchPercentage: 86,
    reason: 'Interest in AI and good foundation in logic and programming.',
    requiredSkills: [
      'Python',
      'Machine Learning',
      'Data Processing',
      'MLOps Basics',
    ],
    salaryRange: '$80,000 - $140,000',
    futureScope: 'Rapidly growing roles in AI product companies.',
    difficulty: 'High',
    nextStep: 'Start with ML fundamentals and one end-to-end AI project.',
  },
  {
    name: 'Full Stack Developer',
    matchPercentage: 84,
    reason: 'Existing frontend and backend skills support full-cycle delivery.',
    requiredSkills: ['React', 'Node.js', 'Databases', 'Cloud Deployment'],
    salaryRange: '$70,000 - $120,000',
    futureScope: 'Consistent opportunities in product and consulting teams.',
    difficulty: 'Medium',
    nextStep: 'Create and deploy a complete production-style web app.',
  },
];

const buildRoadmap = (userId) => ({
  user: userId,
  career: 'Backend Developer',
  level: 'beginner',
  totalDuration: '6 months',
  overallProgress: 25,
  phases: [
    {
      title: 'Phase 1: Foundations',
      duration: '4 weeks',
      difficulty: 'beginner',
      topics: ['JavaScript Deep Dive', 'Node.js Fundamentals', 'Git Workflows'],
      resources: [
        {
          title: 'Node.js Official Docs',
          type: 'doc',
          url: 'https://nodejs.org/en/docs',
        },
        {
          title: 'JavaScript.info',
          type: 'course',
          url: 'https://javascript.info/',
        },
      ],
      completed: true,
    },
    {
      title: 'Phase 2: API Development',
      duration: '6 weeks',
      difficulty: 'medium',
      topics: [
        'Express.js',
        'Auth with JWT',
        'Input Validation',
        'Error Handling',
      ],
      resources: [
        {
          title: 'Express Guide',
          type: 'doc',
          url: 'https://expressjs.com/en/guide/routing.html',
        },
        {
          title: 'REST API Design Best Practices',
          type: 'video',
          url: 'https://www.youtube.com/watch?v=lsMQRaeKNDk',
        },
      ],
      completed: false,
    },
    {
      title: 'Phase 3: Data and Deployment',
      duration: '8 weeks',
      difficulty: 'medium',
      topics: ['MongoDB Modeling', 'Testing APIs', 'Deployment', 'Monitoring'],
      resources: [
        {
          title: 'MongoDB Manual',
          type: 'doc',
          url: 'https://www.mongodb.com/docs/manual/',
        },
        {
          title: 'Jest Documentation',
          type: 'doc',
          url: 'https://jestjs.io/docs/getting-started',
        },
      ],
      completed: false,
    },
  ],
});

const buildChatHistory = (userId) => ({
  user: userId,
  messages: [
    {
      role: 'user',
      content:
        'Hi, I want to become a backend developer. Where should I start?',
    },
    {
      role: 'assistant',
      content:
        'Great choice. Start with core JavaScript, then Node.js and Express. Build one small API project first.',
    },
    {
      role: 'user',
      content: 'How many hours per day should I study?',
    },
    {
      role: 'assistant',
      content:
        'Aim for 2 focused hours daily. Keep one day weekly for revision and project improvements.',
    },
  ],
});

const importData = async () => {
  await connectDB();

  try {
    await ChatHistory.deleteMany({});
    await Roadmap.deleteMany({});
    await User.deleteMany({ email: DEMO_EMAIL });

    const user = await User.create({
      name: 'Demo Student',
      email: DEMO_EMAIL,
      password: 'demo1234',
      profile: demoProfile,
      assessmentCompleted: true,
      careerRecommendations: demoRecommendations,
    });

    await Roadmap.create(buildRoadmap(user._id));
    await ChatHistory.create(buildChatHistory(user._id));

    console.log('Seed import successful.');
    console.log('Demo login:');
    console.log('Email:', DEMO_EMAIL);
    console.log('Password:', 'demo1234');
  } catch (error) {
    console.error('Seed import failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

const destroyData = async () => {
  await connectDB();

  try {
    await ChatHistory.deleteMany({});
    await Roadmap.deleteMany({});
    await User.deleteMany({ email: DEMO_EMAIL });
    console.log('Seed destroy successful.');
  } catch (error) {
    console.error('Seed destroy failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

if (process.argv.includes('--destroy')) {
  destroyData();
} else {
  importData();
}
