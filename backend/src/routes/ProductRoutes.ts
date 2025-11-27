// backend/src/routes/ProductRoutes.ts
import { Router, RequestHandler } from 'express';
import * as ProductController from '../controllers/ProductController';
import { protect } from '../middlewares/authMiddleware';
import { allowProductCRUD } from '../middlewares/ProductMiddleware';

const router = Router();

// Lấy tất cả sản phẩm
router.get('/', ProductController.getAllProducts as RequestHandler);

// Lấy sản phẩm theo ID
router.get('/:id', ProductController.getProductById as RequestHandler);

// ---------------- PROTECTED ROUTES ----------------
// Tạo sản phẩm mới (chỉ admin hoặc staff)
router.post('/', protect as RequestHandler,
    allowProductCRUD as RequestHandler,
    ProductController.createNewProduct as RequestHandler
);

// Cập nhật sản phẩm theo ID
router.put('/:id', protect as RequestHandler,
    allowProductCRUD as RequestHandler,
    ProductController.updateProductById as RequestHandler
);

// Xóa sản phẩm theo ID
router.delete('/:id', protect as RequestHandler,
    allowProductCRUD as RequestHandler,
    ProductController.deleteProductById as RequestHandler
);

export default router;
