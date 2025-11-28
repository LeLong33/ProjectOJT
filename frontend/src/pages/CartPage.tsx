import React, { useState } from 'react';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, ArrowLeft, Tag, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

// Định nghĩa kiểu dữ liệu cho sản phẩm trong giỏ
interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  specs?: string;
  category: string;
}

export default function CartPage() {
  // Mock data - Dữ liệu giả lập
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Laptop Gaming ASUS ROG Strix G15',
      price: 25990000,
      originalPrice: 28990000,
      image: 'https://images.unsplash.com/photo-1603302576837-637886400716?auto=format&fit=crop&w=300&q=80',
      quantity: 1,
      specs: 'R7-6800H | 16GB | 512GB | RTX 3050',
      category: 'Laptop'
    },
    {
      id: 2,
      name: 'Bàn phím cơ Keychron K2 Pro',
      price: 2490000,
      image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=300&q=80',
      quantity: 2,
      specs: 'Wireless | RGB | Brown Switch',
      category: 'Phụ kiện'
    },
    {
      id: 3,
      name: 'Chuột Logitech G Pro X Superlight',
      price: 2990000,
      originalPrice: 3290000,
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=300&q=80',
      quantity: 1,
      specs: 'White | Wireless | <63g',
      category: 'Phụ kiện'
    }
  ]);

  const [couponCode, setCouponCode] = useState('');

  // Xử lý tăng giảm số lượng
  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  // Xử lý xóa sản phẩm
  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  // Tính toán tổng tiền
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = subtotal > 0 ? 30000 : 0; // Phí ship 30k, miễn phí nếu giỏ rỗng (logic ví dụ)
  const discount = 0; // Logic giảm giá có thể thêm sau
  const total = subtotal + shippingFee - discount;

  // Format tiền tệ VND
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // --- GIAO DIỆN GIỎ HÀNG TRỐNG ---
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-12 px-4 flex flex-col items-center justify-center text-white font-inter">
        <div className="bg-[#1a1a1a] p-8 rounded-full mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-500 mb-8 text-center text-sm">
            Hãy thêm vài món đồ công nghệ xịn sò vào đây nhé!
        </p>
        <Link 
            to="/" 
            className="flex items-center gap-2 bg-[#007AFF] hover:bg-[#0062cc] text-white px-6 py-2.5 rounded-lg font-medium transition-all"
        >
            <ArrowLeft className="w-4 h-4" />
            Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  // --- GIAO DIỆN CHÍNH ---
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Compact */}
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                Giỏ Hàng <span className="text-gray-500 text-base font-normal">({cartItems.length} sản phẩm)</span>
            </h1>
            <Link to="/" className="hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-[#007AFF] transition-colors">
                <ArrowLeft className="w-4 h-4" /> Tiếp tục mua sắm
            </Link>
        </div>

        {/* CẬP NHẬT: Dùng Flexbox thay vì Grid để ép chia cột chắc chắn hơn */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* LEFT COLUMN: Danh sách sản phẩm (Tự động co giãn chiếm phần còn lại) */}
            <div className="flex-1 w-full space-y-4">
                {cartItems.map((item) => (
                    <div key={item.id} className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800 flex gap-4 md:gap-6 items-start group hover:border-gray-700 transition-all">
                        
                        {/* 1. Product Image */}
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-lg flex-shrink-0 border border-gray-700/50 overflow-hidden">
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-contain p-1 mix-blend-multiply" 
                            />
                        </div>

                        {/* 2. Content Middle */}
                        <div className="flex-1 min-w-0 flex flex-col h-24 md:h-32 justify-between">
                            {/* Top: Name & Remove */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-bold text-[#007AFF] uppercase tracking-wider mb-0.5">{item.category}</p>
                                    <h3 className="text-sm md:text-lg font-semibold leading-tight text-gray-100 line-clamp-2 pr-2">
                                        <Link to={`/product/${item.id}`} className="hover:text-[#007AFF] transition-colors">
                                            {item.name}
                                        </Link>
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5 truncate hidden sm:block">{item.specs}</p>
                                </div>
                                <button 
                                    onClick={() => removeItem(item.id)}
                                    className="text-gray-600 hover:text-red-500 transition-colors p-1"
                                    title="Xóa"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Bottom: Quantity & Price */}
                            <div className="flex items-center justify-between">
                                {/* Quantity Control */}
                                <div className="flex items-center bg-[#0a0a0a] rounded-lg border border-gray-700 h-8 md:h-9">
                                    <button 
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="w-8 md:w-9 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-l-lg transition-colors"
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-8 md:w-10 text-center font-medium text-sm text-gray-200">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.id, 1)}
                                        className="w-8 md:w-9 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-r-lg transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>

                                {/* Price */}
                                <div className="text-right">
                                    {item.originalPrice && (
                                        <p className="text-[10px] text-gray-500 line-through mb-0.5">
                                            {formatCurrency(item.originalPrice * item.quantity)}
                                        </p>
                                    )}
                                    <p className="text-sm md:text-xl font-bold text-[#007AFF]">
                                        {formatCurrency(item.price * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* RIGHT COLUMN: Order Summary (Cố định chiều rộng, nằm bên phải) */}
            <div className="w-full md:w-[340px] lg:w-[380px] h-fit md:sticky md:top-24 lg:top-28">
                <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800 shadow-xl transition-all">
                    <h2 className="text-lg font-bold mb-4 pb-4 border-b border-gray-800">Thông tin thanh toán</h2>

                    <div className="space-y-3 mb-6 text-sm">
                        <div className="flex justify-between text-gray-400">
                            <span>Tạm tính</span>
                            <span className="text-gray-200">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                            <span>Phí vận chuyển</span>
                            <span className="text-gray-200">{formatCurrency(shippingFee)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                            <span>Giảm giá</span>
                            <span className="text-green-500 font-medium">-{formatCurrency(discount)}</span>
                        </div>
                        
                        <div className="pt-3 mt-3 border-t border-dashed border-gray-700 flex justify-between items-end">
                            <span className="text-base font-bold text-white">Tổng cộng</span>
                            <div className="text-right">
                                <span className="block text-xl font-bold text-[#007AFF]">{formatCurrency(total)}</span>
                                <span className="text-[10px] text-gray-500 font-normal">(Đã bao gồm VAT)</span>
                            </div>
                        </div>
                    </div>

                    {/* Coupon Input Compact */}
                    <div className="mb-4">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                                <input 
                                    type="text" 
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="Mã giảm giá"
                                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF] placeholder-gray-600"
                                />
                            </div>
                            <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-xs font-bold transition-colors border border-gray-700">
                                Áp dụng
                            </button>
                        </div>
                    </div>

                    <button className="w-full bg-[#007AFF] hover:bg-[#0062cc] text-white py-3.5 rounded-xl font-bold text-base shadow-lg shadow-[#007AFF]/20 transition-all flex items-center justify-center gap-2 group">
                        Tiến hành thanh toán
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 text-[10px] bg-[#0a0a0a] py-2 rounded-lg border border-gray-800/50">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Bảo mật thanh toán 100%</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}