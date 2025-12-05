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

/**
 * lấy 1 đơn hàng bới ID
 */
export async function findOrderById(orderId: number): Promise<Order | null> {
    const query = 'SELECT * FROM orders WHERE order_id = ? LIMIT 1';
    const [rows] = await db.query<Order[]>(query, [orderId]);
    return rows.length > 0 ? rows[0] : null;
}

/**
 * Lấy toàn bộ đơn hàng (Admin/Staff)
 */
export async function findAllOrders(): Promise<Order[]> {
    const query = 'SELECT * FROM orders ORDER BY createdAt DESC';
    const [rows] = await db.query<Order[]>(query);
    return rows;
}

/**
 * Lấy danh sách item của một Order
 */
export async function findOrderItems(orderId: number): Promise<OrderItem[]> {
    const query = 'SELECT * FROM order_items WHERE order_id = ?';
    const [rows] = await db.query<OrderItem[]>(query, [orderId]);
    return rows;
}

/**
 * Tạo đơn hàng mới (Transaction)
 */
export async function createNewOrder(
    orderData: Omit<Order, 'order_id' | 'createdAt'>,
    items: Omit<OrderItem, 'item_id' | 'order_id'>[]
): Promise<number> {

    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        // 1. Insert vào orders
        const orderQuery = `
            INSERT INTO orders (
                account_id, guest_name, guest_phone, address_id,
                total_amount, discount_amount, final_amount,
                status, payment_method, isPaid, paidAt,
                isDelivered, deliveredAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [orderResult] = await conn.execute<ResultSetHeader>(orderQuery, [
            orderData.account_id,
            orderData.guest_name,
            orderData.guest_phone,
            orderData.address_id,
            orderData.total_amount,
            orderData.discount_amount,
            orderData.final_amount,
            orderData.status,
            orderData.payment_method,
            orderData.isPaid,
            orderData.paidAt,
            orderData.isDelivered,
            orderData.deliveredAt
        ]);

        const newOrderId = orderResult.insertId;

        // 2. Insert order_items
        const itemQuery = `
            INSERT INTO order_items (order_id, product_id, quantity, price_at_order)
            VALUES ?
        `;

        const itemValues = items.map(i => [
            newOrderId,
            i.product_id,
            i.quantity,
            i.price_at_order
        ]);

        await conn.query(itemQuery, [itemValues]);

        // Commit
        await conn.commit();
        return newOrderId;

    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}

/**
 * Cập nhật trạng thái đơn hàng
 */
export async function updateOrderStatus(orderId: number, status: string): Promise<void> {
    const query = 'UPDATE orders SET status = ? WHERE order_id = ?';
    await db.query(query, [status, orderId]);
}

/**
 * Xóa đơn hàng (Admin)
 */
export async function deleteOrder(orderId: number): Promise<void> {
    await db.query('DELETE FROM order_items WHERE order_id = ?', [orderId]);
    await db.query('DELETE FROM orders WHERE order_id = ?', [orderId]);
}