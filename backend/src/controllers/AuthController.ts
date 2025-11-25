// backend/src/controllers/AuthController.ts
import { Request, Response } from 'express';
import * as AccountModel from '../models/AccountModel';
import { signToken } from '../utils/jwt';
import bcrypt from 'bcryptjs';

/**
 * [POST] /api/auth/register - Đăng ký tài khoản mới
 */
export const register = async (req: Request, res: Response) => {
    const { name, email, password, phoneNumber } = req.body;

    // 1. Kiểm tra input cơ bản
    if (!name || !email || !password || !phoneNumber) {
        res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường.' });
        return;
    }
    if (password.length < 6) {
        res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
        return;
    }

    try {
        // 2. Kiểm tra email đã tồn tại chưa
        const existingAccount = await AccountModel.findByEmail(email);
        if (existingAccount) {
            res.status(409).json({ message: 'Email này đã được sử dụng.' });
            return;
        }

        // 3. Tạo tài khoản
        const { accountId } = await AccountModel.createAccount(name, email, password, phoneNumber);

        // 4. Tạo token JWT
        const token = signToken(accountId, 'user');

        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công!',
            token,
            user: { accountId, name, email, role: 'user' }
        });
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ trong quá trình đăng ký.' });
    }
};

/**
 * [POST] /api/auth/login - Đăng nhập
 */
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // 1. Kiểm tra input
    if (!email || !password) {
        res.status(400).json({ message: 'Vui lòng nhập Email và Mật khẩu.' });
        return;
    }

    try {
        // 2. Tìm tài khoản
        const account = await AccountModel.findByEmail(email);

        // 3. Kiểm tra sự tồn tại và mật khẩu
        // bcrypt.compare() so sánh mật khẩu plain text với hash trong DB
        if (!account || !(await bcrypt.compare(password, account.password || ''))) {
            res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
            return;
        }

        // 4. Tạo token JWT
        const token = signToken(account.account_id, account.role);

        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công!',
            token,
            user: {
                accountId: account.account_id,
                name: account.name,
                email: account.email,
                role: account.role
            }
        });
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ trong quá trình đăng nhập.' });
    }
};