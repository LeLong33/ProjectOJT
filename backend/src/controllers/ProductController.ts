import { Request, Response } from 'express';
import {
    createProduct,
    addProductImage,
    updateProduct,
    deleteProduct,
    findAllProducts,
    findProductById,
    CreateProductData,
    CreateProductImageData
} from '../models/ProductModel';

// Tạo sản phẩm mới
export async function createNewProduct(req: Request, res: Response) {
    try {
        const { name, code, price, quantity, brand_id, category_id, description, short_description, image_url } = req.body;

        if (!name || !code || !price || !brand_id || !category_id) {
            return res.status(400).json({ success: false, message: 'Thiếu dữ liệu bắt buộc (Tên, Mã, Giá, ID thương hiệu, ID danh mục).' });
        }

        const productData: CreateProductData = { name, code, price, quantity, brand_id, category_id, description, short_description };
        const productId = await createProduct(productData);

        if (image_url) {
            const imageData: CreateProductImageData = { product_id: productId, url: image_url, is_main: true };
            await addProductImage(imageData);
        }

        return res.status(201).json({ success: true, message: 'Tạo sản phẩm thành công', product_id: productId });
    } catch (error: any) {
        console.error('Create product error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi tạo sản phẩm' });
    }
}

// Cập nhật sản phẩm
export async function updateExistingProduct(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const { name, price, quantity, brand_id, category_id, description, short_description, image_url } = req.body;

        const updateData: Partial<CreateProductData> = { name, price, quantity, brand_id, category_id, description, short_description };
        const affectedRows = await updateProduct(id, updateData);

        if (image_url) {
            const imageData: CreateProductImageData = { product_id: id, url: image_url, is_main: true };
            await addProductImage(imageData);
        }

        return res.json({ success: true, message: 'Cập nhật sản phẩm thành công', affectedRows });
    } catch (error: any) {
        console.error('Update product error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật sản phẩm' });
    }
}

// Xóa sản phẩm
export async function deleteExistingProduct(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const affectedRows = await deleteProduct(id);
        return res.json({ success: true, message: 'Xóa sản phẩm thành công', affectedRows });
    } catch (error: any) {
        console.error('Delete product error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi xóa sản phẩm' });
    }
}

// Lấy tất cả sản phẩm
export async function getAllProducts(req: Request, res: Response) {
    try {
        const products = await findAllProducts();
        return res.json({ success: true, data: products });
    } catch (error: any) {
        console.error('Get products error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi lấy sản phẩm' });
    }
}

// Lấy chi tiết sản phẩm
export async function getProductById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const product = await findProductById(id);
        if (!product) return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
        return res.json({ success: true, data: product });
    } catch (error: any) {
        console.error('Get product by id error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi lấy sản phẩm' });
    }
}
