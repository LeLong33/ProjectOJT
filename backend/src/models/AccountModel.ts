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

// Thêm hàm tìm kiếm theo ID (cần cho deserializeUser)
export async function findById(id: number): Promise<Account | undefined> {
    const query = 'SELECT account_id, name, email, phone_number, role FROM accounts WHERE account_id = ?';
    const [rows] = await db.query<Account[]>(query, [id]);
    return rows[0];
}

/**
 * Tìm kiếm user bằng email, nếu không tồn tại thì tạo mới user Google
 */
export async function findOrCreateGoogleUser(email: string, name: string): Promise<Account> {
    let account = await findByEmail(email);

    if (account) {
        return account;
    }

    // Tài khoản chưa tồn tại, tạo mới
    const role = 'user';
    // Mật khẩu để null/undefined vì user này dùng Google. 
    // Luôn luôn nên có một trường trong DB để đánh dấu user loại gì (local, google, facebook)
    
    // Ghi chú: Để DB không báo lỗi NOT NULL cho password, chúng ta mặc định
    // đặt một password ngẫu nhiên HOẶC thay đổi cột password thành NULLABLE.
    // Giả định bạn đã đặt cột password là NULLABLE hoặc chúng ta sẽ dùng password tạm.

    const tempPassword = Math.random().toString(36).slice(-8); // Mật khẩu tạm ngẫu nhiên
const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const query = `
        INSERT INTO accounts (name, email, password, phone_number, role)
        VALUES (?, ?, ?, NULL, ?)
    `; // Giả định phone_number là NULLABLE

    const [result] = await db.execute(query, [name, email, hashedPassword, role]);
    const accountId = (result as ResultSetHeader).insertId;
    
    // Lấy lại thông tin user vừa tạo
    account = (await findById(accountId)) as Account;
    
    return account;
}
