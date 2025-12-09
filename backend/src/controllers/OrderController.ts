import { Request, Response } from 'express';
import * as OrderModel from '../models/OrderModel';
import db from '../config/database'; 
import { ResultSetHeader } from 'mysql2';

// API: Lấy danh sách đơn hàng của tôi
export const getMyOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const accountId = req.user!.id;
        const orders = await OrderModel.getOrdersByAccountId(accountId);
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// API: Lấy chi tiết đơn hàng
export const getOrderDetail = async (req: Request, res: Response): Promise<void> => {
    try {
        const accountId = req.user!.id;
        const orderId = parseInt(req.params.id);
        const order = await OrderModel.getOrderDetail(orderId, accountId);

        if (!order) {
            res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
            return; // 👈 Quan trọng: return void để thoát hàm
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// API: Tạo đơn hàng mới
export const createOrder = async (req: Request, res: Response): Promise<void> => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const accountId = req.user ? req.user.id : null; 
        const { 
            recipient_name, phone_number, email,
            address, ward, district, city,       
            items, shipping_method, payment_method,     
            shipping_cost, total_amount          
        } = req.body;

        // Lưu địa chỉ
        const fullAddressStr = `${address}, ${ward}`;
        const [addrResult] = await connection.execute<ResultSetHeader>(`
            INSERT INTO addresses (account_id, recipient_name, phone_number, address, district, city, country, is_default)
            VALUES (?, ?, ?, ?, ?, ?, 'Vietnam', 0)
        `, [accountId, recipient_name, phone_number, fullAddressStr, district, city]);
        
        const addressId = addrResult.insertId;

        // Tạo đơn hàng
        const [orderResult] = await connection.execute<ResultSetHeader>(`
            INSERT INTO orders (account_id, guest_name, guest_phone, address_id, total_amount, final_amount, payment_method, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Chờ xác nhận')
        `, [accountId, recipient_name, phone_number, addressId, total_amount, total_amount, payment_method]);

        const orderId = orderResult.insertId;

        // Lưu chi tiết
        if (items && items.length > 0) {
            for (const item of items) {
                await connection.execute(`
                    INSERT INTO order_items (order_id, product_id, quantity, price_at_order)
                    VALUES (?, ?, ?, ?)
                `, [orderId, item.product_id, item.quantity, item.price]);
            }
        }

        await connection.commit();
        res.status(201).json({ success: true, message: 'Đặt hàng thành công', orderId });
    } catch (error) {
        await connection.rollback();
        console.error("Lỗi tạo đơn hàng:", error);
        res.status(500).json({ success: false, message: 'Lỗi khi tạo đơn hàng' });
    } finally {
        connection.release();
    }
};