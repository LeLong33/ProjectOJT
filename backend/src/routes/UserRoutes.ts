import { Router, RequestHandler } from 'express';
import { 
    getUserProfile, 
    getMyAddresses, 
    addAddress, 
    updateMyAddress 
} from '../controllers/UserController';
import { protect } from '../middlewares/authMiddleware'; // Import middleware bảo vệ

const router = Router();

// Áp dụng middleware 'protect' cho tất cả các route trong file này.
// Điều này có nghĩa là bất kỳ request nào đến /api/users đều phải có JWT hợp lệ.
router.use(protect as RequestHandler); 

// ---------------------------------------------------------------------
// 1. PROFILE (Hồ sơ cá nhân)
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
// Tùy chọn: Thêm các chức năng khác (ví dụ: Thay đổi mật khẩu)
// ---------------------------------------------------------------------
// router.put('/change-password', changePassword as RequestHandler);


export default router;