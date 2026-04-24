import express from 'express';
import { recommendCareers } from '../controllers/careerController.js';
import protect from '../middlewares/auth.js';
import validate, { assessmentSchema } from '../middlewares/validate.js';

const router = express.Router();

router.post(
  '/recommend',
  protect,
  validate(assessmentSchema),
  recommendCareers
);

export default router;
