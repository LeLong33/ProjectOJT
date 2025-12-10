import express from 'express';
import * as OrderController from '../controllers/OrderController';
import { protect, optionalAuth } from '../middlewares/authMiddleware'; 

const router = express.Router();

// Sử dụng 'as any' cho middleware nếu TypeScript vẫn báo lỗi overload
// Điều này đảm bảo code chạy được mà không bị chặn bởi lỗi type
router.get('/', protect as any, OrderController.getMyOrders);
router.get('/:id', protect as any, OrderController.getOrderDetail);

// Tạo đơn hàng
router.post('/', optionalAuth as any, OrderController.createOrder);

router.get('/admin/all', protect as any, OrderController.getAllOrders);
router.put('/admin/:orderId/status', protect as any, OrderController.updateOrderStatus);
router.delete('/admin/:orderId', protect as any, OrderController.deleteOrder);

export default router;