import express from 'express';
import {
  getConversations,
  getMessagesWithUser,
  sendMessage,
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/conversations', getConversations);
router.get('/:userId', getMessagesWithUser);
router.post('/', sendMessage);

export default router;
