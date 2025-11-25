import { Request, Response } from 'express';
import {
    findAllActiveProducts,
    findProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../models/ProductModel';

/**
 * Lấy tất cả sản phẩm
 */
export async function getAllProducts(req: Request, res: Response) {
    try {
        const products = await findAllActiveProducts();
        return res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy danh sách sản phẩm"
        });
    }
}

/**
 * Lấy sản phẩm theo ID
 */
export async function getProductById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        if (!id) return res.status(400).json({ success: false, message: "ID không hợp lệ" });

        const product = await findProductById(id);
        if (!product) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });

        return res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
}

/**
 * Tạo sản phẩm mới
 */
export async function createNewProduct(req: Request, res: Response) {
    try {
        const { name, price, quantity, description, rating } = req.body;

        if (!name || !price) {
            return res.status(400).json({ success: false, message: "Thiếu dữ liệu bắt buộc" });
        }

        const result = await createProduct({ name, price, quantity, description, rating });

        return res.status(201).json({
            success: true,
            message: "Tạo sản phẩm thành công",
            product_id: result.insertId
        });

    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ success: false, message: "Lỗi server khi tạo sản phẩm" });
    }
}

/**
 * Cập nhật sản phẩm
 */
export async function updateProductById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const data = req.body;

        const updated = await updateProduct(id, data);

        if (updated.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm để cập nhật" });
        }

        return res.status(200).json({
            success: true,
            message: "Cập nhật sản phẩm thành công"
        });

    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ success: false, message: "Lỗi server khi cập nhật" });
    }
}

/**
 * Xóa sản phẩm
 */
export async function deleteProductById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        const deleted = await deleteProduct(id);
        if (deleted.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm để xóa" });
        }

        return res.status(200).json({
            success: true,
            message: "Xóa sản phẩm thành công"
        });

    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ success: false, message: "Lỗi server khi xóa sản phẩm" });
    }
}
