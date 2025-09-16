import {Router,} from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { fetchContacts,addContact, recentContacts } from '../controllers/contactsController';

const router = Router();
router.get('/', verifyToken, fetchContacts);
router.post('/', verifyToken, addContact);
router.get('/recent', verifyToken ,recentContacts)


export default router;