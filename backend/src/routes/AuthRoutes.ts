// backend/src/routes/AuthRoutes.ts
import { Router, RequestHandler } from 'express';
import { register, login } from '../controllers/AuthController';
import * as AccountModel from '../models/AccountModel';
import passport from '../config/passport'; // Import Passport đã cấu hình
import { signToken } from '../utils/jwt';

const router = Router();

router.post('/register', register as RequestHandler); // POST /api/auth/register
router.post('/login', login as RequestHandler); // POST /api/auth/login
// --- Google Auth ---

// 1. Chuyển hướng người dùng đến Google để xác thực
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2. Google gọi lại (Callback) sau khi user xác thực
router.get(
    '/google/callback', 
    passport.authenticate('google', { failureRedirect: '/api/auth/google/failure', session: false }),
    (req, res) => {
        // Sau khi xác thực thành công, req.user chứa thông tin user từ Passport Strategy
        const user = req.user as AccountModel.Account;
        
        // Tạo JWT và trả về cho Frontend
        const token = signToken(user.account_id, user.role);
        
        // Thường là chuyển hướng người dùng trở lại trang chủ Frontend với token trong URL/Cookie
        // Ví dụ: http://localhost:3000/auth/success?token=...
        res.redirect(`http://localhost:3000/auth/success?token=${token}`);
    }
);

// 3. Route xử lý thất bại (Tạm thời)
router.get('/google/failure', (req, res) => {
    res.status(401).json({ success: false, message: 'Đăng nhập Google thất bại.' });
});


export default router;