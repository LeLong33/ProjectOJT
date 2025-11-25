import db from '../config/database';
import {ResultSetHeader, RowDataPacket} from 'mysql2';

// Định nghĩa kiểu dữ liệu cơ bản cho sản phẩm
export interface Product extends RowDataPacket {
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    description: string;
    rating: number;
}

/**
 * Lấy tất cả sản phẩm đang hoạt động
 */
export async function findAllActiveProducts(): Promise<Product[]> {
    const query = `
        SELECT product_id, name, code, price, quantity, short_description, rating, numReviews
        FROM products 
        WHERE is_active = 1
    `;
    const [rows] = await db.query<Product[]>(query);
    return rows;
}

/**
 * Lấy thông tin chi tiết của một sản phẩm
 */
export async function findProductById(id: number) {
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
 * Tạo sản phẩm mới
 */
export async function createProduct(product: {
    name: string;
    price: number;
    quantity: number;
    description: string;
    rating: number;
}): Promise<ResultSetHeader> {

    const query = `
        INSERT INTO products (name, price, quantity, short_description, rating, is_active)
        VALUES (?, ?, ?, ?, ?, 1)
    `;

    const values = [
        product.name,
        product.price,
        product.quantity || 0,
        product.description || "",
        product.rating || 0
    ];

    const [result] = await db.query<ResultSetHeader>(query, values);
    return result;
}

/**
 * Cập nhật sản phẩm
 */
export async function updateProduct(id: number, data: any): Promise<ResultSetHeader> {
    const fields: string[] = [];
    const values: any[] = [];

    // Tự động build câu SQL theo các field được gửi lên
    for (const key in data) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
    }

    values.push(id);

    const query = `
        UPDATE products
        SET ${fields.join(', ')}
        WHERE product_id = ?
    `;

    const [result] = await db.query<ResultSetHeader>(query, values);
    return result;
}

/**
 * Xóa sản phẩm (set is_active = 0 thay vì xóa thật)
 */
export async function deleteProduct(id: number): Promise<ResultSetHeader> {
    const query = `
        UPDATE products
        SET is_active = 0
        WHERE product_id = ?
    `;

    const [result] = await db.query<ResultSetHeader>(query, [id]);
    return result;
}