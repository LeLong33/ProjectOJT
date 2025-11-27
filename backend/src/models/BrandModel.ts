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