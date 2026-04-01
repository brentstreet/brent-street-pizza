import { Router } from 'express';
import { getUIContent } from '../controllers/contentController';

const router = Router();

router.get('/', getUIContent);

export default router;
