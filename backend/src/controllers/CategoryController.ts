import { Request, Response } from 'express';
import * as CategoryModel from '../models/CategoryModel';

// ---------------------------------------------------------------------
// PUBLIC OPERATION
// ---------------------------------------------------------------------

/**
 * [GET] /api/categories - Lấy tất cả danh mục (Public)
 */
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await CategoryModel.findAllCategories();
        return res.status(200).json({ success: true, data: categories });
    } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh mục.' });
    }
};

// ---------------------------------------------------------------------
// ADMIN/STAFF OPERATIONS
// ---------------------------------------------------------------------

/**
 * [POST] /api/categories/admin - Tạo danh mục mới (Admin/Staff)
 */
export const addCategory = async (req: Request, res: Response) => {
    const { name, parent_id } = req.body;
    
    // 1. Kiểm tra dữ liệu bắt buộc
    if (!name || name.trim() === '') {
        return res.status(400).json({ success: false, message: 'Tên danh mục không được trống.' });
    }

    try {
        // 2. Chuẩn hóa parent_id (null nếu không có)
        const parentId = parent_id ? parseInt(parent_id) : null;
        
        const newId = await CategoryModel.createCategory(name, parentId);
        
        return res.status(201).json({ 
            success: true, 
            message: 'Thêm danh mục thành công.', 
            category_id: newId 
        });
    } catch (error) {
        console.error('Lỗi khi thêm danh mục:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi tạo danh mục.' });
    }
};

/**
 * [PUT] /api/categories/admin/:id - Cập nhật danh mục (Admin/Staff)
 */
export const updateCategory = async (req: Request, res: Response) => {
    const categoryId = parseInt(req.params.id);
    const { name, parent_id } = req.body;

    if (isNaN(categoryId) || categoryId <= 0 || !name) {
        return res.status(400).json({ success: false, message: 'ID hoặc Tên danh mục không hợp lệ.' });
    }

    try {
        const parentId = parent_id ? parseInt(parent_id) : null;
        
        const affectedRows = await CategoryModel.updateCategory(categoryId, name, parentId);
        
        if (affectedRows === 0) {
            // Kiểm tra xem danh mục có tồn tại không
            const existing = (await CategoryModel.findAllCategories()).find(c => c.category_id === categoryId);
            if (!existing) {
                 return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục để cập nhật.' });
            }
             return res.status(200).json({ success: true, message: 'Không có dữ liệu nào được thay đổi.' });
        }
        
        return res.status(200).json({ success: true, message: 'Danh mục đã được cập nhật.' });
    } catch (error) {
        console.error('Lỗi cập nhật danh mục:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật danh mục.' });
    }
};

/**
 * [DELETE] /api/categories/admin/:id - Xóa danh mục (Chỉ Admin)
 */
export const deleteCategory = async (req: Request, res: Response) => {
    const categoryId = parseInt(req.params.id);
    
    if (isNaN(categoryId) || categoryId <= 0) {
        return res.status(400).json({ success: false, message: 'ID danh mục không hợp lệ.' });
    }

    try {
        const affectedRows = await CategoryModel.deleteCategory(categoryId);
        
        if (affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục để xóa.' });
        }
        
        return res.status(200).json({ success: true, message: 'Danh mục đã được xóa thành công.' });
    } catch (error: any) {
        // Xử lý lỗi FOREIGN KEY (thường là ER_ROW_IS_REFERENCED_2)
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             return res.status(400).json({ success: false, message: 'Không thể xóa: Danh mục này còn sản phẩm hoặc danh mục con tham chiếu.' });
        }
        console.error('Lỗi khi xóa danh mục:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi xóa danh mục.' });
    }
};