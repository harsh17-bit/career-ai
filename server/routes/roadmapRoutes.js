import express from 'express';
import { generateRoadmap, getUserRoadmaps, toggleMilestone } from '../controllers/roadmapController.js';
import protect from '../middlewares/auth.js';

const router = express.Router();

router.post('/generate', protect, generateRoadmap);
router.get('/me', protect, getUserRoadmaps);
router.put('/milestone', protect, toggleMilestone);

export default router;
