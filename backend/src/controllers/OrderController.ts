// backend/src/controllers/OrderController.ts
import { Request, Response } from "express";
import {getUserFromToken} from "../utils/auth";
import * as OrderModel from "../models/OrderModel";

export async function createOrder(req: Request, res: Response) {
    try {
        const { order, items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Đơn hàng phải có ít nhất 1 sản phẩm" });
        }

        const newOrderId = await OrderModel.createNewOrder(order, items);

        res.json({
            success: true,
            message: "Tạo đơn hàng thành công",
            order_id: newOrderId
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi tạo đơn hàng" });
    }
}

export async function getMyOrders(req: Request, res: Response) {
    try {
        const user = getUserFromToken(req);
        const accountId = user.account_id;

        const orders = await OrderModel.findOrdersByAccountId(accountId);

        res.json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ message: "Lỗi lấy lịch sử đơn hàng" });
    }
}

export async function getOrderById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const order = await OrderModel.findOrderById(id);
        const items = await OrderModel.findOrderItems(id);

        res.json({ success: true, order, items });

    } catch {
        res.status(500).json({ message: "Lỗi lấy chi tiết đơn hàng" });
    }
}

export async function getAllOrders(req: Request, res: Response) {
    try {
        const orders = await OrderModel.findAllOrders();
        res.json({ success: true, data: orders });
    } catch {
        res.status(500).json({ message: "Lỗi lấy danh sách đơn hàng" });
    }
}

export async function updateStatus(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        await OrderModel.updateOrderStatus(id, status);

        res.json({ success: true, message: "Cập nhật trạng thái thành công" });

    } catch {
        res.status(500).json({ message: "Lỗi cập nhật trạng thái" });
    }
}

export async function deleteOrder(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        await OrderModel.deleteOrder(id);

        res.json({ success: true, message: "Xóa đơn hàng thành công" });

    } catch {
        res.status(500).json({ message: "Lỗi xóa đơn hàng" });
    }
}
