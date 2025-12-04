import { useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Check, CreditCard, Truck, MapPin, Smartphone } from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
  cartCount: number;
  isLoggedIn?: boolean;
}

export function CheckoutPage({ onNavigate, cartCount, isLoggedIn = false }: CheckoutPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping Info
    fullName: isLoggedIn ? 'Nguyễn Văn A' : '',
    phone: isLoggedIn ? '0901234567' : '',
    email: isLoggedIn ? 'nguyen.van.a@email.com' : '',
    address: isLoggedIn ? '123 Nguyễn Huệ' : '',
    ward: isLoggedIn ? 'Phường Bến Nghé' : '',
    district: isLoggedIn ? 'Quận 1' : '',
    city: isLoggedIn ? 'TP. Hồ Chí Minh' : '',
    // Shipping Method
    shippingMethod: 'standard',
    // Payment Method
    paymentMethod: 'cod',
    // Card Info
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    // T&C
    agreeTerms: false,
  });

  const steps = [
    { id: 1, name: 'Thông tin', icon: <MapPin className="w-5 h-5" /> },
    { id: 2, name: 'Vận chuyển', icon: <Truck className="w-5 h-5" /> },
    { id: 3, name: 'Thanh toán', icon: <CreditCard className="w-5 h-5" /> },
    { id: 4, name: 'Xác nhận', icon: <Check className="w-5 h-5" /> },
  ];

  const cartItems = [
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

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = formData.shippingMethod === 'express' ? 500000 : 200000;
  const total = subtotal + shippingCost;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handlePlaceOrder = () => {
    if (!formData.agreeTerms) {
      alert('Vui lòng đồng ý với điều khoản và điều kiện');
      return;
    }
    onNavigate('order-confirmation');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar 
        cartCount={cartCount} 
        onNavigateToCart={() => onNavigate('cart')}
        onNavigateToAccount={() => onNavigate('account')}
      />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl mb-8">Thanh Toán</h1>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        currentStep >= step.id
                          ? 'bg-[#007AFF] border-[#007AFF] text-white'
                          : 'bg-[#1a1a1a] border-gray-800 text-gray-500'
                      }`}
                    >
                      {currentStep > step.id ? <Check className="w-6 h-6" /> : step.icon}
                    </div>
                    <span className={`text-sm mt-2 ${currentStep >= step.id ? 'text-white' : 'text-gray-500'}`}>
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 transition-all ${
                        currentStep > step.id ? 'bg-[#007AFF]' : 'bg-gray-800'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8">
                {/* Step 1: Shipping Information */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-2xl mb-6">Thông Tin Giao Hàng</h2>
                    {!isLoggedIn && (
                      <div className="mb-6 p-4 bg-[#007AFF]/10 border border-[#007AFF]/30 rounded-lg">
                        <p className="text-sm text-gray-300">
                          Bạn đã có tài khoản?{' '}
                          <button
                            onClick={() => onNavigate('login')}
                            className="text-[#007AFF] hover:underline"
                          >
                            Đăng nhập
                          </button>{' '}
                          để thanh toán nhanh hơn
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-400 mb-2">Họ và tên *</label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#007AFF]"
                          placeholder="Nguyễn Văn A"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Số điện thoại *</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#007AFF]"
                          placeholder="0901234567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Email *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#007AFF]"
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-400 mb-2">Địa chỉ *</label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#007AFF]"
                          placeholder="Số nhà, tên đường"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Phường/Xã *</label>
                        <input
                          type="text"
                          value={formData.ward}
                          onChange={(e) => handleInputChange('ward', e.target.value)}
                          className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#007AFF]"
                          placeholder="Phường Bến Nghé"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Quận/Huyện *</label>
                        <input
                          type="text"
                          value={formData.district}
                          onChange={(e) => handleInputChange('district', e.target.value)}
                          className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#007AFF]"
                          placeholder="Quận 1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-400 mb-2">Tỉnh/Thành phố *</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#007AFF]"
                          placeholder="TP. Hồ Chí Minh"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Shipping Method */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-2xl mb-6">Phương Thức Vận Chuyển</h2>
                    <div className="space-y-4">
                      <label className="flex items-center gap-4 p-4 border-2 border-gray-800 rounded-lg cursor-pointer hover:border-[#007AFF] transition-colors">
                        <input
                          type="radio"
                          name="shipping"
                          value="standard"
                          checked={formData.shippingMethod === 'standard'}
                          onChange={(e) => handleInputChange('shippingMethod', e.target.value)}
                          className="w-5 h-5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Giao hàng tiêu chuẩn</div>
                              <div className="text-sm text-gray-400">Giao trong 3-5 ngày</div>
                            </div>
                            <div className="text-[#007AFF]">{formatPrice(200000)}</div>
                          </div>
                        </div>
                      </label>
                      <label className="flex items-center gap-4 p-4 border-2 border-gray-800 rounded-lg cursor-pointer hover:border-[#007AFF] transition-colors">
                        <input
                          type="radio"
                          name="shipping"
                          value="express"
                          checked={formData.shippingMethod === 'express'}
                          onChange={(e) => handleInputChange('shippingMethod', e.target.value)}
                          className="w-5 h-5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Giao hàng nhanh</div>
                              <div className="text-sm text-gray-400">Giao trong 1-2 ngày</div>
                            </div>
                            <div className="text-[#007AFF]">{formatPrice(500000)}</div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment Method */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-2xl mb-6">Phương Thức Thanh Toán</h2>
                    <div className="space-y-4 mb-6">
                      <label className="flex items-center gap-4 p-4 border-2 border-gray-800 rounded-lg cursor-pointer hover:border-[#007AFF] transition-colors">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                          className="w-5 h-5"
                        />
                        <div className="flex-1">
                          <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
                          <div className="text-sm text-gray-400">Thanh toán bằng tiền mặt khi nhận hàng</div>
                        </div>
                      </label>
                      <label className="flex items-center gap-4 p-4 border-2 border-gray-800 rounded-lg cursor-pointer hover:border-[#007AFF] transition-colors">
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                          className="w-5 h-5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            <div className="font-medium">Thẻ tín dụng/ghi nợ</div>
                          </div>
                          <div className="text-sm text-gray-400">Visa, Mastercard, JCB</div>
                        </div>
                      </label>
                      <label className="flex items-center gap-4 p-4 border-2 border-gray-800 rounded-lg cursor-pointer hover:border-[#007AFF] transition-colors">
                        <input
                          type="radio"
                          name="payment"
                          value="momo"
                          checked={formData.paymentMethod === 'momo'}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                          className="w-5 h-5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-5 h-5" />
                            <div className="font-medium">Ví MoMo</div>
                          </div>
                          <div className="text-sm text-gray-400">Thanh toán qua ví điện tử MoMo</div>
                        </div>
                      </label>
                      <label className="flex items-center gap-4 p-4 border-2 border-gray-800 rounded-lg cursor-pointer hover:border-[#007AFF] transition-colors">
                        <input
                          type="radio"
                          name="payment"
                          value="transfer"
                          checked={formData.paymentMethod === 'transfer'}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                          className="w-5 h-5"
                        />
                        <div className="flex-1">
                          <div className="font-medium">Chuyển khoản ngân hàng</div>
                          <div className="text-sm text-gray-400">Chuyển khoản trực tiếp</div>
                        </div>
                      </label>
                    </div>

                    {/* Card Details */}
                    {formData.paymentMethod === 'card' && (
                      <div className="pt-6 border-t border-gray-800">
                        <h3 className="text-lg mb-4">Thông Tin Thẻ</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Số thẻ *</label>
                            <input
                              type="text"
                              value={formData.cardNumber}
                              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#007AFF]"
                              placeholder="1234 5678 9012 3456"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Tên chủ thẻ *</label>
                            <input
                              type="text"
                              value={formData.cardName}
                              onChange={(e) => handleInputChange('cardName', e.target.value)}
                              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#007AFF]"
                              placeholder="NGUYEN VAN A"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-gray-400 mb-2">Ngày hết hạn *</label>
                              <input
                                type="text"
                                value={formData.cardExpiry}
                                onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#007AFF]"
                                placeholder="MM/YY"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-400 mb-2">CVV *</label>
                              <input
                                type="text"
                                value={formData.cardCvv}
                                onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#007AFF]"
                                placeholder="123"
                                maxLength={3}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Review & Confirm */}
                {currentStep === 4 && (
                  <div>
                    <h2 className="text-2xl mb-6">Xác Nhận Đơn Hàng</h2>
                    
                    {/* Shipping Info */}
                    <div className="mb-6 pb-6 border-b border-gray-800">
                      <h3 className="text-lg mb-3">Thông tin giao hàng</h3>
                      <div className="text-gray-400 space-y-1">
                        <p>{formData.fullName}</p>
                        <p>{formData.phone}</p>
                        <p>{formData.email}</p>
                        <p>{formData.address}, {formData.ward}, {formData.district}, {formData.city}</p>
                      </div>
                    </div>

                    {/* Shipping Method */}
                    <div className="mb-6 pb-6 border-b border-gray-800">
                      <h3 className="text-lg mb-3">Phương thức vận chuyển</h3>
                      <p className="text-gray-400">
                        {formData.shippingMethod === 'standard' ? 'Giao hàng tiêu chuẩn (3-5 ngày)' : 'Giao hàng nhanh (1-2 ngày)'}
                      </p>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-6 pb-6 border-b border-gray-800">
                      <h3 className="text-lg mb-3">Phương thức thanh toán</h3>
                      <p className="text-gray-400">
                        {formData.paymentMethod === 'cod' && 'Thanh toán khi nhận hàng (COD)'}
                        {formData.paymentMethod === 'card' && 'Thẻ tín dụng/ghi nợ'}
                        {formData.paymentMethod === 'momo' && 'Ví MoMo'}
                        {formData.paymentMethod === 'transfer' && 'Chuyển khoản ngân hàng'}
                      </p>
                    </div>

                    {/* Terms & Conditions */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                        className="w-5 h-5 mt-0.5 rounded border-gray-600 bg-[#0a0a0a] text-[#007AFF] focus:ring-[#007AFF] focus:ring-offset-0"
                      />
                      <span className="text-sm text-gray-400">
                        Tôi đã đọc và đồng ý với{' '}
                        <a href="#" className="text-[#007AFF] hover:underline">
                          Điều khoản và Điều kiện
                        </a>{' '}
                        cũng như{' '}
                        <a href="#" className="text-[#007AFF] hover:underline">
                          Chính sách bảo mật
                        </a>{' '}
                        của TechStore
                      </span>
                    </label>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8 pt-8 border-t border-gray-800">
                  {currentStep > 1 && (
                    <button
                      onClick={handlePrevStep}
                      className="px-8 py-3 border border-gray-800 hover:border-[#007AFF] rounded-lg transition-colors"
                    >
                      Quay lại
                    </button>
                  )}
                  {currentStep < 4 ? (
                    <button
                      onClick={handleNextStep}
                      className="flex-1 px-8 py-3 bg-[#007AFF] hover:bg-[#0051D5] rounded-lg transition-colors"
                    >
                      Tiếp tục
                    </button>
                  ) : (
                    <button
                      onClick={handlePlaceOrder}
                      disabled={!formData.agreeTerms}
                      className="flex-1 px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Đặt hàng
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl mb-6">Đơn Hàng</h2>
                
                {/* Items */}
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-800">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-[#0a0a0a] rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm mb-1 line-clamp-2">{item.name}</h4>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">x{item.quantity}</span>
                          <span className="text-[#007AFF]">{formatPrice(item.price)}</span>
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
                    <span>Vận chuyển</span>
                    <span>{formatPrice(shippingCost)}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-800 flex justify-between text-xl">
                    <span>Tổng cộng</span>
                    <span className="text-[#007AFF]">{formatPrice(total)}</span>
                  </div>
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