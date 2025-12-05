import db from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Định nghĩa kiểu dữ liệu hoàn chỉnh cho Sản phẩm
export interface Product extends RowDataPacket {
    product_id: number;
    name: string;
    code: string; // THÊM CODE
    price: number;
    quantity: number;
    brand_id: number; // THÊM FK
    category_id: number; // THÊM FK
    description: string;
    short_description: string; // THÊM SHORT DESC
    is_active: boolean; // THÊM ACTIVE STATUS
    rating: number;
    numReviews: number;
    createdAt: Date;
}

// Kiểu dữ liệu tối thiểu cho việc tạo sản phẩm
export interface CreateProductData {
    name: string;
    code: string; // BẮT BUỘC
    price: number;
    quantity: number;
    brand_id: number; // BẮT BUỘC
    category_id: number; // BẮT BUỘC
    description?: string;
    short_description?: string;
}

// ---------------------------------------------------------------------
// GET FUNCTIONS
// ---------------------------------------------------------------------

/**
 * Lấy tất cả sản phẩm đang hoạt động
 */
export async function findAllActiveProducts(): Promise<Product[]> {
    const query = `
        SELECT product_id, name, code, price, quantity, short_description, rating, numReviews
        FROM products 
        WHERE is_active = 1
        ORDER BY createdAt DESC
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


// ---------------------------------------------------------------------
// ADMIN/STAFF CRUD
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
        product.description || null, // Dùng null nếu không có
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

    // Tự động build câu SQL theo các field được gửi lên
    for (const key in data) {
        if (data[key] !== undefined && key !== 'product_id' && key !== 'code' && key !== 'createdAt') {
            fields.push(`${key} = ?`);
            values.push(data[key]);
        }
    }

    if (fields.length === 0) return 0; // Không có gì để cập nhật

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