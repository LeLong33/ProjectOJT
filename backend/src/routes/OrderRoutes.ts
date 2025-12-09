import express from 'express';
import * as OrderController from '../controllers/OrderController';
import { protect, optionalAuth } from '../middlewares/authMiddleware'; 

const router = express.Router();

// Lấy danh sách & chi tiết (Bắt buộc đăng nhập)
router.get('/', protect, OrderController.getMyOrders);
router.get('/:id', protect, OrderController.getOrderDetail);

// Tạo đơn hàng (Đăng nhập hoặc Không đăng nhập đều được)
router.post('/', optionalAuth, OrderController.createOrder);

export default router