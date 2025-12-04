import { useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { 
  User, 
  Package, 
  MapPin, 
  CreditCard, 
  Heart, 
  Shield, 
  Settings,
  Download,
  Eye,
  Truck
} from 'lucide-react';

interface UserAccountPageProps {
  onNavigate: (page: string) => void;
  cartCount: number;
}

export function UserAccountPage({ onNavigate, cartCount }: UserAccountPageProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'payment' | 'wishlist' | 'warranty' | 'settings'>('profile');

  const tabs = [
    { id: 'profile' as const, name: 'Thông tin cá nhân', icon: <User className="w-5 h-5" /> },
    { id: 'orders' as const, name: 'Đơn hàng', icon: <Package className="w-5 h-5" /> },
    { id: 'addresses' as const, name: 'Địa chỉ', icon: <MapPin className="w-5 h-5" /> },
    { id: 'payment' as const, name: 'Thanh toán', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'wishlist' as const, name: 'Yêu thích', icon: <Heart className="w-5 h-5" /> },
    { id: 'warranty' as const, name: 'Bảo hành', icon: <Shield className="w-5 h-5" /> },
    { id: 'settings' as const, name: 'Cài đặt', icon: <Settings className="w-5 h-5" /> },
  ];

  const orders = [
    {
      id: 'ORD-ABC123',
      date: '15/11/2024',
      status: 'Đang giao',
      total: 46570000,
      items: 2,
      trackingNumber: 'VN123456789',
    },
    {
      id: 'ORD-XYZ789',
      date: '01/11/2024',
      status: 'Đã giao',
      total: 32990000,
      items: 1,
      trackingNumber: 'VN987654321',
    },
  ];

  const addresses = [
    {
      id: 1,
      name: 'Nhà riêng',
      fullName: 'Nguyễn Văn A',
      phone: '0901234567',
      address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      isDefault: true,
    },
    {
      id: 2,
      name: 'Văn phòng',
      fullName: 'Nguyễn Văn A',
      phone: '0907654321',
      address: '456 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
      isDefault: false,
    },
  ];

  const wishlistItems = [
    {
      id: 1,
      name: 'Laptop Dell XPS 15',
      price: 48990000,
      image: 'https://images.unsplash.com/photo-1658262548679-776e437f95e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjB0ZWNofGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      inStock: true,
    },
    {
      id: 2,
      name: 'Màn Hình Samsung Odyssey',
      price: 18990000,
      image: 'https://images.unsplash.com/photo-1551459601-c42a28ef7506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bHRyYXdpZGUlMjBtb25pdG9yfGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      inStock: true,
    },
  ];

  const warranties = [
    {
      id: 1,
      product: 'Laptop ASUS ROG Strix G16',
      purchaseDate: '15/11/2024',
      expiryDate: '15/11/2026',
      status: 'Còn hạn',
      serial: 'SN123456789',
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đang giao':
        return 'bg-blue-500/20 text-blue-500';
      case 'Đã giao':
        return 'bg-green-500/20 text-green-500';
      case 'Đã hủy':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
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
          <h1 className="text-3xl mb-8">Tài Khoản Của Tôi</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 sticky top-24">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-800">
                  <div className="w-16 h-16 bg-[#007AFF] rounded-full flex items-center justify-center text-2xl">
                    N
                  </div>
                  <div>
                    <h3 className="font-medium">Nguyễn Văn A</h3>
                    <p className="text-sm text-gray-400">nguyen.van.a@email.com</p>
                  </div>
                </div>

                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-[#007AFF] text-white'
                          : 'text-gray-400 hover:bg-[#0a0a0a] hover:text-white'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8">
                  <h2 className="text-2xl mb-6">Thông Tin Cá Nhân</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Họ và tên</label>
                      <input
                        type="text"
                        defaultValue="Nguyễn Văn A"
                        className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#007AFF]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="nguyen.van.a@email.com"
                        className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#007AFF]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Số điện thoại</label>
                      <input
                        type="tel"
                        defaultValue="0901234567"
                        className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#007AFF]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Ngày sinh</label>
                      <input
                        type="date"
                        className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#007AFF]"
                      />
                    </div>
                  </div>
                  <button className="mt-6 px-8 py-3 bg-[#007AFF] hover:bg-[#0051D5] rounded-lg transition-colors">
                    Lưu thay đổi
                  </button>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg mb-1">Đơn hàng {order.id}</h3>
                          <p className="text-sm text-gray-400">{order.date}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-800">
                        <div>
                          <p className="text-sm text-gray-400">Số lượng</p>
                          <p>{order.items} sản phẩm</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Tổng tiền</p>
                          <p className="text-[#007AFF]">{formatPrice(order.total)}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-400">Mã vận đơn</p>
                          <p className="font-mono">{order.trackingNumber}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-800 hover:border-[#007AFF] rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                          Chi tiết
                        </button>
                        {order.status === 'Đang giao' && (
                          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#007AFF] hover:bg-[#0051D5] rounded-lg transition-colors">
                            <Truck className="w-4 h-4" />
                            Theo dõi
                          </button>
                        )}
                        {order.status === 'Đã giao' && (
                          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#007AFF] hover:bg-[#0051D5] rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                            Tải hóa đơn
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg">{addr.name}</h3>
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 bg-[#007AFF]/20 text-[#007AFF] text-xs rounded">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 mb-1">{addr.fullName}</p>
                          <p className="text-gray-400 mb-1">{addr.phone}</p>
                          <p className="text-gray-400">{addr.address}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 border border-gray-800 hover:border-[#007AFF] rounded-lg transition-colors">
                          Chỉnh sửa
                        </button>
                        {!addr.isDefault && (
                          <button className="px-4 py-2 border border-gray-800 hover:border-[#007AFF] rounded-lg transition-colors">
                            Đặt làm mặc định
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-4 border-2 border-dashed border-gray-800 hover:border-[#007AFF] rounded-2xl transition-colors">
                    + Thêm địa chỉ mới
                  </button>
                </div>
              )}

              {/* Payment Tab */}
              {activeTab === 'payment' && (
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8">
                  <h2 className="text-2xl mb-6">Phương Thức Thanh Toán</h2>
                  <p className="text-gray-400 mb-6">Chưa có phương thức thanh toán nào được lưu</p>
                  <button className="px-8 py-3 bg-[#007AFF] hover:bg-[#0051D5] rounded-lg transition-colors">
                    + Thêm thẻ mới
                  </button>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden">
                      <div className="aspect-square bg-[#0a0a0a]">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-5">
                        <h3 className="mb-3 line-clamp-2">{item.name}</h3>
                        <div className="text-2xl text-[#007AFF] mb-4">{formatPrice(item.price)}</div>
                        <div className="flex gap-2">
                          <button className="flex-1 px-4 py-2 bg-[#007AFF] hover:bg-[#0051D5] rounded-lg transition-colors">
                            Thêm vào giỏ
                          </button>
                          <button className="px-4 py-2 border border-gray-800 hover:border-red-500 text-red-500 rounded-lg transition-colors">
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Warranty Tab */}
              {activeTab === 'warranty' && (
                <div className="space-y-4">
                  {warranties.map((warranty) => (
                    <div key={warranty.id} className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
                      <h3 className="text-lg mb-4">{warranty.product}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-400">Ngày mua</p>
                          <p>{warranty.purchaseDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Hết hạn</p>
                          <p>{warranty.expiryDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Trạng thái</p>
                          <p className="text-green-500">{warranty.status}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Serial</p>
                          <p className="font-mono text-sm">{warranty.serial}</p>
                        </div>
                      </div>
                      <button className="px-6 py-2 bg-[#007AFF] hover:bg-[#0051D5] rounded-lg transition-colors">
                        Yêu cầu bảo hành
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8">
                  <h2 className="text-2xl mb-6">Cài Đặt Tài Khoản</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg mb-3">Đổi mật khẩu</h3>
                      <div className="space-y-4">
                        <input
                          type="password"
                          placeholder="Mật khẩu hiện tại"
                          className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#007AFF]"
                        />
                        <input
                          type="password"
                          placeholder="Mật khẩu mới"
                          className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#007AFF]"
                        />
                        <input
                          type="password"
                          placeholder="Xác nhận mật khẩu mới"
                          className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#007AFF]"
                        />
                        <button className="px-8 py-3 bg-[#007AFF] hover:bg-[#0051D5] rounded-lg transition-colors">
                          Cập nhật mật khẩu
                        </button>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-gray-800">
                      <h3 className="text-lg mb-3 text-red-500">Xóa tài khoản</h3>
                      <p className="text-gray-400 mb-4">
                        Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
                      </p>
                      <button className="px-8 py-3 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-lg transition-colors">
                        Xóa tài khoản
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}