// backend/src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Account } from '../models/AccountModel'; // Sẽ tạo AccountModel ở bước tiếp theo

dotenv.config();
// Sử dụng JWT_SECRET từ .env (đã fix lỗi)
const JWT_SECRET: string = process.env.JWT_SECRET!; 

// Mở rộng Request object của Express để chứa thông tin người dùng
declare module 'express' {
    interface Request {
        user?: { 
            id: number; 
            role: Account['role']; 
            name: string; // Tên được thêm vào payload, tùy chọn
        };
    }
}

/**
 * Middleware: Bảo vệ route, yêu cầu JWT hợp lệ
 */
export const protect = (req: Request, res: Response, next: NextFunction) => {
    let token;

    // 1. Kiểm tra Token trong header (Bearer Token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Không có token, ủy quyền thất bại.' });
    }

    try {
        // 2. Xác thực Token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: Account['role']; name: string };

        // 3. Gắn thông tin user vào request để các controller sử dụng
        req.user = decoded; 
        
        next();
    } catch (error) {
        console.error('Lỗi xác thực token:', error);
        res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
};

/**
 * Middleware: Kiểm tra quyền (Authorization)
 * @param requiredRoles Mảng các role được phép truy cập (e.g., 'admin', 'staff')
 */
export const authorizeRoles = (...requiredRoles: Account['role'][]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Kiểm tra xem người dùng đã được xác thực và có role cần thiết không
        if (!req.user || !requiredRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Quyền truy cập bị từ chối. Chỉ có: ${requiredRoles.join(', ')} mới được phép.`
            });
        }
        next();
    };
};