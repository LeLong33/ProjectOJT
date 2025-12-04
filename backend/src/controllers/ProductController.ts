import { Request, Response } from 'express';
import * as ProductModel from '../models/ProductModel'; // Import toàn bộ module để tránh trùng tên

// ---------------------------------------------------------------------
// PUBLIC READ OPERATIONS (GET)
// ---------------------------------------------------------------------

/**
 * [GET] /api/products - Lấy tất cả sản phẩm
 */
export async function getAllProducts(req: Request, res: Response) {
    try {
        const products = await ProductModel.findAllActiveProducts();
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
 * [GET] /api/products/:id - Lấy sản phẩm theo ID (Đổi tên hàm)
 */
export async function getProductDetails(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) return res.status(400).json({ success: false, message: "ID sản phẩm không hợp lệ" });

        const product = await ProductModel.findProductById(id);
        if (!product) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });

        return res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
}

// ---------------------------------------------------------------------
// ADMIN/STAFF CRUD OPERATIONS
// ---------------------------------------------------------------------

/**
 * [POST] /api/products/admin - Tạo sản phẩm mới
 */
export async function createNewProduct(req: Request, res: Response) {
    try {
        // Lấy các trường bắt buộc, bao gồm cả các khóa ngoại
        const { name, price, quantity, description, rating, code, brand_id, category_id, short_description } = req.body;

        // ⚠️ KIỂM TRA DỮ LIỆU BẮT BUỘC
        if (!name || !price || !code || !brand_id || !category_id) {
            return res.status(400).json({ success: false, message: "Thiếu dữ liệu bắt buộc (Tên, Giá, Mã, ID Thương hiệu, ID Danh mục)." });
        }
        
        // Chuẩn bị dữ liệu cho Model
        const productData: ProductModel.CreateProductData = {
            name,
            price,
            quantity: quantity ?? 0,
            description,
            short_description,
            code,
            brand_id,
            category_id
        } as ProductModel.CreateProductData;

        const insertId = await ProductModel.createProduct(productData);

        return res.status(201).json({
            success: true,
            message: "Tạo sản phẩm thành công",
            product_id: insertId
        });

    } catch (error: any) {
        console.error("Error creating product:", error);
        if (error.code === 'ER_DUP_ENTRY') {
             return res.status(409).json({ success: false, message: 'Mã sản phẩm (code) đã tồn tại.' });
        }
        return res.status(500).json({ success: false, message: "Lỗi server khi tạo sản phẩm" });
    }
}

/**
 * [PUT] /api/products/admin/:id - Cập nhật sản phẩm (Đổi tên hàm)
 */
export async function updateExistingProduct(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;

        if (isNaN(id) || id <= 0) return res.status(400).json({ success: false, message: "ID sản phẩm không hợp lệ" });
        
        // Ngăn cập nhật trường code/id qua API PUT (trừ khi có logic riêng)
        if (data.code || data.product_id) {
             return res.status(400).json({ success: false, message: "Không thể thay đổi Mã sản phẩm hoặc ID." });
        }

        const affectedRows = await ProductModel.updateProduct(id, data as Partial<ProductModel.Product>);

        if (affectedRows === 0) {
            // Check nếu không có dòng nào bị ảnh hưởng, có thể là do không có gì thay đổi, hoặc ID sai.
            const product = await ProductModel.findProductById(id);
            if (!product) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm để cập nhật" });
            return res.status(200).json({ success: true, message: "Không có dữ liệu nào được thay đổi." });
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
 * [DELETE] /api/products/admin/:id - Xóa sản phẩm (Soft Delete)
 */
export async function deleteProduct(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id) || id <= 0) return res.status(400).json({ success: false, message: "ID sản phẩm không hợp lệ" });

        const affectedRows = await ProductModel.deleteProduct(id);
        if (affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm để xóa" });
        }

        return res.status(200).json({
            success: true,
            message: "Xóa sản phẩm thành công (Soft Deleted)"
        });

    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ success: false, message: "Lỗi server khi xóa sản phẩm" });
    }
}
