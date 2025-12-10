import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function PaymentResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const resultCode = searchParams.get('resultCode');
    const orderId = searchParams.get('orderId');
    
    console.log('🔍 Payment Result - resultCode:', resultCode);
    console.log('🔍 Payment Result - orderId:', orderId);
    console.log('🔍 All params:', Object.fromEntries(searchParams));

    if (resultCode === '0') {
      setStatus('success');
      // Trích xuất orderId gốc (bỏ timestamp)
      const originalOrderId = orderId?.split('_')[0];
      console.log('✅ Payment success - Original orderId:', originalOrderId);
      
      // Chuyển hướng sau 3 giây
      setTimeout(() => {
        navigate('/order-confirmation', { state: { orderId: originalOrderId } });
      }, 3000);
    } else {
      setStatus('error');
      console.log('❌ Payment failed - resultCode:', resultCode);
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <div className="max-w-md w-full bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-[#007AFF] mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl mb-2">Đang xử lý...</h2>
            <p className="text-gray-400">Vui lòng chờ trong giây lát</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl mb-2">Thanh toán thành công!</h2>
            <p className="text-gray-400 mb-6">Đơn hàng của bạn đã được xác nhận</p>
            <button
              onClick={() => {
                const orderId = searchParams.get('orderId')?.split('_')[0];
                navigate('/order-confirmation', { state: { orderId } });
              }}
              className="px-6 py-3 bg-[#007AFF] hover:bg-[#0051D5] rounded-lg transition-colors"
            >
              Xem đơn hàng
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl mb-2">Thanh toán thất bại</h2>
            <p className="text-gray-400 mb-6">
              Đã có lỗi xảy ra. Vui lòng thử lại hoặc chọn phương thức khác.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/checkout')}
                className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Thử lại
              </button>
              <button
                onClick={() => navigate('/products')}
                className="flex-1 px-6 py-3 bg-[#007AFF] hover:bg-[#0051D5] rounded-lg transition-colors"
              >
                Tiếp tục mua
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}