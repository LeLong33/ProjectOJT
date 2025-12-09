import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, MapPin, CreditCard, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import axios from 'axios';

// Lấy URL API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Hàm format giá
function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

// Giả định địa chỉ và phương thức thanh toán
const shippingFee = 20000;
const paymentMethods = [
    { id: 'cod', name: 'Thanh toán khi nhận hàng (COD)', icon: CreditCard },
    { id: 'banking', name: 'Chuyển khoản Ngân hàng', icon: CreditCard },
];

export default function CheckoutPage() {
    const { cartItems, cartCount, totalAmount, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const api = axios.create({ baseURL: API_URL }); // Dùng axios mặc định

    // State cho Checkout
    const [addresses, setAddresses] = useState<any[]>([]); // Địa chỉ đã lưu của user
    const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string>('cod');
    const [isGuest, setIsGuest] = useState(!isAuthenticated);
    const [guestDetails, setGuestDetails] = useState({ name: '', phone: '', address: '' });
    const [loading, setLoading] = useState(false);
    const [orderMessage, setOrderMessage] = useState('');

    const finalAmount = totalAmount + shippingFee; // Tạm tính không có discount

    // 1. Fetch Địa chỉ đã lưu nếu user đã đăng nhập
    useEffect(() => {
        if (isAuthenticated) {
            const fetchAddresses = async () => {
                try {
                    // ⚠️ Cần tạo endpoint này ở Backend: GET /api/users/addresses
                    const res = await api.get('/users/addresses'); 
                    if (res.data.data.length > 0) {
                        setAddresses(res.data.data);
                        // Chọn địa chỉ mặc định hoặc địa chỉ đầu tiên
                        setSelectedAddress(res.data.data.find((a: any) => a.is_default)?.address_id || res.data.data[0].address_id);
                    }
                } catch (e) {
                    console.error("Failed to fetch addresses");
                }
            };
            fetchAddresses();
        }
    }, [isAuthenticated]);

    // 2. Xử lý Đặt hàng
    const handlePlaceOrder = async () => {
        setLoading(true);
        setOrderMessage('');

        // Kiểm tra điều kiện bắt buộc
        if (cartItems.length === 0) return;
        if (!isAuthenticated && (!guestDetails.name || !guestDetails.phone || !guestDetails.address)) {
            setOrderMessage('Vui lòng nhập đầy đủ thông tin giao hàng cho khách.');
            setLoading(false);
            return;
        }
        if (!isGuest && !selectedAddress) {
            setOrderMessage('Vui lòng chọn hoặc thêm địa chỉ giao hàng.');
            setLoading(false);
            return;
        }

        try {
            // Chuẩn bị dữ liệu cho OrderModel.createNewOrder (Backend)
            const orderPayload = {
                // Thông tin user/guest
                shippingAddressId: selectedAddress,
                paymentMethod: paymentMethod,
                
                // Chi tiết giá
                totalAmount: totalAmount,
                discountAmount: 0,
                finalAmount: finalAmount,
                
                // Thông tin Guest (nếu cần)
                guestDetails: isGuest ? guestDetails : undefined,

                // Items cần được chuẩn hóa để backend trừ kho
                items: cartItems.map(item => ({
                    productId: item.product_id,
                    quantity: item.quantity,
                    priceAtOrder: item.price // Giá đã được lưu từ lúc thêm vào giỏ
                }))
            };

            // ⚠️ GỌI API ĐẶT HÀNG (Endpoint Backend: POST /api/orders)
            const res = await api.post('/orders', orderPayload); 

            // Thành công: Xóa giỏ hàng và chuyển hướng
            clearCart();
            setOrderMessage(`✅ Đặt hàng thành công! Mã đơn hàng: ${res.data.order_id}`);
            setTimeout(() => navigate(`/order/${res.data.order_id}`), 2000);

        } catch (error: any) {
            console.error('Lỗi đặt hàng:', error);
            setOrderMessage(`❌ Lỗi: ${error.response?.data?.message || 'Không thể kết nối đến server đặt hàng.'}`);
        } finally {
            setLoading(false);
        }
    };


    if (cartItems.length === 0 && !orderMessage) {
        return (
            <div className="max-w-7xl mx-auto px-6 pt-10 text-center">
                 <h1 className="text-3xl font-bold mb-6 text-red-600">Thanh toán</h1>
                 <p className='text-gray-400'>Bạn cần thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
                 <Link to="/" className="mt-4 inline-block text-blue-400 underline">Quay lại mua sắm</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold mb-8 text-red-600">Xác nhận Thanh toán</h1>
            
            {orderMessage && (
                 <div className={`p-4 rounded-lg mb-6 text-white font-medium ${orderMessage.startsWith('❌') ? 'bg-red-500' : 'bg-green-500'}`}>{orderMessage}</div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                
                {/* Cột 1: Thông tin Giao hàng & Thanh toán (3/5) */}
                <div className="lg:col-span-3 space-y-6">
                    
                    {/* Phần 1: Thông tin Người nhận */}
                    <div className="p-6 bg-[#0f0f10] border border-gray-800 rounded-xl space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4 text-white"><MapPin className="w-5 h-5 text-red-400" /> Thông tin giao hàng</h2>

                        {isAuthenticated && (
                            <div className='mb-4'>
                                <input type="checkbox" id="isGuest" checked={isGuest} onChange={(e) => setIsGuest(e.target.checked)} className='mr-2'/>
                                <label htmlFor="isGuest" className='text-gray-400'>Tôi muốn mua với tư cách khách (Không dùng địa chỉ đã lưu)</label>
                            </div>
                        )}

                        {/* HIỂN THỊ ĐỊA CHỈ ĐÃ LƯU (Nếu là User) */}
                        {!isGuest && isAuthenticated && addresses.length > 0 && (
                            <div className="space-y-3">
                                <h3 className='text-lg font-medium text-gray-300'>Chọn địa chỉ đã lưu:</h3>
                                {addresses.map((addr) => (
                                    <label key={addr.address_id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${selectedAddress === addr.address_id ? 'bg-blue-600/30 border border-blue-500 text-white' : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700/50'}`}>
                                        <input 
                                            type="radio" 
                                            name="shipping_address" 
                                            value={addr.address_id} 
                                            checked={selectedAddress === addr.address_id}
                                            onChange={() => setSelectedAddress(addr.address_id)}
                                            className='form-radio text-red-600'
                                        />
                                        <div>
                                            <p className='font-semibold'>{addr.recipient_name} ({addr.phone_number})</p>
                                            <p className='text-sm'>{addr.address}, {addr.district}, {addr.city}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                        
                        {/* INPUT CHI TIẾT ĐỊA CHỈ (Nếu là Guest hoặc User không có địa chỉ lưu) */}
                        {(isGuest || !isAuthenticated) && (
                            <div className='space-y-4 pt-2 border-t border-gray-800'>
                                <h3 className='text-lg font-medium text-gray-300'>Nhập thông tin giao hàng:</h3>
                                <input type="text" placeholder="Họ và tên người nhận" value={guestDetails.name} onChange={(e) => setGuestDetails({...guestDetails, name: e.target.value})} className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400"/>
                                <input type="tel" placeholder="Số điện thoại" value={guestDetails.phone} onChange={(e) => setGuestDetails({...guestDetails, phone: e.target.value})} className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400"/>
                                <textarea placeholder="Địa chỉ chi tiết (Số nhà, đường, quận, thành phố)" value={guestDetails.address} onChange={(e) => setGuestDetails({...guestDetails, address: e.target.value})} rows={3} className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400"/>
                                {/* Lưu ý: Cần thêm logic nhập Quận/Thành phố/Quốc gia riêng biệt */}
                            </div>
                        )}
                    </div>

                    {/* Phần 2: Phương thức Thanh toán */}
                    <div className="p-6 bg-[#0f0f10] border border-gray-800 rounded-xl space-y-4">
                         <h2 className="text-2xl font-semibold flex items-center gap-2 text-white"><CreditCard className="w-5 h-5 text-red-400" /> Phương thức thanh toán</h2>
                         {paymentMethods.map(method => (
                             <label key={method.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${paymentMethod === method.id ? 'bg-blue-600/30 border border-blue-500 text-white' : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700/50'}`}>
                                <input 
                                    type="radio" 
                                    name="payment_method" 
                                    value={method.id} 
                                    checked={paymentMethod === method.id}
                                    onChange={() => setPaymentMethod(method.id)}
                                    className='form-radio text-red-600'
                                />
                                <method.icon className='w-5 h-5' />
                                <span className='font-semibold'>{method.name}</span>
                            </label>
                         ))}
                    </div>

                </div>

                {/* Cột 2: Tóm tắt Giỏ hàng & Nút Đặt hàng (2/5) */}
                <div className="lg:col-span-2 sticky top-28 h-fit">
                    <div className="p-6 bg-[#0f0f10] border border-gray-800 rounded-xl shadow-2xl space-y-4">
                        <h3 className="text-xl font-bold border-b border-gray-700 pb-3 text-white">Sản phẩm trong giỏ ({cartCount})</h3>
                        
                        {/* Danh sách Items */}
                        {cartItems.slice(0, 3).map(item => (
                            <div key={item.product_id} className="flex justify-between items-center text-sm text-gray-400">
                                <span className='truncate w-3/4'>{item.name} x {item.quantity}</span>
                                <span className='text-red-400 font-medium'>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                        ))}
                        {cartItems.length > 3 && <div className='text-sm text-gray-500'>+ {cartItems.length - 3} sản phẩm khác</div>}


                        <h3 className="text-xl font-bold border-t border-gray-700 pt-3 text-white mt-6">Chi tiết thanh toán</h3>
                        
                        <div className="flex justify-between text-gray-400 text-sm">
                            <span>Tạm tính:</span>
                            <span>{formatPrice(totalAmount)}</span>
                        </div>
                        
                        <div className="flex justify-between text-gray-400 text-sm">
                            <span>Phí vận chuyển:</span>
                            <span className='flex items-center gap-1 text-green-500'>
                                <Truck className='w-4 h-4'/> Miễn phí
                            </span>
                        </div>
                        
                        <div className="flex justify-between font-bold text-xl pt-2 border-t border-gray-700">
                            <span>TỔNG CỘNG:</span>
                            <span className="text-red-400">{formatPrice(finalAmount)}</span>
                        </div>

                        <button 
                            onClick={handlePlaceOrder}
                            disabled={loading || (isGuest && (!guestDetails.name || !guestDetails.phone))}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-xl font-semibold flex items-center justify-center transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Đang đặt hàng...' : 'XÁC NHẬN ĐẶT HÀNG'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}