// src/models/CartModel.ts
import { findProductById } from "./ProductModel";

export async function getCart(session: any) {
    if (!session.cart) session.cart = [];
    return session.cart;
}

export async function addItem(session: any, productId: number, quantity: number) {
    if (!session.cart) session.cart = [];

    // Kiểm tra sản phẩm thật trong DB
    const product = await findProductById(productId);
    if (!product || product.status === 0) {
        throw new Error("Sản phẩm không tồn tại hoặc đã bị vô hiệu hóa.");
    }

    const exist = session.cart.find((i: any) => i.productId === productId);
    if (exist) {
        exist.quantity += quantity;
    } else {
        session.cart.push({
            productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity
        });
    }
    return session.cart;
}

export function updateItem(session: any, productId: number, quantity: number) {
    if (!session.cart) session.cart = [];

    const item = session.cart.find((i: any) => i.productId === productId);
    if (!item) throw new Error("Sản phẩm không có trong giỏ hàng.");

    item.quantity = quantity;
    return session.cart;
}

export function removeItem(session: any, productId: number) {
    if (!session.cart) session.cart = [];

    session.cart = session.cart.filter((i: any) => i.productId !== productId);
    return session.cart;
}

export function clearCart(session: any) {
    session.cart = [];
    return [];
}
