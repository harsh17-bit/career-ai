import express from 'express';
import protect from '../middlewares/auth.js';
import {
  analyzeSavedResume,
  createResume,
  getResume,
  listResumes,
} from '../controllers/resumeController.js';

const router = express.Router();

router.use(protect);
router.get('/', listResumes);
router.post('/', createResume);
router.get('/:id', getResume);
router.post('/:id/analyze', analyzeSavedResume);

export default router;
