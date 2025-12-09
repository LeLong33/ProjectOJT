import db from '../config/database';

export interface CartItem {
    cart_item_id?: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    price: number;
    created_at?: Date;
}

export interface Cart {
    cart_id?: number;
    account_id: number;
    total_price: number;
    created_at?: Date;
    updated_at?: Date;
}

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (accountId: number, productId: number, quantity: number, price: number) => {
    try {
        const query = `
            INSERT INTO cart_items (cart_id, product_id, quantity, price)
            VALUES ((SELECT cart_id FROM carts WHERE account_id = ?), ?, ?, ?)
        `;
        const [result]: any = await db.execute(query, [accountId, productId, quantity, price]);
        return result;
    } catch (err) {
        throw err;
    }
};

// Lấy giỏ hàng của người dùng
export const getCart = async (accountId: number) => {
    try {
        const query = `
            SELECT ci.*, p.product_name, p.product_image 
            FROM cart_items ci
            JOIN carts c ON ci.cart_id = c.cart_id
            JOIN products p ON ci.product_id = p.product_id
            WHERE c.account_id = ?
        `;
        const [rows] = await db.execute(query, [accountId]);
        return rows;
    } catch (err) {
        throw err;
    }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (cartItemId: number) => {
    try {
        const query = `DELETE FROM cart_items WHERE cart_item_id = ?`;
        const [result]: any = await db.execute(query, [cartItemId]);
        return result;
    } catch (err) {
        throw err;
    }
};

// Cập nhật số lượng sản phẩm
export const updateCartItem = async (cartItemId: number, quantity: number) => {
    try {
        const query = `UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?`;
        const [result]: any = await db.execute(query, [quantity, cartItemId]);
        return result;
    } catch (err) {
        throw err;
    }
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (accountId: number) => {
    try {
        const query = `
            DELETE FROM cart_items 
            WHERE cart_id = (SELECT cart_id FROM carts WHERE account_id = ?)
        `;
        const [result]: any = await db.execute(query, [accountId]);
        return result;
    } catch (err) {
        throw err;
    }
};