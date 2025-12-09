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
    // Return extended profile fields if present in the table
    const query = `SELECT account_id, name, email, phone_number, role,
        date_of_birth, avatar_url
        FROM accounts WHERE account_id = ?`;
    const [rows] = await db.query<any[]>(query, [id]);
    return rows[0] as Account | undefined;
}

/**
 * Cập nhật thông tin hồ sơ của user (các trường editable)
 */
export async function updateProfile(accountId: number, updateData: Partial<Account & { date_of_birth?: string; avatar_url?: string }>): Promise<number> {
    // Ensure only existing columns are updated (protect against missing migrations)
    const candidateFields = Object.keys(updateData).filter(k => updateData[k as keyof typeof updateData] !== undefined);
    if (candidateFields.length === 0) return 0;

    // Query information_schema to find which of these columns actually exist
    const placeholders = candidateFields.map(() => '?').join(',');
    const colQuery = `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'accounts' AND COLUMN_NAME IN (${placeholders})`;
    const [colsRows] = await db.query<any[]>(colQuery, candidateFields);
    const existingCols = new Set(colsRows.map(r => r.COLUMN_NAME));

    const fields = candidateFields.filter(f => existingCols.has(f));
    if (fields.length === 0) return 0;

    const values = fields.map(k => (updateData as any)[k]);
    const setClauses = fields.map(f => `${f} = ?`).join(', ');
    const query = `UPDATE accounts SET ${setClauses} WHERE account_id = ?`;
    const [result] = await db.execute(query, [...values, accountId]);
    return (result as ResultSetHeader).affectedRows;
}

/**
 * Thay đổi mật khẩu: kiểm tra mật khẩu hiện tại, sau đó cập nhật
 */
export async function changePassword(accountId: number, currentPassword: string, newPassword: string): Promise<boolean> {
    const query = 'SELECT password FROM accounts WHERE account_id = ?';
    const [rows] = await db.query<any[]>(query, [accountId]);
    const row = rows[0];
    if (!row || !row.password) return false;
    const match = await bcrypt.compare(currentPassword, row.password);
    if (!match) return false;
    const hashed = await bcrypt.hash(newPassword, 10);
    const updateQ = 'UPDATE accounts SET password = ? WHERE account_id = ?';
    await db.execute(updateQ, [hashed, accountId]);
    return true;
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
export async function findAllAccounts(): Promise<Account[]> {
    const query = 'SELECT account_id, name, email, phone_number, role FROM accounts ORDER BY account_id ASC';
    const [rows] = await db.query<Account[]>(query);
    return rows;
}

// ⬅️ THÊM: Cập nhật vai trò (Chỉ Admin)
export async function updateAccountRole(accountId: number, newRole: Account['role']): Promise<number> {
    const query = 'UPDATE accounts SET role = ? WHERE account_id = ?';
    const [result] = await db.execute(query, [newRole, accountId]);
    return (result as ResultSetHeader).affectedRows;
}