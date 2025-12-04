import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CheckCircle, Package, Truck, MapPin, Download } from 'lucide-react';

export function OrderConfirmationPage() {
  const navigate = useNavigate();
  const orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const orderDate = new Date().toLocaleDateString('vi-VN');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/account')}
              className="flex-1 px-8 py-4 bg-[#007AFF] hover:bg-[#0051D5] rounded-lg transition-colors"
            >
              Xem đơn hàng
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 px-8 py-4 border border-gray-800 hover:border-[#007AFF] rounded-lg transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
