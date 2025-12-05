import { Request, Response } from 'express';
import * as BrandModel from '../models/BrandModel';

// ---------------------------------------------------------------------
// PUBLIC OPERATION
// ---------------------------------------------------------------------

/**
 * [GET] /api/brands - Lấy tất cả thương hiệu (Public)
 */
export const getBrands = async (req: Request, res: Response) => {
    try {
        const brands = await BrandModel.findAllBrands();
        return res.status(200).json({ success: true, data: brands });
    } catch (error) {
        console.error('Lỗi khi lấy thương hiệu:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi lấy thương hiệu.' });
    }
};

// ---------------------------------------------------------------------
// ADMIN/STAFF OPERATIONS
// ---------------------------------------------------------------------

/**
 * [POST] /api/brands/admin - Tạo thương hiệu mới (Admin/Staff)
 */
export const createBrand = async (req: Request, res: Response) => {
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
        return res.status(400).json({ success: false, message: 'Tên thương hiệu không được trống.' });
    }

    try {
        const newId = await BrandModel.createBrand(name);
        
        return res.status(201).json({ 
            success: true, 
            message: 'Thêm thương hiệu thành công.', 
            brand_id: newId 
        });
    } catch (error) {
        console.error('Lỗi khi tạo thương hiệu:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi tạo thương hiệu.' });
    }
};

/**
 * [PUT] /api/brands/admin/:id - Cập nhật thương hiệu (Admin/Staff)
 */
export const updateBrand = async (req: Request, res: Response) => {
    const brandId = parseInt(req.params.id);
    const { name } = req.body;

    if (isNaN(brandId) || brandId <= 0 || !name) {
        return res.status(400).json({ success: false, message: 'ID hoặc Tên thương hiệu không hợp lệ.' });
    }

    try {
        const affectedRows = await BrandModel.updateBrand(brandId, name);
        
        if (affectedRows === 0) {
             return res.status(404).json({ success: false, message: 'Không tìm thấy thương hiệu để cập nhật.' });
        }
        
        return res.status(200).json({ success: true, message: 'Thương hiệu đã được cập nhật.' });
    } catch (error) {
        console.error('Lỗi cập nhật thương hiệu:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật thương hiệu.' });
    }
};

/**
 * [DELETE] /api/brands/admin/:id - Xóa thương hiệu (Chỉ Admin)
 */
export const deleteBrand = async (req: Request, res: Response) => {
    const brandId = parseInt(req.params.id);
    
    if (isNaN(brandId) || brandId <= 0) {
        return res.status(400).json({ success: false, message: 'ID thương hiệu không hợp lệ.' });
    }

    try {
        const affectedRows = await BrandModel.deleteBrand(brandId);
        
        if (affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy thương hiệu để xóa.' });
        }
        
        return res.status(200).json({ success: true, message: 'Thương hiệu đã được xóa thành công.' });
    } catch (error: any) {
        // Xử lý lỗi FOREIGN KEY (ER_ROW_IS_REFERENCED_2)
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             return res.status(400).json({ success: false, message: 'Không thể xóa: Có sản phẩm đang sử dụng thương hiệu này.' });
        }
        console.error('Lỗi khi xóa thương hiệu:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi xóa thương hiệu.' });
    }
};