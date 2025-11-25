// backend/src/controllers/UserController.ts
import { Request, Response } from 'express';
import * as AddressModel from '../models/AddressModel';
import * as AccountModel from '../models/AccountModel';

// LƯU Ý: req.user được gắn từ authMiddleware (bước tiếp theo sẽ code)

/**
 * [GET] /api/users/profile - Lấy thông tin hồ sơ người dùng
 */
export const getUserProfile = async (req: Request, res: Response) => {
    try {
        // req.user chứa thông tin từ JWT
        const user = req.user;
        
        if (!user) {
            return res.status(401).json({ message: 'Người dùng chưa được xác thực.' });
        }

        // Tùy chọn: Lấy thêm chi tiết từ DB nếu cần (ví dụ: thông tin địa chỉ đầu tiên)

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('Lỗi khi lấy hồ sơ:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ.' });
    }
};

/**
 * [GET] /api/users/addresses - Lấy tất cả địa chỉ của người dùng
 */
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