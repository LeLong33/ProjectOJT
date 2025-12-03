// src/controllers/CartController.ts
import { Request, Response } from "express";
import * as CartModel from "../models/CartModel";

export async function getMyCart(req: any, res: Response) {
    try {
        const cart = await CartModel.getCart(req.session);

        const total = cart.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
        );

        res.json({ success: true, data: cart, total });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export async function addItem(req: any, res: Response) {
    try {
        const { productId, quantity } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: "productId không được để trống" });
        }

        const cart = await CartModel.addItem(
            req.session,
            Number(productId),
            Number(quantity) || 1
        );

        res.json({ success: true, data: cart });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
}

export async function updateItem(req: any, res: Response) {
    try {
        const { productId, quantity } = req.body;

        const cart = CartModel.updateItem(
            req.session,
            Number(productId),
            Number(quantity)
        );

        res.json({ success: true, data: cart });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
}

export function removeItem(req: any, res: Response) {
    try {
        const { productId } = req.params;

        const cart = CartModel.removeItem(req.session, Number(productId));

        res.json({ success: true, data: cart });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
}

export function clear(req: any, res: Response) {
    try {
        CartModel.clearCart(req.session);
        res.json({ success: true, message: "Đã xóa toàn bộ giỏ hàng" });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
}
