// backend/src/models/AddressModel.ts
import db from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Address extends RowDataPacket {
    address_id: number;
    account_id: number;
    recipient_name: string;
    phone_number: string;
    address: string;
    district: string;
    city: string;
    country: string;
    is_default: boolean;
}

/**
 * Lấy tất cả địa chỉ của một tài khoản
 */
export async function findAddressesByAccountId(accountId: number): Promise<Address[]> {
    const query = 'SELECT * FROM addresses WHERE account_id = ?';
    const [rows] = await db.query<Address[]>(query, [accountId]);
    return rows;
}

/**
 * Thêm địa chỉ mới
 */
export async function createAddress(addressData: Omit<Address, 'address_id'>): Promise<number> {
    const { account_id, recipient_name, phone_number, address, district, city, country, is_default } = addressData;
    
    const query = `
        INSERT INTO addresses (account_id, recipient_name, phone_number, address, district, city, country, is_default)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [account_id, recipient_name, phone_number, address, district, city, country, is_default]);
    
    return (result as ResultSetHeader).insertId;
}

/**
 * Cập nhật địa chỉ
 */
export async function updateAddress(addressId: number, accountId: number, updateData: Partial<Address>): Promise<number> {
    const fields = Object.keys(updateData).filter(key => updateData[key as keyof Partial<Address>] !== undefined);
    const values = fields.map(key => updateData[key as keyof Partial<Address>]!);

    if (fields.length === 0) {
        return 0;
    }

    const setClauses = fields.map(field => `${field} = ?`).join(', ');
    
    const query = `
        UPDATE addresses 
        SET ${setClauses} 
        WHERE address_id = ? AND account_id = ?
    `;

    const [result] = await db.execute(query, [...values, addressId, accountId]);
    
    return (result as ResultSetHeader).affectedRows;
}