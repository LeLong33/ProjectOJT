import db from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// ----- Interfaces -----
export interface Product extends RowDataPacket {
    product_id: number;
    name: string;
    code: string;
    price: number;
    quantity: number;
    brand_id: number;
    category_id: number;
    description?: string;
    short_description?: string;
    is_active: boolean;
    rating: number;
    numReviews: number;
    createdAt: Date;
    image_url?: string;
}

export interface ProductImage extends RowDataPacket {
    image_id: number;
    product_id: number;
    url: string;
    is_main: boolean;
}

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

export interface CreateProductImageData {
    product_id: number;
    url: string;
    is_main: boolean;
}

// ----- CRUD Functions -----

// Tạo sản phẩm mới
export async function createProduct(product: CreateProductData): Promise<number> {
    const query = `
        INSERT INTO products
        (name, code, price, quantity, brand_id, category_id, description, short_description, rating, numReviews, is_active, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 1, NOW())
    `;
    const values = [
        product.name,
        product.code,
        product.price,
        product.quantity,
        product.brand_id,
        product.category_id,
        product.description ?? null,
        product.short_description ?? null
    ];
    const [result] = await db.execute<ResultSetHeader>(query, values);
    return result.insertId;
}

// Thêm ảnh sản phẩm
export async function addProductImage(image: CreateProductImageData): Promise<number> {
    const query = `
        INSERT INTO productImages (product_id, url, is_main)
        VALUES (?, ?, ?)
    `;
    const values = [image.product_id, image.url, image.is_main ? 1 : 0];
    const [result] = await db.execute<ResultSetHeader>(query, values);
    return result.insertId;
}

// Cập nhật sản phẩm
export async function updateProduct(id: number, data: Partial<CreateProductData>): Promise<number> {
    const fields: string[] = [];
    const values: any[] = [];

    for (const key of Object.keys(data)) {
        if (data[key as keyof CreateProductData] !== undefined && key !== 'code' && key !== 'product_id') {
            fields.push(`${key} = ?`);
            values.push(data[key as keyof CreateProductData]);
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

// Soft delete
export async function deleteProduct(id: number): Promise<number> {
    const query = `UPDATE products SET is_active = 0 WHERE product_id = ?`;
    const [result] = await db.execute<ResultSetHeader>(query, [id]);
    return result.affectedRows;
}

// Lấy tất cả sản phẩm có ảnh chính
export async function findAllProducts(): Promise<Product[]> {
    const query = `
        SELECT p.*, pi.url AS image_url
        FROM products p
                 LEFT JOIN productImages pi ON p.product_id = pi.product_id AND pi.is_main = 1
        WHERE p.is_active = 1
        ORDER BY p.createdAt DESC
    `;
    const [rows] = await db.query<Product[]>(query);
    return rows;
}

// Lấy chi tiết sản phẩm theo id
export async function findProductById(id: number): Promise<Product | undefined> {
    const query = `
        SELECT p.*, pi.url AS image_url
        FROM products p
                 LEFT JOIN productImages pi ON p.product_id = pi.product_id AND pi.is_main = 1
        WHERE p.product_id = ? AND p.is_active = 1
    `;
    const [rows] = await db.query<Product[]>(query, [id]);
    return rows[0];
}
