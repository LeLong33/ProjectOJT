import { Router } from 'express';
import {
    getAllProducts,
    getProductById,
    createNewProduct,
    updateProductById,
    deleteProductById
} from '../controllers/ProductController';

const router = Router();

// CRUD
router.get('/', getAllProducts);          // GET all
router.get('/:id', getProductById);        // GET by ID
router.post('/', createNewProduct);        // CREATE
router.put('/:id', updateProductById);     // UPDATE
router.delete('/:id', deleteProductById);  // DELETE

export default router;
