import express from 'express';
import { recommendCareers } from '../controllers/careerController.js';
import protect from '../middlewares/auth.js';

const router = express.Router();

router.post('/recommend', protect, recommendCareers);

export default router;
