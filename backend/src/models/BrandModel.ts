// backend/src/models/BrandModel.ts
import db from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Brand extends RowDataPacket {
    brand_id: number;
    name: string;
}

/**
 * Lấy tất cả thương hiệu
 */
export async function findAllBrands(): Promise<Brand[]> {
    const query = 'SELECT * FROM brands ORDER BY name ASC';
    const [rows] = await db.query<Brand[]>(query);
    return rows;
}

/**
 * Lấy danh sách thương hiệu có sản phẩm trong một danh mục cụ thể
 */
export async function findBrandsByCategory(categoryId: number): Promise<Brand[]> {
    const query = `
        SELECT DISTINCT b.brand_id, b.name
        FROM brands b
        INNER JOIN products p ON p.brand_id = b.brand_id
        INNER JOIN categories c ON p.category_id = c.category_id
        WHERE (p.category_id = ? OR c.parent_id = ?) AND p.is_active = 1
        ORDER BY b.name ASC
    `;
    const [rows] = await db.query<Brand[]>(query, [categoryId, categoryId]);
    return rows;
}

/**
 * Tạo thương hiệu mới
 */
export async function createBrand(name: string): Promise<number> {
    const query = 'INSERT INTO brands (name) VALUES (?)';
    const [result] = await db.execute(query, [name]);
    return (result as ResultSetHeader).insertId;
}

/**
 * Cập nhật thương hiệu
 */
export async function updateBrand(id: number, name: string): Promise<number> {
    const query = 'UPDATE brands SET name = ? WHERE brand_id = ?';
    const [result] = await db.execute(query, [name, id]);
    return (result as ResultSetHeader).affectedRows;
}

/**
 * Xóa thương hiệu
 */
export async function deleteBrand(id: number): Promise<number> {
    const query = 'DELETE FROM brands WHERE brand_id = ?';
    const [result] = await db.execute(query, [id]);
    return (result as ResultSetHeader).affectedRows;
}