import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// --- Types ---
interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string; // Để hiển thị trong giỏ hàng
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  totalAmount: number;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantityToAdd: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Key dùng trong localStorage
const CART_STORAGE_KEY = 'techstore_cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Tải giỏ hàng từ localStorage khi component mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart data from localStorage", e);
        setCartItems([]);
      }
    }
    setIsLoading(false);
  }, []);

  // 2. Đồng bộ giỏ hàng với localStorage mỗi khi cartItems thay đổi
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isLoading]);

  // --- Logic Chức năng Giỏ hàng ---

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantityToAdd: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.product_id === item.product_id);

      if (existingItem) {
        // Nếu sản phẩm đã có: Tăng số lượng
        return prevItems.map(i =>
          i.product_id === item.product_id
            ? { ...i, quantity: i.quantity + quantityToAdd }
            : i
        );
      } else {
        // Nếu sản phẩm chưa có: Thêm mới
        return [...prevItems, { ...item, quantity: quantityToAdd }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(i => i.product_id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      return removeFromCart(productId);
    }
    setCartItems(prevItems =>
      prevItems.map(i =>
        i.product_id === productId ? { ...i, quantity: newQuantity } : i
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Tính toán tổng số lượng và tổng tiền
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);


  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        totalAmount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};