import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Lấy biến môi trường. Chúng ta sử dụng toán tử '!' để thông báo cho TypeScript 
// rằng các giá trị này chắc chắn sẽ tồn tại (vì đã kiểm tra trong .env).
const JWT_SECRET: string = process.env.JWT_SECRET!; 
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN!;

/**
 * Tạo JWT cho người dùng
 * @param accountId ID tài khoản
 * @param role Vai trò (user, staff, admin)
 * @returns Token JWT
 */
export const signToken = (accountId: number, role: string): string => {
    
    // Payload (Tham số thứ nhất)
    const payload = { id: accountId, role };
    
    // Options (Tham số thứ ba)
    const options: SignOptions = {
        // *** KHẮC PHỤC LỖI: Ép kiểu giá trị string thành 'any' ***
        // Điều này đảm bảo TypeScript ngừng kiểm tra kiểu phức tạp và chấp nhận chuỗi "7d".
        expiresIn: JWT_EXPIRES_IN as any, 
    };
    
    // Gọi hàm jwt.sign() với 3 tham số.
    return jwt.sign(
        payload,
        JWT_SECRET,
        options
    );
};