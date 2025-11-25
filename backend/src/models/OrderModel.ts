// backend/src/models/OrderModel.ts
import db from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface OrderItem extends RowDataPacket {
    item_id?: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price_at_order: number;
}

export interface Order extends RowDataPacket {
    order_id: number;
    account_id: number | null;
    guest_name: string | null;
    guest_phone: string | null;
    address_id: number;
    total_amount: number;
    discount_amount: number;
    final_amount: number;
    status: string;
    payment_method: string;
    isPaid: boolean;
    paidAt: Date | null;
    isDelivered: boolean;
    deliveredAt: Date | null;
    createdAt: Date;
}

/**
 * Lấy lịch sử đơn hàng của một người dùng
 */
export async function findOrdersByAccountId(accountId: number): Promise<Order[]> {
    const query = 'SELECT * FROM orders WHERE account_id = ? ORDER BY createdAt DESC';
    const [rows] = await db.query<Order[]>(query, [accountId]);
    return rows;
}
// Chức năng createNewOrder (sử dụng Transaction) sẽ được code sau