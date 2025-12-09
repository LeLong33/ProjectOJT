import { Request, Response } from 'express';
import * as AddressModel from '../models/AddressModel';
import * as AccountModel from '../models/AccountModel';
import bcrypt from 'bcryptjs';



export const getUserProfile = async (req: Request, res: Response) => {
    try {
        // req.user chứa thông tin từ JWT
        const user = req.user;
        
        if (!user) {
            return res.status(401).json({ message: 'Người dùng chưa được xác thực.' });
        }


        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('Lỗi khi lấy hồ sơ:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ.' });
    }
};


export const getMyAddresses = async (req: Request, res: Response) => {
    try {
        const accountId = req.user!.id; // Dùng dấu '!' vì đã qua protect middleware
        const addresses = await AddressModel.findAddressesByAccountId(accountId);
        
        res.status(200).json({ success: true, data: addresses });
    } catch (error) {
        console.error('Lỗi khi lấy địa chỉ:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ.' });
    }
};

/**
 * [POST] /api/users/addresses - Thêm địa chỉ mới
 */
export const addAddress = async (req: Request, res: Response) => {
    const { recipient_name, phone_number, address, district, city, country, is_default = false } = req.body;
    
    if (!recipient_name || !phone_number || !address || !district || !city || !country) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin địa chỉ.' });
    }

    try {
        const accountId = req.user!.id; 
        
        const newAddressData = {
            account_id: accountId,
            recipient_name, phone_number, address, district, city, country,
            is_default: Boolean(is_default)
        };

        const newAddressId = await AddressModel.createAddress(newAddressData);

        res.status(201).json({ success: true, message: 'Địa chỉ đã được thêm thành công.', addressId: newAddressId });
    } catch (error) {
        console.error('Lỗi khi thêm địa chỉ:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ.' });
    }
};

/**
 * [PUT] /api/users/addresses/:id - Cập nhật địa chỉ
 */
export const updateMyAddress = async (req: Request, res: Response) => {
    const addressId = parseInt(req.params.id);
    const updateData = req.body;

    if (isNaN(addressId)) {
        return res.status(400).json({ success: false, message: 'ID địa chỉ không hợp lệ.' });
    }

    try {
        const accountId = req.user!.id;
        const affectedRows = await AddressModel.updateAddress(addressId, accountId, updateData);

        if (affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy địa chỉ hoặc bạn không có quyền cập nhật.' });
        }

        res.status(200).json({ success: true, message: 'Địa chỉ đã được cập nhật thành công.' });
    } catch (error) {
        console.error(`Lỗi khi cập nhật địa chỉ ID ${addressId}:`, error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ.' });
    }

    
};

export const getAllAccounts = async (req: Request, res: Response) => {
    try {
        const accounts = await AccountModel.findAllAccounts();
        res.status(200).json({ success: true, data: accounts });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tài khoản:', error);
        res.status(500).json({ success: false, message: 'Lỗi server nội bộ.' });
    }
};

// ⬅️ THÊM: Admin Cập nhật Role người dùng
export const updateAccountRole = async (req: Request, res: Response) => {
    const targetAccountId = parseInt(req.params.id);
    const { role: newRole } = req.body;
    
    // Ngăn Admin tự giáng cấp/nâng cấp bản thân
    if (targetAccountId === req.user?.id) {
        return res.status(400).json({ success: false, message: 'Bạn không thể thay đổi vai trò của tài khoản của chính mình.' });
    }
    
    // Kiểm tra tính hợp lệ của role
    if (!['user', 'staff', 'admin'].includes(newRole)) {
        return res.status(400).json({ success: false, message: 'Vai trò không hợp lệ.' });
    }

    try {
        const affectedRows = await AccountModel.updateAccountRole(targetAccountId, newRole);

        if (affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản để cập nhật.' });
        }

        res.status(200).json({ success: true, message: `Vai trò của user ID ${targetAccountId} đã được cập nhật thành ${newRole}.` });
    } catch (error) {
        console.error('Lỗi khi cập nhật vai trò:', error);
        res.status(500).json({ success: false, message: 'Lỗi server nội bộ.' });
    }
};

/**
 * [PUT] /api/users/profile - Cập nhật thông tin hồ sơ
 */
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const accountId = req.user!.id;
        const allowed: any = {};
        const { name, phone_number, date_of_birth, avatar_url } = req.body;
        if (name !== undefined) allowed.name = name;
        if (phone_number !== undefined) allowed.phone_number = phone_number;
        if (date_of_birth !== undefined) allowed.date_of_birth = date_of_birth;
        if (avatar_url !== undefined) allowed.avatar_url = avatar_url;

        const affected = await AccountModel.updateProfile(accountId, allowed);
        if (affected === 0) {
            return res.status(400).json({ success: false, message: 'Không có thay đổi hoặc cập nhật thất bại.' });
        }

        // Return updated profile
        const updated = await AccountModel.findById(accountId);
        return res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.error('Lỗi khi cập nhật profile:', error);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ.' });
    }
}

/**
 * [PUT] /api/users/change-password - đổi mật khẩu
 */
export const changePassword = async (req: Request, res: Response) => {
    try {
        const accountId = req.user!.id;
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới.' });
        }

        const ok = await AccountModel.changePassword(accountId, currentPassword, newPassword);
        if (!ok) return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không đúng.' });

        return res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công.' });
    } catch (error) {
        console.error('Lỗi khi đổi mật khẩu:', error);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ.' });
    }
}