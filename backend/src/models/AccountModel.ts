// backend/src/models/AccountModel.ts
import db from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import bcrypt from 'bcryptjs';
// Cần cài đặt type cho bcryptjs: npm install -D @types/bcryptjs

// Định nghĩa kiểu dữ liệu cơ bản cho Account
export interface Account extends RowDataPacket {
    account_id: number;
    name: string;
    email: string;
    password?: string; // Mật khẩu là optional khi lấy ra
    phone_number: string;
    role: 'user' | 'staff' | 'admin';
}

/**
 * Tìm tài khoản bằng Email để đăng nhập/kiểm tra tồn tại
 */
export async function findByEmail(email: string): Promise<Account | undefined> {
    const query = 'SELECT * FROM accounts WHERE email = ?';
    // Sử dụng db.query() cho SELECT
    const [rows] = await db.query<Account[]>(query, [email]); 
    return rows[0];
}

/**
 * Tạo tài khoản mới (Đăng ký)
 */
export async function createAccount(
    name: string, 
    email: string, 
    passwordText: string, 
    phoneNumber: string
): Promise<{ accountId: number }> {
    // 1. Hash mật khẩu trước khi lưu (Sử dụng salt 10 rounds)
    const hashedPassword = await bcrypt.hash(passwordText, 10);
    const role = 'user'; // Mặc định role là 'user'

    const query = `
        INSERT INTO accounts (name, email, password, phone_number, role)
        VALUES (?, ?, ?, ?, ?)
    `;
    
    // Sử dụng db.execute() cho INSERT/UPDATE/DELETE
    const [result] = await db.execute(query, [name, email, hashedPassword, phoneNumber, role]);
    
    const header = result as ResultSetHeader; 
    
    return { accountId: header.insertId };
}