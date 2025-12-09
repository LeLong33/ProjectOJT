import { Router, RequestHandler } from 'express';
// Import các hàm Controller với tên đã chuẩn hóa
import * as ProductController from '../controllers/ProductController';
// Import các Middleware Auth đã định nghĩa
import { protect, authorizeRoles } from '../middlewares/authMiddleware'; 

const router = Router();

// Định nghĩa Middleware Stacks (Mảng các Middleware)

// [1] Cần quyền Admin hoặc Staff
const adminOrStaff = [
    protect, 
    authorizeRoles('admin', 'staff')
] as RequestHandler[];

// [2] Chỉ cần quyền Admin
const onlyAdmin = [
    protect, 
    authorizeRoles('admin')
] as RequestHandler[];


// ---------------------------------------------------------------------
// 1. PUBLIC ROUTES (GET - Xem Sản phẩm)
// ---------------------------------------------------------------------

// Lấy tất cả sản phẩm
router.get('/', ProductController.getAllProducts as RequestHandler);

// Lấy sản phẩm theo ID 
router.get('/:id', ProductController.getProductById as RequestHandler);


// ---------------------------------------------------------------------
// 2. PROTECTED ROUTES (Admin/Staff)
// ---------------------------------------------------------------------

/**
 * [POST] /api/products - Tạo sản phẩm mới
 */
router.post('/', 
    ...adminOrStaff, // ⬅️ Sử dụng mảng Middleware (Đã tối ưu)
    ProductController.createNewProduct as RequestHandler
);

/**
 * [PUT] /api/products/:id - Cập nhật sản phẩm
 */
router.put('/:id', 
    ...adminOrStaff, // ADMIN/STAFF
    ProductController.updateExistingProduct as RequestHandler
);

/**
 * [DELETE] /api/products/:id - Xóa sản phẩm (Soft Delete)
 */
router.delete('/:id', 
    ...onlyAdmin, // CHỈ ADMIN
    ProductController.deleteExistingProduct as RequestHandler
);

export default router;