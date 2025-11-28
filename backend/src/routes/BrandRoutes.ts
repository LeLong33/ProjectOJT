import { Router, RequestHandler } from 'express';
import * as BrandController from '../controllers/BrandController';
// Import các Middleware bảo mật
import { protect, authorizeRoles } from '../middlewares/authMiddleware'; 

const router = Router();

// ---------------------------------------------------------------------
// PUBLIC ROUTES: /api/brands
// ---------------------------------------------------------------------

/**
 * [GET] /api/brands - Lấy tất cả thương hiệu (Public)
 */
router.get('/', BrandController.getBrands as RequestHandler);


// ---------------------------------------------------------------------
// ADMIN/STAFF ROUTES: /api/brands/admin/...
// ---------------------------------------------------------------------

// Middleware cho Admin và Staff (thao tác CRUD cơ bản)
const adminOrStaff = [protect, authorizeRoles('admin', 'staff')] as RequestHandler[];
// Middleware chỉ dành cho Admin (thao tác xóa)
const onlyAdmin = [protect, authorizeRoles('admin')] as RequestHandler[];


/**
 * [POST] /api/brands/admin - Tạo thương hiệu mới
 */
router.post('/admin', adminOrStaff, BrandController.createBrand as RequestHandler);

/**
 * [PUT] /api/brands/admin/:id - Cập nhật thương hiệu
 */
router.put('/admin/:id', adminOrStaff, BrandController.updateBrand as RequestHandler);

/**
 * [DELETE] /api/brands/admin/:id - Xóa thương hiệu (Chỉ Admin)
 */
router.delete('/admin/:id', onlyAdmin, BrandController.deleteBrand as RequestHandler);


export default router;