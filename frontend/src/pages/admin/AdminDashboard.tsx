import React, { type JSX, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  Tag,
  FileText,
  DollarSign,
  ShoppingCart,
  Eye,
} from 'lucide-react';

// Import 3 component CRUD
import { ProductCRUD } from './ProductCRUD';
import { OrderCRUD } from './OrderCRUD';
import { UserCRUD } from './UserCRUD';

export function AdminDashboard(): JSX.Element {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'coupons' | 'content'>('dashboard');

  // Sample stats cho Dashboard
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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

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
            onClick={() => navigate('/')} 
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
            {[
              { key: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
              { key: 'products', icon: <Package className="w-5 h-5" />, label: 'Sản phẩm' },
              { key: 'orders', icon: <ShoppingCart className="w-5 h-5" />, label: 'Đơn hàng' },
              { key: 'customers', icon: <Users className="w-5 h-5" />, label: 'Khách hàng' },
              
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.key 
                    ? 'bg-[#007AFF] text-white' 
                    : 'text-gray-400 hover:bg-[#0a0a0a] hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl mb-6">Dashboard</h2>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-[#007AFF]/20 rounded-lg text-[#007AFF]">{stat.icon}</div>
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

          {/* Products Tab - Sử dụng ProductCRUD */}
          {activeTab === 'products' && <ProductCRUD />}

          {/* Orders Tab - Sử dụng OrderCRUD */}
          {activeTab === 'orders' && <OrderCRUD />}

          {/* Customers Tab - Sử dụng UserCRUD */}
          {activeTab === 'customers' && <UserCRUD />}

          {/* Coupons Tab - Coming soon */}
          

          
        </main>
      </div>
    </div>
  );
}