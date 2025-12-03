import { Router } from 'express';
import { getProducts } from '../controllers/ProductController'; 

const router = Router();

// Endpoint GET để lấy tất cả sản phẩm
// Khi được gắn, nó sẽ trở thành GET /api/products/
router.get('/', getProducts); 

export default router;