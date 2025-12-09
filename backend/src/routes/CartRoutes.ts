import { Router } from 'express';
import * as CartController from '../controllers/CartController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Yêu cầu đăng nhập cho tất cả route giỏ hàng
router.use(authMiddleware);

// Thêm sản phẩm vào giỏ hàng
router.post('/add', CartController.addToCart);

// Lấy giỏ hàng
router.get('/', CartController.getCart);

// Cập nhật số lượng sản phẩm
router.put('/:cartItemId', CartController.updateCartItem);

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/:cartItemId', CartController.removeFromCart);

// Xóa toàn bộ giỏ hàng
router.delete('/clear/all', CartController.clearCart);

export default router;

// import cartRoutes from './routes/CartRoutes';

// ...existing code...

// Register routes
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/cart', cartRoutes);  // ⬅ Thêm route giỏ hàng

// ...existing code...