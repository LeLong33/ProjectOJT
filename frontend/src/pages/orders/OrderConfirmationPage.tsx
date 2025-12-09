import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from '@/pages/Navbar';
import { Footer } from '@/pages/Footer';
import { CheckCircle, Package, Truck, MapPin, CreditCard, Download, Home, ShoppingBag, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Interface dữ liệu từ Backend trả về
interface OrderItem {
  product_id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  price_at_order: number;
}

interface OrderDetail {
  order_id: number;
  createdAt: string;
  status: string;
  payment_method: string;
  final_amount: number;
  recipient_name: string;
  phone_number: string;
  address: string;
  district: string;
  city: string;
  items: OrderItem[];
}

export default function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Lấy ID đơn hàng từ state chuyển hướng
  const orderId = location.state?.orderId;

  useEffect(() => {
    // Nếu không có orderId (truy cập trực tiếp link), quay về trang chủ
    if (!orderId) {
      navigate('/');
      return;
    }

    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        const res = await axios.get(`${API_URL}/orders/${orderId}`, { headers });
        if (res.data.success) {
          setOrder(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi tải đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#007AFF]" />
      </div>
    );
  }

  if (!order) return null;

  // Tính tạm tính (để hiển thị tách biệt phí ship nếu cần)
  const subtotal = order.items.reduce((sum, item) => sum + item.price_at_order * item.quantity, 0);
  const shippingFee = order.final_amount - subtotal; // Giả định phí ship là phần chênh lệch

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar cartCount={0} /> {/* Giỏ hàng vừa đặt xong nên count = 0 */}
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Success Message */}
          <div className="text-center mb-12 animate-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-4xl mb-3 font-bold">Đặt Hàng Thành Công!</h1>
            <p className="text-xl text-gray-400 mb-2">
              Cảm ơn bạn đã mua hàng tại TechStore
            </p>
            <p className="text-gray-500">
              Mã đơn hàng: <span className="text-[#007AFF] font-mono font-bold text-lg">#{order.order_id}</span>
            </p>
          </div>

          {/* Order Status Timeline (Minh họa trạng thái hiện tại) */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl mb-6">Trạng Thái Đơn Hàng</h2>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-800" />
              <div className="space-y-8">
                {/* Step 1: Active */}
                <div className="relative flex gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-lg shadow-green-500/20">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-lg mb-1 text-white font-medium">Đơn hàng đã đặt</h3>
                    <p className="text-sm text-gray-400">{formatDate(order.createdAt)} - Đang chờ xác nhận</p>
                  </div>
                </div>
                
                {/* Step 2: Inactive */}
                <div className="relative flex gap-4 opacity-50">
                  <div className="w-12 h-12 bg-[#1a1a1a] border-2 border-gray-700 rounded-full flex items-center justify-center flex-shrink-0 z-10">
                    <Package className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-lg mb-1 text-gray-500">Đang chuẩn bị hàng</h3>
                  </div>
                </div>

                {/* Step 3: Inactive */}
                <div className="relative flex gap-4 opacity-50">
                  <div className="w-12 h-12 bg-[#1a1a1a] border-2 border-gray-700 rounded-full flex items-center justify-center flex-shrink-0 z-10">
                    <Truck className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-lg mb-1 text-gray-500">Đang vận chuyển</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Chi Tiết Đơn Hàng</h2>
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 border border-gray-800 hover:border-[#007AFF] rounded-lg transition-colors text-sm">
                <Download className="w-4 h-4" />
                Tải hóa đơn
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-800">
              {order.items.map((item) => (
                <div key={item.product_id} className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-700 p-1">
                    <img src={item.product_image} alt={item.product_name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-medium line-clamp-2">{item.product_name}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Số lượng: {item.quantity}</span>
                      <span className="text-[#007AFF] font-medium">{formatPrice(item.price_at_order * item.quantity)}</span>
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
                <span>{formatPrice(shippingFee)}</span>
              </div>
              <div className="pt-4 border-t border-gray-800 flex justify-between text-xl font-bold">
                <span>Tổng cộng</span>
                <span className="text-[#007AFF]">{formatPrice(order.final_amount)}</span>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Địa chỉ */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-[#007AFF]" />
                <h3 className="text-lg font-bold">Địa Chỉ Nhận Hàng</h3>
              </div>
              <div className="text-gray-300 space-y-1 text-sm">
                <p className="font-medium text-white text-base">{order.recipient_name}</p>
                <p>{order.phone_number}</p>
                <p className="text-gray-400 mt-2">{order.address}</p>
                <p className="text-gray-400">{order.district}, {order.city}</p>
              </div>
            </div>

            {/* Thanh toán */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-[#007AFF]" />
                <h3 className="text-lg font-bold">Thanh Toán</h3>
              </div>
              <div className="text-gray-300 space-y-1 text-sm">
                <p>Phương thức: <span className="uppercase font-medium text-white">{order.payment_method}</span></p>
                <p>Trạng thái: <span className="text-yellow-500">{order.status}</span></p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-[#007AFF] hover:bg-[#0051D5] rounded-xl transition-colors font-medium"
            >
              <Package className="w-5 h-5" />
              Quản lý đơn hàng
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 border border-gray-700 hover:border-gray-500 rounded-xl transition-colors font-medium"
            >
              <ShoppingBag className="w-5 h-5" />
              Tiếp tục mua sắm
            </button>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}