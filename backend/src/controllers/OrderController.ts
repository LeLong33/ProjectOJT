import { RequestHandler } from 'express';
import * as OrderModel from '../models/OrderModel';
import db from '../config/database'; 
import { ResultSetHeader } from 'mysql2';

// API: Lấy danh sách đơn hàng
export const getMyOrders: RequestHandler = async (req, res) => {
    try {
        const accountId = req.user!.id;
        const orders = await OrderModel.getOrdersByAccountId(accountId);
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// API: Lấy chi tiết đơn hàng
export const getOrderDetail: RequestHandler = async (req, res) => {
    try {
        const accountId = req.user!.id;
        const orderId = parseInt(req.params.id);
        const order = await OrderModel.getOrderDetail(orderId, accountId);

        if (!order) {
            res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
            return;
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// 🆕 API: Tạo đơn hàng (Checkout)
export const createOrder: RequestHandler = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction(); // Bắt đầu giao dịch

        // Lấy accountId: Nếu user login thì lấy ID, nếu không thì null
        const accountId = req.user ? req.user.id : null; 
        
        const {
  recipient_name,
  phone_number,
  address,
  district,
  city,
  items,
  payment_method,
  total_amount
} = req.body;

if (!recipient_name || !phone_number || !address || !district || !city) {
    throw new Error("Thiếu thông tin giao hàng");
}

if (!items || items.length === 0) {
    throw new Error("Giỏ hàng trống");
}


        // Log để debug (Xem terminal backend nhận được gì)
        console.log("Creating Order for:", { recipient_name, total_amount, itemsCount: items?.length });

        // 1. Lưu địa chỉ (address_id)
        // Câu lệnh này khớp với bảng addresses hiện tại của bạn
        const [addrResult] = await connection.execute<ResultSetHeader>(`
            INSERT INTO addresses (account_id, recipient_name, phone_number, address, district, city, country, is_default)
            VALUES (?, ?, ?, ?, ?, ?, 'Vietnam', 0)
        `, [accountId, recipient_name, phone_number, address, district, city]);
        
        const addressId = addrResult.insertId;

        // 2. Lưu đơn hàng (order_id)
        const [orderResult] = await connection.execute<ResultSetHeader>(`
            INSERT INTO orders (account_id, guest_name, guest_phone, address_id, total_amount, final_amount, payment_method, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Chờ xác nhận')
        `, [accountId, recipient_name, phone_number, addressId, total_amount, total_amount, payment_method]);

        const orderId = orderResult.insertId;

        // 3. Lưu chi tiết sản phẩm
        if (items && items.length > 0) {
            for (const item of items) {
                // Kiểm tra dữ liệu từng item
                if (!item.product_id || !item.price) {
                    throw new Error(`Dữ liệu sản phẩm không hợp lệ: ID=${item.product_id}`);
                }

                await connection.execute(`
                    INSERT INTO order_items (order_id, product_id, quantity, price_at_order)
                    VALUES (?, ?, ?, ?)
                `, [orderId, item.product_id, item.quantity, item.price]);
            }
        }

        await connection.commit(); // Xác nhận lưu vào DB
        console.log("Order Created Successfully! ID:", orderId);
        
        res.status(201).json({ success: true, message: 'Đặt hàng thành công', orderId });

    } catch (error) {
        await connection.rollback(); // Hoàn tác nếu lỗi
        console.error("❌ LỖI TẠO ĐƠN HÀNG:", error); // Quan trọng: Xem lỗi này ở Terminal Backend
        res.status(500).json({ success: false, message: 'Lỗi khi tạo đơn hàng' });
    } finally {
        connection.release();
    }
};