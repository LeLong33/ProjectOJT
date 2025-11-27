import { Router, RequestHandler } from 'express';
import {
    getAllProducts,
    getProductById,
    createNewProduct,
    updateProductById,
    deleteProductById
} from '../controllers/ProductController';

const router = Router();

// CRUD
router.get('/', getAllProducts as RequestHandler);          // GET all
router.get('/:id', getProductById as RequestHandler);        // GET by ID
router.post('/', createNewProduct as RequestHandler);        // CREATE
router.put('/:id', updateProductById as RequestHandler);     // UPDATE
router.delete('/:id', deleteProductById as RequestHandler);  // DELETE

export default router;
