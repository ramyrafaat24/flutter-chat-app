import {Router,} from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { checkOrCreateConversation, fetchAllConversationsByUserId, getDailyQuestion } from '../controllers/conversationsController';

const router = Router();
router.get('/', verifyToken, fetchAllConversationsByUserId);
router.post('/chech-or-create', verifyToken, checkOrCreateConversation);
router.post('/:id/daily-question', verifyToken, getDailyQuestion);
export default router;