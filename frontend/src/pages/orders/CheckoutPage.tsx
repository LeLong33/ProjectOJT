import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/pages/Navbar';
import { Footer } from '@/pages/Footer';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import { Check, CreditCard, Truck, MapPin, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface CheckoutPageProps {
  onNavigate?: (page: string) => void;
  cartCount: number;
}

// Interface Địa chỉ (Đã bỏ ward)
interface SavedAddress {
  address_id: number;
  recipient_name: string;
  phone_number: string;
  address: string;
  district: string;
  city: string;
  is_default: number;
}

export function CheckoutPage({ cartCount }: CheckoutPageProps) {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const cart = cartItems; 
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('token');

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | 'new'>('new');

  // 1. State Form: Xóa hoàn toàn ward
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    district: '',
    city: '',
    shippingMethod: 'standard',
    paymentMethod: 'cod',
    agreeTerms: false,
    cardNumber: '', cardName: '', cardExpiry: '', cardCvv: '',
  });

  // Load data
  useEffect(() => {
    const initData = async () => {
      if (token) {
        try {
          const [profileRes, addrRes] = await Promise.all([
            axios.get(`${API_URL}/users/profile`, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(`${API_URL}/users/addresses`, { headers: { Authorization: `Bearer ${token}` } })
          ]);

          setFormData(prev => ({ ...prev, email: profileRes.data.data.email || '' }));

          if (addrRes.data.success && addrRes.data.data.length > 0) {
            setSavedAddresses(addrRes.data.data);
            const defaultAddr = addrRes.data.data.find((a: SavedAddress) => a.is_default === 1);
            if (defaultAddr) handleSelectAddress(defaultAddr);
          }
        } catch (error) {
          console.error("Lỗi load data:", error);
        }
      }
    };
    initData();
  }, [token]);

  const handleSelectAddress = (addr: SavedAddress) => {
      setSelectedAddressId(addr.address_id);
      setFormData(prev => ({
          ...prev,
          fullName: addr.recipient_name,
          phone: addr.phone_number,
          address: addr.address,
          district: addr.district,
          city: addr.city
      }));
  };

  const handleNewAddress = () => {
      setSelectedAddressId('new');
      setFormData(prev => ({
          ...prev,
          fullName: '', phone: '', address: '', district: '', city: ''
      }));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = formData.shippingMethod === 'express' ? 500000 : 200000;
  const total = subtotal + shippingCost;
  const formatPrice = (p: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
        if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.district) {
            toast.error("Vui lòng điền đầy đủ thông tin giao hàng");
            return;
        }
    }
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  // --- HÀM ĐẶT HÀNG (QUAN TRỌNG) ---
  const handlePlaceOrder = async () => {
    if (!formData.agreeTerms) return toast.error('Vui lòng đồng ý điều khoản');

    try {
      setIsLoading(true);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // ✅ CHUẨN BỊ PAYLOAD
      const payload: any = {
        payment_method: formData.paymentMethod,
        total_amount: total,
        items: cart.map(item => ({
            product_id: item.product_id, 
            quantity: item.quantity,
            price: item.price
        }))
      };

      // ✅ QUAN TRỌNG: Chỉ gửi address_id HOẶC thông tin địa chỉ đầy đủ
      if (selectedAddressId !== 'new' && typeof selectedAddressId === 'number') {
        // Trường hợp 1: Đã chọn địa chỉ có sẵn
        payload.address_id = selectedAddressId;
        console.log(`✅ Checkout with existing address ID: ${selectedAddressId}`);
      } else {
        // Trường hợp 2: Nhập địa chỉ mới
        payload.recipient_name = formData.fullName;
        payload.phone_number = formData.phone;
        payload.address = formData.address;
        payload.district = formData.district;
        payload.city = formData.city;
        console.log(`✅ Checkout with NEW address`);
      }

      console.log('📤 Sending order:', payload);

      const res = await axios.post(`${API_URL}/orders`, payload, { headers });

      if (res.data.success) {
        const orderId = res.data.orderId;
        
        // Nếu là chuyển khoản -> Gọi MoMo
        if (formData.paymentMethod === 'transfer') {
          toast.success("Đơn hàng đã tạo! Đang chuyển đến thanh toán...");
          
          try {
            const paymentRes = await axios.post(`${API_URL}/payment/momo/create`, {
              orderId,
              amount: total
            });

            if (paymentRes.data.success) {
              clearCart();
              window.location.href = paymentRes.data.payUrl;
            } else {
              toast.error("Không thể tạo link thanh toán");
            }
          } catch (error) {
            console.error(error);
            toast.error("Lỗi kết nối MoMo");
          }
        } else {
          // COD - hoàn tất
          toast.success("Đặt hàng thành công!");
          clearCart(); 
          setTimeout(() => {
            navigate('/order-confirmation', { state: { orderId } }); 
          }, 500);
        }
      }
    } catch (error: any) {
      console.error('❌ Order error:', error);
      toast.error(error.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
};
  const steps = [
    { id: 1, name: 'Thông tin', icon: <MapPin className="w-5 h-5" /> },
    { id: 2, name: 'Vận chuyển', icon: <Truck className="w-5 h-5" /> },
    { id: 3, name: 'Thanh toán', icon: <CreditCard className="w-5 h-5" /> },
    { id: 4, name: 'Xác nhận', icon: <Check className="w-5 h-5" /> },
  ];

  if (cart.length === 0) return <div className="min-h-screen bg-[#0a0a0a] text-white pt-20 flex flex-col items-center justify-center"><h2 className="text-2xl mb-4">Giỏ hàng trống</h2><button onClick={() => navigate('/products')} className="text-blue-500 hover:underline">Mua sắm ngay</button></div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar cartCount={cartCount} />
      <Toaster position="top-right" theme="dark" />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl mb-8">Thanh Toán</h1>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${currentStep >= step.id ? 'bg-[#007AFF] border-[#007AFF] text-white' : 'bg-[#1a1a1a] border-gray-800 text-gray-500'}`}>
                      {currentStep > step.id ? <Check className="w-6 h-6" /> : step.icon}
                    </div>
                    <span className={`text-sm mt-2 ${currentStep >= step.id ? 'text-white' : 'text-gray-500'}`}>{step.name}</span>
                  </div>
                  {index < steps.length - 1 && <div className={`h-0.5 flex-1 mx-2 transition-all ${currentStep > step.id ? 'bg-[#007AFF]' : 'bg-gray-800'}`} />}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8">
                
                {/* STEP 1: INFO (BỎ WARD) */}
                {currentStep === 1 && (
                  <div className="animate-in fade-in slide-in-from-left-4">
                    <h2 className="text-2xl mb-6">Thông Tin Giao Hàng</h2>
                    
                    {isAuthenticated && savedAddresses.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase">Chọn từ sổ địa chỉ</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {savedAddresses.map((addr) => (
                                    <div key={addr.address_id} onClick={() => handleSelectAddress(addr)}
                                        className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedAddressId === addr.address_id ? 'border-[#007AFF] bg-[#007AFF]/10 ring-1 ring-[#007AFF]' : 'border-gray-800 hover:border-gray-600 bg-[#111]'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-white">{addr.recipient_name}</span>
                                            {addr.is_default === 1 && <span className="text-[10px] bg-[#007AFF] text-white px-1.5 py-0.5 rounded">Mặc định</span>}
                                        </div>
                                        <p className="text-sm text-gray-400">{addr.phone_number}</p>
                                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{addr.address}, {addr.district}, {addr.city}</p>
                                    </div>
                                ))}
                                <div onClick={handleNewAddress} className={`p-4 border border-dashed rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2 transition-all ${selectedAddressId === 'new' ? 'border-[#007AFF] text-[#007AFF] bg-[#007AFF]/5' : 'border-gray-800 text-gray-500 hover:border-gray-600'}`}>
                                    <PlusCircle className="w-6 h-6" /><span className="text-sm font-medium">Nhập địa chỉ mới</span>
                                </div>
                            </div>
                            <div className="w-full h-px bg-gray-800 my-6"></div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2"><label className="block text-sm text-gray-400 mb-2">Họ và tên *</label><input value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:border-[#007AFF] outline-none"/></div>
                      <div><label className="block text-sm text-gray-400 mb-2">Số điện thoại *</label><input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:border-[#007AFF] outline-none"/></div>
                      <div><label className="block text-sm text-gray-400 mb-2">Email</label><input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:border-[#007AFF] outline-none"/></div>
                      <div className="md:col-span-2"><label className="block text-sm text-gray-400 mb-2">Địa chỉ cụ thể *</label><input value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:border-[#007AFF] outline-none" placeholder="Số nhà, đường..."/></div>
                      {/* BỎ INPUT WARD */}
                      <div><label className="block text-sm text-gray-400 mb-2">Quận/Huyện *</label><input value={formData.district} onChange={(e) => handleInputChange('district', e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:border-[#007AFF] outline-none" placeholder="Quận..."/></div>
                      <div><label className="block text-sm text-gray-400 mb-2">Tỉnh/Thành phố *</label><input value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:border-[#007AFF] outline-none" placeholder="TP.HCM"/></div>
                    </div>
                  </div>
                )}

                {/* Các Step 2, 3, 4 giữ nguyên */}
                {currentStep === 2 && (
                  <div className="animate-in fade-in slide-in-from-right-4"><h2 className="text-2xl mb-6">Phương Thức Vận Chuyển</h2>
                    <div className="space-y-4">
                      <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.shippingMethod === 'standard' ? 'border-[#007AFF] bg-[#007AFF]/5' : 'border-gray-800'}`}><input type="radio" name="shipping" value="standard" checked={formData.shippingMethod === 'standard'} onChange={(e) => handleInputChange('shippingMethod', e.target.value)} className="w-5 h-5 text-[#007AFF]" /><div className="flex-1 flex justify-between"><div><div className="font-medium">Tiêu chuẩn</div><div className="text-sm text-gray-400">3-5 ngày</div></div><div className="text-[#007AFF]">{formatPrice(200000)}</div></div></label>
                      <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.shippingMethod === 'express' ? 'border-[#007AFF] bg-[#007AFF]/5' : 'border-gray-800'}`}><input type="radio" name="shipping" value="express" checked={formData.shippingMethod === 'express'} onChange={(e) => handleInputChange('shippingMethod', e.target.value)} className="w-5 h-5 text-[#007AFF]" /><div className="flex-1 flex justify-between"><div><div className="font-medium">Nhanh</div><div className="text-sm text-gray-400">1-2 ngày</div></div><div className="text-[#007AFF]">{formatPrice(500000)}</div></div></label>
                    </div>
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="animate-in fade-in slide-in-from-right-4"><h2 className="text-2xl mb-6">Thanh Toán</h2><div className="space-y-4">
                        <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer ${formData.paymentMethod === 'cod' ? 'border-[#007AFF]' : 'border-gray-800'}`}><input type="radio" name="payment" value="cod" checked={formData.paymentMethod === 'cod'} onChange={(e) => handleInputChange('paymentMethod', e.target.value)} className="w-5 h-5"/><div><div className="font-medium">Thanh toán khi nhận hàng (COD)</div></div></label>
                        <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer ${formData.paymentMethod === 'transfer' ? 'border-[#007AFF]' : 'border-gray-800'}`}><input type="radio" name="payment" value="transfer" checked={formData.paymentMethod === 'transfer'} onChange={(e) => handleInputChange('paymentMethod', e.target.value)} className="w-5 h-5"/><div><div className="font-medium">Chuyển khoản ngân hàng</div></div></label>
                    </div></div>
                )}
                {currentStep === 4 && (
                  <div className="animate-in fade-in slide-in-from-right-4"><h2 className="text-2xl mb-6">Xác Nhận</h2>
                    <div className="space-y-6 text-sm"><div className="border-b border-gray-800 pb-4"><h3 className="text-gray-400 mb-2">Giao tới</h3><p className="font-medium text-lg text-white">{formData.fullName}</p><p className="text-gray-300">{formData.phone}</p><p className="text-gray-300">{formData.address}, {formData.district}, {formData.city}</p></div><div className="border-b border-gray-800 pb-4"><h3 className="text-gray-400 mb-2">Thanh toán</h3><p className="capitalize text-white">{formData.paymentMethod === 'cod' ? 'Tiền mặt (COD)' : 'Chuyển khoản'}</p></div><label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" checked={formData.agreeTerms} onChange={(e) => handleInputChange('agreeTerms', e.target.checked)} className="w-5 h-5 mt-0.5 rounded bg-[#0a0a0a] border-gray-600 text-[#007AFF]"/><span className="text-gray-400">Tôi đồng ý điều khoản.</span></label></div>
                  </div>
                )}

                <div className="flex gap-4 mt-8 pt-8 border-t border-gray-800">
                  {currentStep > 1 && <button onClick={() => setCurrentStep(c => c - 1)} className="px-8 py-3 border border-gray-800 hover:border-[#007AFF] rounded-lg transition-colors">Quay lại</button>}
                  {currentStep < 4 ? <button onClick={handleNextStep} className="flex-1 px-8 py-3 bg-[#007AFF] hover:bg-[#0051D5] rounded-lg transition-colors">Tiếp tục</button> : 
                  <button onClick={handlePlaceOrder} disabled={isLoading || !formData.agreeTerms} className="flex-1 px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50">{isLoading ? 'Đang xử lý...' : 'Đặt hàng ngay'}</button>}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl mb-6">Đơn Hàng ({cart.length})</h2>
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-800 max-h-96 overflow-y-auto custom-scrollbar">
                  {cart.map((item) => (
                    <div key={item.product_id} className="flex gap-3">
                      <img src={item.image_url} className="w-16 h-16 bg-[#0a0a0a] rounded-lg object-contain border border-gray-800"/>
                      <div className="flex-1"><h4 className="text-sm mb-1 line-clamp-2">{item.name}</h4><div className="flex justify-between text-sm"><span className="text-gray-400">x{item.quantity}</span><span className="text-[#007AFF]">{formatPrice(item.price)}</span></div></div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-400"><span>Tạm tính</span><span>{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between text-gray-400"><span>Vận chuyển</span><span>{formatPrice(shippingCost)}</span></div>
                  <div className="pt-3 border-t border-gray-800 flex justify-between text-xl font-bold"><span>Tổng cộng</span><span className="text-[#007AFF]">{formatPrice(total)}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ✅ QUAN TRỌNG: Thêm dòng export default này để App.tsx import không bị lỗi trắng màn hình
export default CheckoutPage;