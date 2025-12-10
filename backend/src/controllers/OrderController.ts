import { RequestHandler } from 'express';
import * as OrderModel from '../models/OrderModel';
import db from '../config/database'; 
import { ResultSetHeader } from 'mysql2';

// API: Lấy danh sách đơn hàng
export const getMyOrders: RequestHandler = async (req, res) => {
    try {
        const user = req.user as any; 
        
        if (!user || !user.id) {
             res.status(401).json({ message: 'Unauthorized' });
             return;
        }

        const orders = await OrderModel.getOrdersByAccountId(user.id);
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// API: Lấy chi tiết đơn hàng
export const getOrderDetail: RequestHandler = async (req, res) => {
    try {
        const user = req.user as any;
        if (!user || !user.id) {
             res.status(401).json({ message: 'Unauthorized' });
             return;
        }

        const orderId = parseInt(req.params.id);
        const order = await OrderModel.getOrderDetail(orderId, user.id);

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

// API: Tạo đơn hàng (Checkout) - ✅ ĐÃ SỬA
export const createOrder: RequestHandler = async (req, res) => {
    console.log('🚀 CREATE ORDER CALLED');
    console.log('📦 Request Body:', req.body);
    console.log('👤 User:', req.user);
    
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const user = req.user as any;
        const accountId = user ? user.id : null; 
        
        const { 
            address_id,           // ✅ THÊM: Nhận address_id từ frontend
            recipient_name, 
            phone_number,
            address, 
            district, 
            city,       
            items, 
            payment_method,     
            total_amount          
        } = req.body;

        // Validation items
        if (!items || items.length === 0) {
             res.status(400).json({ success: false, message: "Giỏ hàng trống" });
             return;
        }

        let finalAddressId = address_id;

        // ✅ LOGIC MỚI: Chỉ tạo địa chỉ mới khi KHÔNG CÓ address_id
        if (!address_id) {
            // Người dùng nhập địa chỉ mới
            if (!recipient_name || !phone_number || !address || !district || !city) {
                res.status(400).json({ success: false, message: "Thiếu thông tin giao hàng" });
                return;
            }

            console.log("📍 Creating NEW address...");
            
            const [addrResult] = await connection.execute<ResultSetHeader>(`
                INSERT INTO addresses (account_id, recipient_name, phone_number, address, district, city, country, is_default)
                VALUES (?, ?, ?, ?, ?, ?, 'Vietnam', 0)
            `, [accountId, recipient_name, phone_number, address, district, city]);
            
            finalAddressId = addrResult.insertId;
            console.log("✅ New address created:", finalAddressId);
        } else {
            // ✅ Dùng địa chỉ có sẵn
            console.log("✅ Using EXISTING address:", address_id);
        }

        // 2. Lưu đơn hàng
        const isPaidValue = false; // Mặc định FALSE, chờ thanh toán
        const [orderResult] = await connection.execute<ResultSetHeader>(`
            INSERT INTO orders (account_id, guest_name, guest_phone, address_id, total_amount, final_amount, payment_method, status, isPaid)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Chờ xác nhận', ?)
        `, [accountId, recipient_name || null, phone_number || null, finalAddressId, total_amount, total_amount, payment_method, isPaidValue]);

        const orderId = orderResult.insertId;
        console.log("✅ Order created:", orderId);

        // 3. Lưu chi tiết sản phẩm
        for (const item of items) {
            if (!item.product_id || !item.price) {
                throw new Error(`Dữ liệu sản phẩm lỗi: ID=${item.product_id}`);
            }
            await connection.execute(`
                INSERT INTO order_items (order_id, product_id, quantity, price_at_order)
                VALUES (?, ?, ?, ?)
            `, [orderId, item.product_id, item.quantity, item.price]);
        }

        console.log("✅ Order items created");

        await connection.commit();
        console.log("✅ Transaction committed");
        
        // Trả về response
        if (payment_method === 'transfer') {
            res.status(201).json({ 
                success: true, 
                message: 'Đơn hàng đã tạo, chuyển sang thanh toán', 
                orderId,
                requiresPayment: true 
            });
        } else {
            res.status(201).json({ 
                success: true, 
                message: 'Đặt hàng thành công', 
                orderId 
            });
        }

    } catch (error) {
        await connection.rollback();
        console.error("❌ Lỗi tạo đơn hàng:", error);
        res.status(500).json({ success: false, message: 'Lỗi khi tạo đơn hàng' });
    } finally {
        connection.release();
    }
};

export const getAllOrders: RequestHandler = async (req, res) => {
    try {
        const [orders]: any = await db.execute(`
            SELECT 
                o.order_id,
                o.account_id,
                o.status,
                o.total_amount,
                o.final_amount,
                o.payment_method,
                o.isPaid,
                o.createdAt,
                o.guest_name,
                o.guest_phone,
                a.recipient_name,
                a.phone_number,
                a.address,
                a.city
            FROM orders o
            LEFT JOIN addresses a ON o.address_id = a.address_id
            ORDER BY o.createdAt DESC
        `);

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('❌ Get all orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy danh sách đơn hàng'
        });
    }
};

/**
 * [ADMIN] Cập nhật trạng thái đơn hàng
 */
export const updateOrderStatus: RequestHandler = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = [
            'Chờ xác nhận',
            'Đã xác nhận', 
            'Đang giao',
            'Đã giao',
            'Đã hủy',
            'Đã thanh toán',
            'Chưa thanh toán'
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Trạng thái không hợp lệ'
            });
        }

        const [result] = await db.execute<ResultSetHeader>(
            `UPDATE orders SET status = ? WHERE order_id = ?`,
            [status, orderId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        res.json({
            success: true,
            message: `Đã cập nhật trạng thái thành "${status}"`
        });
    } catch (error) {
        console.error('❌ Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi cập nhật trạng thái'
        });
    }
};

/**
 * [ADMIN] Xóa đơn hàng
 */
export const deleteOrder: RequestHandler = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { orderId } = req.params;

        await connection.beginTransaction();

        // Xóa order_items trước
        await connection.execute(
            `DELETE FROM order_items WHERE order_id = ?`,
            [orderId]
        );

        // Xóa order
        const [result] = await connection.execute<ResultSetHeader>(
            `DELETE FROM orders WHERE order_id = ?`,
            [orderId]
        );

        await connection.commit();

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        res.json({
            success: true,
            message: 'Đã xóa đơn hàng'
        });
    } catch (error) {
        await connection.rollback();
        console.error('❌ Delete order error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi xóa đơn hàng'
        });
    } finally {
        connection.release();
    }
};