import db from '../config/database';
import { RowDataPacket } from 'mysql2';

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