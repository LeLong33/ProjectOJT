import { Router, RequestHandler } from 'express';
import * as CategoryController from '../controllers/CategoryController';
// Import các Middleware bảo mật
import { protect, authorizeRoles } from '../middlewares/authMiddleware'; 

const router = Router();

// ---------------------------------------------------------------------
// PUBLIC ROUTES: /api/categories
// ---------------------------------------------------------------------

/**
 * [GET] /api/categories - Lấy tất cả danh mục (Public)
 */
router.get('/', CategoryController.getCategories as RequestHandler);


// ---------------------------------------------------------------------
// ADMIN/STAFF ROUTES: /api/categories/admin/...
// ---------------------------------------------------------------------

// Middleware cho Admin và Staff (thao tác CRUD cơ bản)
const adminOrStaff = [protect, authorizeRoles('admin', 'staff')] as RequestHandler[];
// Middleware chỉ dành cho Admin (thao tác xóa)
const onlyAdmin = [protect, authorizeRoles('admin')] as RequestHandler[];


/**
 * [POST] /api/categories/admin - Tạo danh mục mới
 */
router.post('/admin', adminOrStaff, CategoryController.addCategory as RequestHandler);

/**
 * [PUT] /api/categories/admin/:id - Cập nhật danh mục
 */
router.put('/admin/:id', adminOrStaff, CategoryController.updateCategory as RequestHandler);

/**
 * [DELETE] /api/categories/admin/:id - Xóa danh mục (Chỉ Admin)
 */
router.delete('/admin/:id', onlyAdmin, CategoryController.deleteCategory as RequestHandler);


export default router;