// backend/src/models/CategoryModel.ts
import db from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Category extends RowDataPacket {
    category_id: number;
    name: string;
    parent_id: number | null;
}

/**
 * Lấy tất cả danh mục
 */
export async function findAllCategories(): Promise<Category[]> {
    const query = 'SELECT * FROM categories ORDER BY category_id ASC';
    const [rows] = await db.query<Category[]>(query);
    return rows;
}

/**
 * Tạo danh mục mới
 */
export async function createCategory(name: string, parentId: number | null): Promise<number> {
    const query = 'INSERT INTO categories (name, parent_id) VALUES (?, ?)';
    const [result] = await db.execute(query, [name, parentId]);
    return (result as ResultSetHeader).insertId;
}

/**
 * Cập nhật danh mục
 */
export async function updateCategory(id: number, name: string, parentId: number | null): Promise<number> {
    const query = 'UPDATE categories SET name = ?, parent_id = ? WHERE category_id = ?';
    const [result] = await db.execute(query, [name, parentId, id]);
    return (result as ResultSetHeader).affectedRows;
}

/**
 * Xóa danh mục
 */
export async function deleteCategory(id: number): Promise<number> {
    // Lưu ý: Cần xử lý các danh mục con và các sản phẩm liên quan
    const query = 'DELETE FROM categories WHERE category_id = ?';
    const [result] = await db.execute(query, [id]);
    return (result as ResultSetHeader).affectedRows;
}