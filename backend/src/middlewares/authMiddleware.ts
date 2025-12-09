import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Account } from '../models/AccountModel';

dotenv.config();
const JWT_SECRET: string = process.env.JWT_SECRET || 'secret'; // Fallback nếu env lỗi

// 1️⃣ Mở rộng Request object chuẩn xác
declare module 'express' {
    interface Request {
        user?: { 
            id: number; 
            role: Account['role']; 
            name?: string; // 👈 QUAN TRỌNG: Thêm dấu ? để name là optional (có thể ko có)
        };
    }
}

/**
 * Middleware: Bảo vệ route, yêu cầu JWT hợp lệ
 */
export const protect = (req: Request, res: Response, next: NextFunction): void => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        res.status(401).json({ message: 'Không có token, ủy quyền thất bại.' });
        return; // 👈 Return void
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: Account['role']; name?: string };
        req.user = { id: decoded.id, role: decoded.role, name: decoded.name }; 
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
};

/**
 * Middleware: Kiểm tra quyền (Authorization)
 */
export const authorizeRoles = (...requiredRoles: Account['role'][]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !requiredRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Quyền truy cập bị từ chối. Chỉ có: ${requiredRoles.join(', ')} mới được phép.`
            });
        }
        next();
    };
};

/**
 * Middleware: Xác thực tùy chọn (Optional Auth)
 * Dùng cho các route công khai nhưng cần biết user là ai nếu họ có đăng nhập (VD: Checkout)
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            req.user = { id: decoded.id, role: decoded.role, name: decoded.name };
        } catch (error) {
            req.user = undefined;
        }
    }
    next();
};