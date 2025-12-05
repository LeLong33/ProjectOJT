import { Router, RequestHandler } from 'express';
import { 
    getUserProfile, 
    getMyAddresses, 
    addAddress, 
    updateMyAddress,
    getAllAccounts, // ⬅️ THÊM: Lấy danh sách tài khoản
    updateAccountRole  // ⬅️ THÊM: Cập nhật Role
} from '../controllers/UserController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware'; // Import middleware bảo vệ

const router = Router();

// Áp dụng middleware 'protect' cho tất cả các route trong file này.
// Đảm bảo mọi truy cập vào /api/users đều phải có JWT hợp lệ.
router.use(protect as RequestHandler); 

// ---------------------------------------------------------------------
// 1. PUBLIC USER ROUTES (User có thể truy cập)
// ---------------------------------------------------------------------

/**
 * [GET] /api/users/profile - Lấy thông tin hồ sơ
 */
router.get('/profile', getUserProfile as RequestHandler);


// ---------------------------------------------------------------------
// 2. ADDRESS MANAGEMENT (Quản lý Địa chỉ Giao hàng)
// ---------------------------------------------------------------------

// [GET] /api/users/addresses (Lấy tất cả)
// [POST] /api/users/addresses (Thêm mới)
router.route('/addresses')
    .get(getMyAddresses as RequestHandler) 
    .post(addAddress as RequestHandler);   

// [PUT] /api/users/addresses/:id (Cập nhật địa chỉ cụ thể)
router.route('/addresses/:id')
    .put(updateMyAddress as RequestHandler); 
    
// ---------------------------------------------------------------------
// 3. ADMIN USER MANAGEMENT (Chỉ Admin)
// ---------------------------------------------------------------------

/**
 * [GET] /api/users/admin - Lấy tất cả người dùng (ADMIN ONLY)
 */
router.get(
    '/admin', 
    protect as RequestHandler, 
    authorizeRoles('admin') as RequestHandler, // ⬅️ CHỈ ADMIN MỚI ĐƯỢC XEM
    getAllAccounts as RequestHandler
);

/**
 * [PUT] /api/users/admin/:id/role - Cập nhật vai trò (ADMIN ONLY)
 */
router.put(
    '/admin/:id/role', 
    protect as RequestHandler, 
    authorizeRoles('admin') as RequestHandler, // ⬅️ CHỈ ADMIN MỚI ĐƯỢC THAY ĐỔI ROLE
    updateAccountRole as RequestHandler
);

export default router;