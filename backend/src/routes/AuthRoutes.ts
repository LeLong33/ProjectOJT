import { Router, RequestHandler } from 'express';
import { register, login } from '../controllers/AuthController';
import * as AccountModel from '../models/AccountModel';
import passport from '../config/passport'; 
import { signToken } from '../utils/jwt';

// Định nghĩa Router
const router = Router();

// --- 1. Local Auth ---
router.post('/register', register as RequestHandler);
router.post('/login', login as RequestHandler);

// --- 2. Google Auth ---

// Khởi tạo Google Auth
router.get(
    '/google', 
    passport.authenticate('google', { 
        scope: ['profile', 'email'], 
        session: false // Luôn đặt session: false cho API
    })
);

// Xử lý Google Callback
router.get(
    '/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: '/api/auth/google/failure', 
        session: false 
    }),
    (req, res) => {
        // 👇 FIX LỖI TẠI ĐÂY:
        // Dùng 'as unknown' để tránh lỗi xung đột kiểu dữ liệu giữa JWT User và Database Account
        const user = req.user as unknown as AccountModel.Account;
        
        if (!user) {
             res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/failure`);
             return;
        }

        // Tạo JWT (Lưu ý: dùng user.account_id thay vì user.id vì đây là object Account từ DB)
        const token = signToken(user.account_id, user.role);
        
        // Chuyển hướng về Frontend với token
        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

        // Chuyển hướng thành công
        res.redirect(`${FRONTEND_URL}/auth/success?token=${token}`);
    }
);

// Route xử lý thất bại
router.get('/google/failure', (req, res) => {
    // Chuyển hướng thất bại về Frontend để hiển thị thông báo lỗi
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${FRONTEND_URL}/auth/failure?error=Đăng nhập Google thất bại.`);
});

export default router;