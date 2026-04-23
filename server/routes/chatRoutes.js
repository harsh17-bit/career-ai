import express from 'express';
import { sendMessage, getChatHistory } from '../controllers/chatController.js';
import protect from '../middlewares/auth.js';

const router = express.Router();

router.post('/send', protect, sendMessage);
router.get('/history', protect, getChatHistory);

export default router;
