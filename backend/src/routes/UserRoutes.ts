import { Router, RequestHandler } from 'express';
import { 
    getUserProfile, 
    getMyAddresses, 
    addAddress, 
    updateMyAddress,
    deleteAddress,        // ✅ THÊM: Xóa địa chỉ
    setDefaultAddress,    // ✅ THÊM: Đặt địa chỉ mặc định
    updateProfile,
    changePassword,
    getAllAccounts,
    updateAccountRole
} from '../controllers/UserController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

// Áp dụng middleware 'protect' cho tất cả các route trong file này
router.use(protect as RequestHandler); 

// ---------------------------------------------------------------------
// 1. PROFILE ROUTES
// ---------------------------------------------------------------------

/**
 * [GET] /api/users/profile - Lấy thông tin hồ sơ
 * [PUT] /api/users/profile - Cập nhật hồ sơ
 */
router.route('/profile')
    .get(getUserProfile as RequestHandler)
    .put(updateProfile as RequestHandler);

/**
 * [PUT] /api/users/change-password - Đổi mật khẩu
 */
router.put('/change-password', changePassword as RequestHandler);

// ---------------------------------------------------------------------
// 2. ADDRESS MANAGEMENT (Quản lý Địa chỉ)
// ---------------------------------------------------------------------

/**
 * [GET] /api/users/addresses - Lấy tất cả địa chỉ
 * [POST] /api/users/addresses - Thêm địa chỉ mới
 */
router.route('/addresses')
    .get(getMyAddresses as RequestHandler) 
    .post(addAddress as RequestHandler);

/**
 * [PUT] /api/users/addresses/:id - Cập nhật địa chỉ
 * [DELETE] /api/users/addresses/:id - Xóa địa chỉ ✅ QUAN TRỌNG
 */
router.route('/addresses/:id')
    .put(updateMyAddress as RequestHandler)
    .delete(deleteAddress as RequestHandler); // ✅ THÊM DELETE

/**
 * [PUT] /api/users/addresses/:id/default - Đặt địa chỉ làm mặc định ✅ QUAN TRỌNG
 */
router.put('/addresses/:id/default', setDefaultAddress as RequestHandler);

// ---------------------------------------------------------------------
// 3. ADMIN USER MANAGEMENT (Chỉ Admin)
// ---------------------------------------------------------------------

/**
 * [GET] /api/users/admin - Lấy tất cả người dùng (ADMIN ONLY)
 */
router.get(
    '/admin', 
    authorizeRoles('admin') as RequestHandler,
    getAllAccounts as RequestHandler
);

/**
 * [PUT] /api/users/admin/:id/role - Cập nhật vai trò (ADMIN ONLY)
 */
router.put(
    '/admin/:id/role', 
    authorizeRoles('admin') as RequestHandler,
    updateAccountRole as RequestHandler
);

export default router;