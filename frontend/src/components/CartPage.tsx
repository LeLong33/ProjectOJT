import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

interface CartPageProps {
  onNavigate: (page: string) => void;
  cartCount: number;
  onUpdateCart: (count: number) => void;
}

export function CartPage({ onNavigate, cartCount, onUpdateCart }: CartPageProps) {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Laptop ASUS ROG Strix G16',
      price: 42990000,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1658262548679-776e437f95e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjB0ZWNofGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      specs: 'Intel Core i7, RTX 4070, 16GB RAM',
    },
    {
      id: 2,
      name: 'Chuột Logitech G Pro X',
      price: 1790000,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1660491083562-d91a64d6ea9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMG1vdXNlfGVufDF8fHx8MTc2Mzk2NDI5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      specs: 'Wireless, RGB, 25K DPI',
    },
  ]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
    onUpdateCart(cartCount - 1);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50000000 ? 0 : 200000;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar 
        cartCount={cartCount} 
        onNavigateToCart={() => onNavigate('cart')}
        onNavigateToAccount={() => onNavigate('account')}
      />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl mb-8">Giỏ Hàng ({cartItems.length})</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-24 h-24 mx-auto text-gray-700 mb-4" />
              <h2 className="text-2xl mb-2">Giỏ hàng trống</h2>
              <p className="text-gray-400 mb-8">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục</p>
              <button
                onClick={() => onNavigate('home')}
                className="px-8 py-3 bg-[#007AFF] hover:bg-[#0051D5] rounded-lg transition-colors"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 flex gap-6"
                  >
                    {/* Image */}
                    <div className="w-32 h-32 bg-[#0a0a0a] rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="text-xl mb-2">{item.name}</h3>
                      <p className="text-sm text-gray-400 mb-4">{item.specs}</p>
                      <div className="text-2xl text-[#007AFF]">
                        {formatPrice(item.price)}
                      </div>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <div className="flex items-center border border-gray-800 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-[#0a0a0a] transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 min-w-[60px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-[#0a0a0a] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 sticky top-24">
                  <h2 className="text-2xl mb-6">Tóm Tắt Đơn Hàng</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-400">
                      <span>Tạm tính</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Phí vận chuyển</span>
                      <span>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
                    </div>
                    {shipping === 0 && (
                      <div className="text-sm text-green-500">
                        ✓ Miễn phí vận chuyển cho đơn hàng trên 50 triệu
                      </div>
                    )}
                    <div className="border-t border-gray-800 pt-4 flex justify-between text-xl">
                      <span>Tổng cộng</span>
                      <span className="text-[#007AFF]">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('checkout')}
                    className="w-full py-4 bg-[#007AFF] hover:bg-[#0051D5] rounded-lg transition-colors mb-3"
                  >
                    Tiến hành thanh toán
                  </button>

                  <button
                    onClick={() => onNavigate('home')}
                    className="w-full py-4 border border-gray-800 hover:border-[#007AFF] rounded-lg transition-colors"
                  >
                    Tiếp tục mua sắm
                  </button>

                  {/* Benefits */}
                  <div className="mt-6 pt-6 border-t border-gray-800 space-y-3 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="text-[#007AFF]">✓</span>
                      <span>Bảo hành chính hãng</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#007AFF]">✓</span>
                      <span>Đổi trả trong 7 ngày</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#007AFF]">✓</span>
                      <span>Hỗ trợ 24/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}