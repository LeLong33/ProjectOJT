import { Router } from "express";
import {
    getAllProducts,
    getProductById,
    createNewProduct,
    updateProductById,
    deleteProductById
} from "../controllers/ProductController";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createNewProduct);
router.put("/:id", updateProductById);
router.delete("/:id", deleteProductById);

export default router;