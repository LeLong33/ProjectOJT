// backend/src/routes/AuthRoutes.ts
import { Router, RequestHandler } from 'express';
import { register, login } from '../controllers/AuthController';

const router = Router();

router.post('/register', register as RequestHandler); // POST /api/auth/register
router.post('/login', login as RequestHandler); // POST /api/auth/login

export default router;