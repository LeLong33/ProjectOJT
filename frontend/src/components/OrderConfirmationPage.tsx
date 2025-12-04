import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CheckCircle, Package, Truck, MapPin, CreditCard, Download } from 'lucide-react';

interface OrderConfirmationPageProps {
  onNavigate: (page: string) => void;
  cartCount: number;
}

export function OrderConfirmationPage({ onNavigate, cartCount }: OrderConfirmationPageProps) {
  const orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const orderDate = new Date().toLocaleDateString('vi-VN');

  const orderItems = [
    {
      id: 1,
      name: 'Laptop ASUS ROG Strix G16',
      price: 42990000,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1658262548679-776e437f95e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjB0ZWNofGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      name: 'Chuột Logitech G Pro X',
      price: 1790000,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1660491083562-d91a64d6ea9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMG1vdXNlfGVufDF8fHx8MTc2Mzk2NDI5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 200000;
  const total = subtotal + shipping;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar 
        cartCount={0} 
        onNavigateToCart={() => onNavigate('cart')}
        onNavigateToAccount={() => onNavigate('account')}
      />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-4xl mb-3">Đặt Hàng Thành Công!</h1>
            <p className="text-xl text-gray-400 mb-2">
              Cảm ơn bạn đã mua hàng tại TechStore
            </p>
            <p className="text-gray-500">
              Mã đơn hàng: <span className="text-[#007AFF] font-mono">{orderNumber}</span>
            </p>
          </div>

          {/* Order Status Timeline */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl mb-6">Trạng Thái Đơn Hàng</h2>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-800" />
              <div className="space-y-8">
                <div className="relative flex gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 z-10">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-lg mb-1">Đơn hàng đã đặt</h3>
                    <p className="text-sm text-gray-400">{orderDate} - Đơn hàng của bạn đã được xác nhận</p>
                  </div>
                </div>
                <div className="relative flex gap-4">
                  <div className="w-12 h-12 bg-[#1a1a1a] border-2 border-gray-800 rounded-full flex items-center justify-center flex-shrink-0 z-10">
                    <Package className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-lg mb-1 text-gray-500">Đang chuẩn bị hàng</h3>
                    <p className="text-sm text-gray-500">Chúng tôi đang chuẩn bị sản phẩm của bạn</p>
                  </div>
                </div>
                <div className="relative flex gap-4">
                  <div className="w-12 h-12 bg-[#1a1a1a] border-2 border-gray-800 rounded-full flex items-center justify-center flex-shrink-0 z-10">
                    <Truck className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-lg mb-1 text-gray-500">Đang vận chuyển</h3>
                    <p className="text-sm text-gray-500">Đơn hàng đang trên đường giao đến bạn</p>
                  </div>
                </div>
                <div className="relative flex gap-4">
                  <div className="w-12 h-12 bg-[#1a1a1a] border-2 border-gray-800 rounded-full flex items-center justify-center flex-shrink-0 z-10">
                    <MapPin className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-lg mb-1 text-gray-500">Giao hàng thành công</h3>
                    <p className="text-sm text-gray-500">Bạn đã nhận được hàng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Chi Tiết Đơn Hàng</h2>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-800 hover:border-[#007AFF] rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Tải hóa đơn
              </button>
            </div>

            {/* Items */}
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-800">
              {orderItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-[#0a0a0a] rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2">{item.name}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Số lượng: {item.quantity}</span>
                      <span className="text-[#007AFF]">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-3">
              <div className="flex justify-between text-gray-400">
                <span>Tạm tính</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Phí vận chuyển</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              <div className="pt-3 border-t border-gray-800 flex justify-between text-xl">
                <span>Tổng cộng</span>
                <span className="text-[#007AFF]">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-[#007AFF]" />
                <h3 className="text-lg">Địa Chỉ Giao Hàng</h3>
              </div>
              <div className="text-gray-400 space-y-1">
                <p>Nguyễn Văn A</p>
                <p>0901234567</p>
                <p>123 Nguyễn Huệ, Phường Bến Nghé</p>
                <p>Quận 1, TP. Hồ Chí Minh</p>
              </div>
            </div>

            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-[#007AFF]" />
                <h3 className="text-lg">Thanh Toán</h3>
              </div>
              <div className="text-gray-400 space-y-1">
                <p>Thanh toán khi nhận hàng (COD)</p>
                <p>Giao hàng tiêu chuẩn (3-5 ngày)</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onNavigate('account')}
              className="flex-1 px-8 py-4 bg-[#007AFF] hover:bg-[#0051D5] rounded-lg transition-colors"
            >
              Xem đơn hàng
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="flex-1 px-8 py-4 border border-gray-800 hover:border-[#007AFF] rounded-lg transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>

          {/* Help Info */}
          <div className="mt-8 p-6 bg-[#007AFF]/10 border border-[#007AFF]/30 rounded-2xl">
            <h3 className="text-lg mb-2">Cần hỗ trợ?</h3>
            <p className="text-gray-400 mb-4">
              Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với chúng tôi
            </p>
            <div className="flex gap-4 text-sm">
              <a href="tel:1900-1234" className="text-[#007AFF] hover:underline">
                Hotline: 1900 1234
              </a>
              <span className="text-gray-600">|</span>
              <a href="mailto:support@techstore.vn" className="text-[#007AFF] hover:underline">
                support@techstore.vn
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}