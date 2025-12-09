import { Request, Response } from 'express';
import * as CartModel from '../models/CartModel';

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req: Request, res: Response) => {
    try {
        const accountId = (req.user as any).account_id;
        const { product_id, quantity, price } = req.body;

        if (!product_id || !quantity || !price) {
            return res.status(400).json({ message: 'Thiếu thông tin sản phẩm' });
        }

        const result = await CartModel.addToCart(accountId, product_id, quantity, price);
        res.status(201).json({ 
            message: 'Thêm sản phẩm vào giỏ hàng thành công', 
            data: result 
        });
    } catch (err: any) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// Lấy giỏ hàng
export const getCart = async (req: Request, res: Response) => {
    try {
        const accountId = (req.user as any).account_id;
        const cart = await CartModel.getCart(accountId);
        
        res.status(200).json({ 
            message: 'Lấy giỏ hàng thành công', 
            data: cart 
        });
    } catch (err: any) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const { cartItemId } = req.params;
        
        if (!cartItemId) {
            return res.status(400).json({ message: 'Thiếu cart_item_id' });
        }

        await CartModel.removeFromCart(Number(cartItemId));
        res.status(200).json({ message: 'Xóa sản phẩm khỏi giỏ hàng thành công' });
    } catch (err: any) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// Cập nhật số lượng sản phẩm
export const updateCartItem = async (req: Request, res: Response) => {
    try {
        const { cartItemId } = req.params;
        const { quantity } = req.body;

        if (!cartItemId || !quantity) {
            return res.status(400).json({ message: 'Thiếu thông tin cập nhật' });
        }

        await CartModel.updateCartItem(Number(cartItemId), quantity);
        res.status(200).json({ message: 'Cập nhật số lượng thành công' });
    } catch (err: any) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (req: Request, res: Response) => {
    try {
        const accountId = (req.user as any).account_id;
        
        await CartModel.clearCart(accountId);
        res.status(200).json({ message: 'Xóa giỏ hàng thành công' });
    } catch (err: any) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};