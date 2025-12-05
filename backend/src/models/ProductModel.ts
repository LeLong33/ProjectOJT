import db from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Định nghĩa kiểu dữ liệu hoàn chỉnh cho Sản phẩm
export interface Product extends RowDataPacket {
    product_id: number;
    name: string;
    code: string; 
    price: number;
    quantity: number;
    brand_id: number; 
    category_id: number; 
    description: string;
    short_description: string; 
    is_active: boolean; 
    rating: number;
    numReviews: number;
    createdAt: Date;
    image_url?: string; 
}

// Định nghĩa kiểu cho ảnh sản phẩm
export interface ProductImage extends RowDataPacket {
    image_id: number;
    product_id: number;
    url: string;
    is_main: boolean;
}

// Kiểu dữ liệu tối thiểu cho việc tạo sản phẩm
export interface CreateProductData {
    name: string;
    code: string; 
    price: number;
    quantity: number;
    brand_id: number; 
    category_id: number; 
    description?: string;
    short_description?: string;
}

// ---------------------------------------------------------------------
// PUBLIC READ FUNCTIONS
// ---------------------------------------------------------------------

/**
 * Lấy tất cả sản phẩm đang hoạt động (kèm ảnh chính và thông số kỹ thuật)
 */
export async function findAllActiveProducts(): Promise<Product[]> {
    const query = `
        SELECT 
            p.product_id, 
            p.name, 
            p.code, 
            p.price, 
            p.quantity, 
            p.short_description, 
            p.rating, 
            p.numReviews,
            p.brand_id,
            p.category_id,
            pi.url AS image_url,
            pd.CPU,
            pd.RAM,
            pd.Storage,
            pd.GPU,
            pd.Display,
            pd.OS
        FROM products p
        LEFT JOIN productImages pi 
            ON p.product_id = pi.product_id AND pi.is_main = TRUE
        LEFT JOIN productDetails pd
            ON p.product_id = pd.product_id
        WHERE p.is_active = 1
        ORDER BY p.createdAt DESC
    `;
    const [rows] = await db.query<Product[]>(query);
    return rows;
}

/**
 * Lấy thông tin chi tiết của một sản phẩm (Có JOIN chi tiết kỹ thuật)
 */
export async function findProductById(id: number): Promise<Product | undefined> {
    const query = `
        SELECT p.*, pd.CPU, pd.GPU, pd.RAM, pd.Storage, pd.Display, pd.OS
        FROM products p
        LEFT JOIN productDetails pd ON p.product_id = pd.product_id
        WHERE p.product_id = ? AND p.is_active = 1
    `;
    const [rows] = await db.query<Product[]>(query, [id]);
    return rows[0];
}

/**
 * Lấy tất cả ảnh (Chính & Phụ) của một sản phẩm (Dùng cho Product Detail)
 */
export async function findAllImagesByProductId(productId: number): Promise<ProductImage[]> {
    const query = `
        SELECT image_id, url, is_main
        FROM productImages
        WHERE product_id = ?
        ORDER BY is_main DESC, image_id ASC
    `;
    const [rows] = await db.query<ProductImage[]>(query, [productId]);
    return rows;
}


// ---------------------------------------------------------------------
// ADMIN/STAFF CRUD (Giữ nguyên logic tạo/cập nhật/xóa)
// ---------------------------------------------------------------------

/**
 * Tạo sản phẩm mới
 */
export async function createProduct(product: CreateProductData): Promise<number> {
    const query = `
        INSERT INTO products (name, code, price, quantity, brand_id, category_id, description, short_description, rating, numReviews, is_active, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 1, NOW())
    `;

    const values = [
        product.name,
        product.code,
        product.price,
        product.quantity,
        product.brand_id,
        product.category_id,
        product.description || null, 
        product.short_description || null
    ];

    const [result] = await db.execute<ResultSetHeader>(query, values);
    return result.insertId;
}

/**
 * Cập nhật sản phẩm
 */
export async function updateProduct(id: number, data: Partial<Product>): Promise<number> {
    const fields: string[] = [];
    const values: any[] = [];

    for (const key in data) {
        if (data[key] !== undefined && key !== 'product_id' && key !== 'code' && key !== 'createdAt') {
            fields.push(`${key} = ?`);
            values.push(data[key]);
        }
    }

    if (fields.length === 0) return 0;

    values.push(id);

    const query = `
        UPDATE products
        SET ${fields.join(', ')}
        WHERE product_id = ?
    `;

    const [result] = await db.execute<ResultSetHeader>(query, values);
    return result.affectedRows;
}

/**
 * Xóa sản phẩm (Soft Delete: set is_active = 0)
 */
export async function deleteProduct(id: number): Promise<number> {
    const query = `
        UPDATE products
        SET is_active = 0
        WHERE product_id = ?
    `;

    const [result] = await db.execute<ResultSetHeader>(query, [id]);
    return result.affectedRows;
}

/**
 * Tìm sản phẩm theo từ khóa (cho gợi ý tìm kiếm)
 */
export async function findProductsByKeyword(keyword: string, limit = 6): Promise<Product[]> {
    const query = `
        SELECT
            p.product_id,
            p.name,
            p.price,
            p.short_description,
            pi.url AS image_url
        FROM products p
        LEFT JOIN productImages pi ON p.product_id = pi.product_id AND pi.is_main = TRUE
        WHERE p.is_active = 1
          AND (p.name LIKE ? OR p.short_description LIKE ?)
        ORDER BY p.createdAt DESC
        LIMIT ?
    `;
    const like = `%${keyword}%`;
    const [rows] = await db.query<Product[]>(query, [like, like, limit]);
    return rows;
}