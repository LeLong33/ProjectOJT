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
export async function getOrdersByAccountId(accountId: number) {
    const query = `
        SELECT order_id, status, total_amount, final_amount, createdAt, isPaid, isDelivered 
        FROM orders 
        WHERE account_id = ? 
        ORDER BY createdAt DESC
    `;
    const [rows] = await db.query<RowDataPacket[]>(query, [accountId]);
    return rows;
}

// Lấy chi tiết 1 đơn hàng (Bao gồm thông tin người nhận + danh sách sản phẩm)
export async function getOrderDetail(orderId: number, accountId: number) {
    // 1. Lấy thông tin chung đơn hàng
    const orderQuery = `
        SELECT o.*, a.recipient_name, a.phone_number, a.address, a.district, a.city 
        FROM orders o
        JOIN addresses a ON o.address_id = a.address_id
        WHERE o.order_id = ? AND o.account_id = ?
    `;
    const [orders] = await db.query<RowDataPacket[]>(orderQuery, [orderId, accountId]);
    
    if (orders.length === 0) return null;
    const order = orders[0];

    // 2. Lấy danh sách sản phẩm trong đơn (Kèm ảnh đại diện)
    const itemsQuery = `
        SELECT oi.*, p.name as product_name, 
        (SELECT url FROM productImages WHERE product_id = p.product_id LIMIT 1) as product_image
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = ?
    `;
    const [items] = await db.query<RowDataPacket[]>(itemsQuery, [orderId]);

    return { ...order, items };
}