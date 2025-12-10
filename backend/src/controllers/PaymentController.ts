import { RequestHandler } from 'express';
import axios from 'axios';
import { momoConfig, generateMomoSignature } from '../config/momo';
import db from '../config/database';
import { ResultSetHeader } from 'mysql2';

/**
 * Tạo link thanh toán MoMo
 */
export const createMomoPayment: RequestHandler = async (req, res) => {
    try {
        const { orderId, amount } = req.body;

        // Validate input
        if (!orderId || !amount) {
            res.status(400).json({ success: false, message: 'Thiếu orderId hoặc amount' });
            return;
        }

        // Validate amount
        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            res.status(400).json({ success: false, message: 'Số tiền không hợp lệ' });
            return;
        }

        // Tạo requestId và orderId unique
        const timestamp = Date.now();
        const requestId = `${orderId}_${timestamp}`;
        const momoOrderId = `${orderId}_${timestamp}`;
        const orderInfo = `Thanh toan don hang ${orderId}`;
        const requestType = 'payWithMethod';
        const extraData = '';

        // Tạo raw signature (KHÔNG bao gồm ipnUrl trong signature)
        const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${numAmount}&extraData=${extraData}&ipnUrl=${momoConfig.ipnUrl}&orderId=${momoOrderId}&orderInfo=${orderInfo}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
        
        const signature = generateMomoSignature(rawSignature);

        const requestBody = {
            partnerCode: momoConfig.partnerCode,
            partnerName: 'Tech Store',
            storeId: 'TechStore',
            requestId,
            amount: numAmount,
            orderId: momoOrderId,
            orderInfo,
            redirectUrl: momoConfig.redirectUrl,
            ipnUrl: momoConfig.ipnUrl,
            lang: 'vi',
            requestType,
            autoCapture: true,
            extraData,
            orderExpireTime: 15,
            signature
        };

        console.log('📤 Sending MoMo request:', {
            ...requestBody,
            secretKey: '***hidden***'
        });
        console.log('🔐 Raw signature string:', rawSignature);

        const response = await axios.post(momoConfig.endpoint, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 seconds timeout
        });

        console.log('📥 MoMo response:', response.data);

        if (response.data.resultCode === 0) {
            res.status(200).json({
                success: true,
                payUrl: response.data.payUrl,
                deeplink: response.data.deeplink,
                qrCodeUrl: response.data.qrCodeUrl
            });
        } else {
            console.error('❌ MoMo error:', response.data);
            res.status(400).json({
                success: false,
                message: response.data.message || 'Lỗi tạo thanh toán MoMo',
                resultCode: response.data.resultCode
            });
        }
    } catch (error: any) {
        console.error('❌ MoMo API Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi kết nối MoMo',
            error: error.response?.data?.message || error.message
        });
    }
};

/**
 * Callback từ MoMo (IPN - Instant Payment Notification)
 */
export const momoCallback: RequestHandler = async (req, res) => {
    try {
        console.log('🔔 MoMo IPN Callback:', req.body);

        const {
            partnerCode,
            orderId: momoOrderId,
            requestId,
            amount,
            orderInfo,
            orderType,
            transId,
            resultCode,
            message,
            payType,
            responseTime,
            extraData,
            signature
        } = req.body;

        // Trích xuất orderId gốc
        const originalOrderId = momoOrderId.split('_')[0];

        // Verify signature
        const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${momoOrderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
        
        const expectedSignature = generateMomoSignature(rawSignature);

        if (signature !== expectedSignature) {
            console.error('❌ Invalid signature');
            console.error('Expected:', expectedSignature);
            console.error('Received:', signature);
            res.status(400).json({ message: 'Invalid signature' });
            return;
        }

        // Cập nhật trạng thái đơn hàng
        const connection = await db.getConnection();
        try {
            if (resultCode === 0) {
                // Thanh toán thành công
                await connection.execute(
                    `UPDATE orders SET 
                        status = 'Đã thanh toán', 
                        isPaid = TRUE, 
                        paidAt = NOW(),
                        transaction_id = ?
                    WHERE order_id = ?`,
                    [transId, originalOrderId]
                );
                console.log(`✅ Order #${originalOrderId} paid successfully with transId: ${transId}`);
            } else {
                // Thanh toán thất bại
                await connection.execute(
                    `UPDATE orders SET status = 'Chưa thanh toán' WHERE order_id = ?`,
                    [originalOrderId]
                );
                console.log(`❌ Order #${originalOrderId} payment failed: ${message}`);
            }
        } finally {
            connection.release();
        }

        res.status(200).json({ message: 'OK' });
    } catch (error) {
        console.error('❌ MoMo callback error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Cập nhật trạng thái thanh toán (từ frontend sau redirect)
 */
export const updatePaymentStatus: RequestHandler = async (req, res) => {
    try {
        const { orderId, transId, resultCode } = req.body;

        console.log('🔄 Updating payment status:', { orderId, transId, resultCode });

        // Trích xuất orderId gốc nếu có timestamp
        const originalOrderId = orderId.includes('_') ? orderId.split('_')[0] : orderId;

        const connection = await db.getConnection();
        
        if (resultCode === '0' || resultCode === 0) {
            await connection.execute(
                `UPDATE orders SET 
                    status = 'Đã thanh toán', 
                    isPaid = TRUE, 
                    paidAt = NOW(),
                    transaction_id = ?
                WHERE order_id = ?`,
                [transId, originalOrderId]
            );
            console.log(`✅ Order #${originalOrderId} marked as paid`);
        } else {
            await connection.execute(
                `UPDATE orders SET status = 'Chưa thanh toán' WHERE order_id = ?`,
                [originalOrderId]
            );
        }
        
        connection.release();
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('❌ Update payment status error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

/**
 * Kiểm tra trạng thái thanh toán
 */
export const checkPaymentStatus: RequestHandler = async (req, res) => {
    try {
        const { orderId } = req.params;

        const connection = await db.getConnection();
        const [rows]: any = await connection.execute(
            `SELECT status, isPaid, paidAt, transaction_id FROM orders WHERE order_id = ?`,
            [orderId]
        );
        connection.release();

        if (rows.length === 0) {
            res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
            return;
        }

        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('❌ Check payment status error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};