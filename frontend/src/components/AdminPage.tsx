import { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Tag, 
  FileText,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

export function AdminPage({ onNavigate }: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'coupons' | 'content'>('dashboard');

  const stats = [
    { label: 'Doanh thu tháng', value: '₫324,500,000', change: '+12%', icon: <DollarSign className="w-6 h-6" /> },
    { label: 'Đơn hàng', value: '1,234', change: '+8%', icon: <ShoppingCart className="w-6 h-6" /> },
    { label: 'Khách hàng', value: '856', change: '+24%', icon: <Users className="w-6 h-6" /> },
    { label: 'Sản phẩm', value: '432', change: '+3%', icon: <Package className="w-6 h-6" /> },
  ];

  const recentOrders = [
    { id: 'ORD-ABC123', customer: 'Nguyễn Văn A', total: 46570000, status: 'Đang giao', date: '15/11/2024' },
    { id: 'ORD-XYZ789', customer: 'Trần Thị B', total: 32990000, status: 'Đã giao', date: '14/11/2024' },
    { id: 'ORD-DEF456', customer: 'Lê Văn C', total: 18990000, status: 'Đang xử lý', date: '14/11/2024' },
  ];

  const products = [
    { id: 1, name: 'Laptop ASUS ROG Strix G16', category: 'Laptop', price: 42990000, stock: 45, status: 'Còn hàng' },
    { id: 2, name: 'Màn Hình LG UltraWide 34"', category: 'Màn Hình', price: 15990000, stock: 23, status: 'Còn hàng' },
    { id: 3, name: 'PC Gaming Custom RGB', category: 'PC', price: 55990000, stock: 8, status: 'Sắp hết' },
    { id: 4, name: 'Bàn Phím Keychron K8 Pro', category: 'Phụ Kiện', price: 3290000, stock: 0, status: 'Hết hàng' },
  ];

  const customers = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyen.a@email.com', orders: 12, spent: 156000000, joined: '15/01/2024' },
    { id: 2, name: 'Trần Thị B', email: 'tran.b@email.com', orders: 8, spent: 89000000, joined: '20/02/2024' },
    { id: 3, name: 'Lê Văn C', email: 'le.c@email.com', orders: 5, spent: 45000000, joined: '10/03/2024' },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Còn hàng':
      case 'Đã giao':
        return 'bg-green-500/20 text-green-500';
      case 'Sắp hết':
      case 'Đang giao':
      case 'Đang xử lý':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'Hết hàng':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-gray-800 sticky top-0 z-50">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#007AFF] to-[#0051D5] rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl">TechStore Admin</h1>
              <p className="text-sm text-gray-400">Quản trị hệ thống</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="px-4 py-2 border border-gray-800 hover:border-[#007AFF] rounded-lg transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1a1a1a] border-r border-gray-800 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'dashboard' ? 'bg-[#007AFF] text-white' : 'text-gray-400 hover:bg-[#0a0a0a] hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'products' ? 'bg-[#007AFF] text-white' : 'text-gray-400 hover:bg-[#0a0a0a] hover:text-white'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Sản phẩm</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'orders' ? 'bg-[#007AFF] text-white' : 'text-gray-400 hover:bg-[#0a0a0a] hover:text-white'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Đơn hàng</span>
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'customers' ? 'bg-[#007AFF] text-white' : 'text-gray-400 hover:bg-[#0a0a0a] hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Khách hàng</span>
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'coupons' ? 'bg-[#007AFF] text-white' : 'text-gray-400 hover:bg-[#0a0a0a] hover:text-white'
              }`}
            >
              <Tag className="w-5 h-5" />
              <span>Mã giảm giá</span>
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'content' ? 'bg-[#007AFF] text-white' : 'text-gray-400 hover:bg-[#0a0a0a] hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Nội dung</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl mb-6">Dashboard</h2>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-[#007AFF]/20 rounded-lg text-[#007AFF]">
                        {stat.icon}
                      </div>
                      <span className="text-green-500 text-sm">{stat.change}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-2xl">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-xl mb-4">Đơn hàng gần đây</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Mã đơn</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Khách hàng</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Tổng tiền</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Trạng thái</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Ngày</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-800 last:border-0">
                          <td className="py-3 px-4 font-mono text-sm">{order.id}</td>
                          <td className="py-3 px-4">{order.customer}</td>
                          <td className="py-3 px-4 text-[#007AFF]">{formatPrice(order.total)}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-400">{order.date}</td>
                          <td className="py-3 px-4">
                            <button className="p-2 hover:bg-[#0a0a0a] rounded transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Quản lý sản phẩm</h2>
                <button className="px-6 py-3 bg-[#007AFF] hover:bg-[#0051D5] rounded-lg transition-colors">
                  + Thêm sản phẩm
                </button>
              </div>

              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Sản phẩm</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Danh mục</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Giá</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Tồn kho</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Trạng thái</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-gray-800 last:border-0">
                          <td className="py-3 px-4">{product.name}</td>
                          <td className="py-3 px-4 text-gray-400">{product.category}</td>
                          <td className="py-3 px-4 text-[#007AFF]">{formatPrice(product.price)}</td>
                          <td className="py-3 px-4">{product.stock}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(product.status)}`}>
                              {product.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button className="p-2 hover:bg-[#0a0a0a] rounded transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 hover:bg-red-500/10 text-red-500 rounded transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Quản lý đơn hàng</h2>
                <select className="bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2">
                  <option>Tất cả</option>
                  <option>Đang xử lý</option>
                  <option>Đang giao</option>
                  <option>Đã giao</option>
                  <option>Đã hủy</option>
                </select>
              </div>

              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Mã đơn</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Khách hàng</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Tổng tiền</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Trạng thái</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Ngày</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-800 last:border-0">
                          <td className="py-3 px-4 font-mono text-sm">{order.id}</td>
                          <td className="py-3 px-4">{order.customer}</td>
                          <td className="py-3 px-4 text-[#007AFF]">{formatPrice(order.total)}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-400">{order.date}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button className="p-2 hover:bg-[#0a0a0a] rounded transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 hover:bg-[#0a0a0a] rounded transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Quản lý khách hàng</h2>
                <input
                  type="text"
                  placeholder="Tìm kiếm khách hàng..."
                  className="bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 w-64 focus:outline-none focus:border-[#007AFF]"
                />
              </div>

              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Tên</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Email</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Đơn hàng</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Tổng chi tiêu</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Tham gia</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr key={customer.id} className="border-b border-gray-800 last:border-0">
                          <td className="py-3 px-4">{customer.name}</td>
                          <td className="py-3 px-4 text-gray-400">{customer.email}</td>
                          <td className="py-3 px-4">{customer.orders}</td>
                          <td className="py-3 px-4 text-[#007AFF]">{formatPrice(customer.spent)}</td>
                          <td className="py-3 px-4 text-gray-400">{customer.joined}</td>
                          <td className="py-3 px-4">
                            <button className="p-2 hover:bg-[#0a0a0a] rounded transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Coupons Tab */}
          {activeTab === 'coupons' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Mã giảm giá</h2>
                <button className="px-6 py-3 bg-[#007AFF] hover:bg-[#0051D5] rounded-lg transition-colors">
                  + Tạo mã mới
                </button>
              </div>

              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 text-center">
                <Tag className="w-16 h-16 mx-auto text-gray-700 mb-4" />
                <p className="text-gray-400">Chưa có mã giảm giá nào</p>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Quản lý nội dung</h2>
                <button className="px-6 py-3 bg-[#007AFF] hover:bg-[#0051D5] rounded-lg transition-colors">
                  + Thêm bài viết
                </button>
              </div>

              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 text-center">
                <FileText className="w-16 h-16 mx-auto text-gray-700 mb-4" />
                <p className="text-gray-400">Chưa có bài viết nào</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
