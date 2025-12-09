import React, { type JSX, useEffect, useState } from 'react';
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
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { AxiosError } from 'axios';
import { useApi } from '@/hooks/useApi';

// ---------------------- Categories ----------------------
const CATEGORIES = [
  { id: 1, name: 'Laptop' },
  { id: 2, name: 'PC' },
  { id: 3, name: 'Màn hình' },
  { id: 4, name: 'Phụ kiện' },
  { id: 5, name: 'Laptop Văn phòng' },
  { id: 6, name: 'Laptop Gaming' },
  { id: 7, name: 'Laptop Mỏng nhẹ' },
  { id: 8, name: 'Laptop Học sinh - sinh viên' },
  { id: 9, name: 'Laptop Đồ họa' },
  { id: 10, name: 'PC Văn phòng' },
  { id: 11, name: 'PC Gaming' },
  { id: 12, name: 'PC Đồ họa' },
  { id: 13, name: 'Màn hình Gaming' },
  { id: 14, name: 'Màn hình Đồ họa' },
  { id: 15, name: 'Màn hình Văn phòng' },
  { id: 16, name: 'Màn hình Lập trình' },
  { id: 17, name: 'Màn hình Di động' },
  { id: 18, name: 'Chuột' },
  { id: 19, name: 'Bàn phím' },
  { id: 20, name: 'Tai nghe' },
  { id: 21, name: 'Card đồ họa' },
  { id: 22, name: 'RAM' },
];

// ---------------------- Brands (example) ----------------------
const BRANDS = [
  { id: 1, name: 'Asus' },
  { id: 2, name: 'Acer' },
  { id: 3, name: 'Dell' },
  { id: 4, name: 'HP' },
  { id: 5, name: 'MSI' },
];

// ---------------------- Types ----------------------
interface UIProduct {
  id: number;
  name: string;
  category: string;
  category_id?: number;
  price: number;
  stock: number;
  status: string;
  code?: string;
  brand_id?: number;
  product_id?: number;
  short_description?: string;
  image?: string;
}

// ---------------------- Component ----------------------
export function AdminDashboard(): JSX.Element {
  const navigate = useNavigate();
  const api = useApi();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'coupons' | 'content'>('dashboard');

  // Sample stats
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

  // ---------------------- Products state ----------------------
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  const [newProduct, setNewProduct] = useState<Partial<UIProduct & {
    code: string;
    brand_id: number;
    category_id: number;
    quantity: number;
    short_description: string;
    image: string;
  }>>({
    name: '',
    category: '',
    category_id: CATEGORIES[0].id,
    price: 0,
    stock: 0,
    quantity: 0,
    code: '',
    brand_id: BRANDS[0].id,
    status: 'Còn hàng',
    short_description: '',
    image: '',
  });

  const [editProduct, setEditProduct] = useState<Partial<UIProduct & {
    code?: string;
    brand_id?: number;
    category_id?: number;
    quantity?: number;
    short_description?: string;
    image?: string;
  }> | null>(null);

  // ---------------------- Helpers ----------------------
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

  // ---------------------- API: Load products ----------------------
  const fetchProducts = async () => {
    setLoadingProducts(true);
    setMessage('');

    try {
      const res = await api.get('/products');
      const data = (res.data?.data ?? res.data) as any[];

      const normalized: UIProduct[] = (data || []).map((p: any) => {
        const categoryId = p.category_id ?? null;
        const categoryName = p.category_name ?? p.category ?? (categoryId ? (CATEGORIES.find(c => c.id === Number(categoryId))?.name ?? String(categoryId)) : '');
        return {
          id: Number(p.product_id ?? p.id ?? p.productId ?? 0),
          name: p.name ?? '',
          category: categoryName,
          category_id: categoryId ?? undefined,
          price: Number(p.price ?? 0),
          stock: Number(p.quantity ?? p.stock ?? 0),
          status: p.is_active ? 'Còn hàng' : (p.status ?? 'Còn hàng'),
          code: p.code ?? p.product_code ?? '',
          brand_id: p.brand_id ?? undefined,
          product_id: p.product_id ?? undefined,
          short_description: p.short_description ?? '',
          image: p.image ?? '',
        };
      });

      setProducts(normalized);
    } catch (err) {
      const e = err as AxiosError;
      console.error('Fetch products error', e);
      setMessage(`Lỗi tải sản phẩm: ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ---------------------- API: Add product ----------------------
  const addProduct = async () => {
    setMessage('');

    // Validate required fields
    if (!newProduct.name || !newProduct.price || !newProduct.code) {
      setMessage('❌ Vui lòng nhập đầy đủ Tên, Giá và Mã sản phẩm.');
      return;
    }

    try {
      const payload = {
        name: String(newProduct.name),
        price: Number(newProduct.price),
        code: String(newProduct.code),
        brand_id: Number(newProduct.brand_id ?? BRANDS[0].id),
        category_id: Number(newProduct.category_id ?? CATEGORIES[0].id),
        quantity: Number(newProduct.quantity ?? newProduct.stock ?? 0),
        short_description: String(newProduct.short_description ?? ''),
        image: String(newProduct.image ?? ''),
      };

      const res = await api.post('/products', payload);

      setMessage(res.data?.message ?? 'Tạo sản phẩm thành công');
      setIsAddOpen(false);
      setNewProduct({
        name: '',
        category: '',
        category_id: CATEGORIES[0].id,
        price: 0,
        stock: 0,
        quantity: 0,
        code: '',
        brand_id: BRANDS[0].id,
        status: 'Còn hàng',
        short_description: '',
        image: '',
      });
      await fetchProducts();
    } catch (err) {
      const e = err as AxiosError;
      console.error('Add product error', e);
      setMessage(`❌ Lỗi tạo: ${e.response?.data?.message ?? e.message}`);
    }
  };


  // ---------------------- API: Update product ----------------------
  const updateProduct = async () => {
    setMessage('');
    if (!editProduct) return;

    if (!editProduct.name || !editProduct.price) {
      setMessage('❌ Vui lòng nhập đầy đủ Tên và Giá sản phẩm.');
      return;
    }

    try {
      const id = Number(editProduct.product_id ?? editProduct.id ?? 0);
      if (!id) {
        setMessage('❌ ID sản phẩm không hợp lệ');
        return;
      }

      const payload = {
        name: String(editProduct.name),
        price: Number(editProduct.price),
        quantity: Number(editProduct.quantity ?? editProduct.stock ?? 0),
        category_id: Number(editProduct.category_id ?? (CATEGORIES.find(c => c.name === editProduct.category)?.id ?? CATEGORIES[0].id)),
        brand_id: Number(editProduct.brand_id ?? BRANDS[0].id),
        short_description: String(editProduct.short_description ?? ''),
        image: String(editProduct.image ?? ''),
      };

      const res = await api.put(`/products/${id}`, payload);
      setMessage(res.data?.message ?? 'Cập nhật thành công');
      setIsEditOpen(false);
      setEditProduct(null);
      await fetchProducts();
    } catch (err) {
      const e = err as AxiosError;
      console.error('Update product error', e);
      setMessage(`❌ Lỗi cập nhật: ${e.response?.data?.message ?? e.message}`);
    }
  };

  // ---------------------- API: Delete product ----------------------
  const deleteProduct = async (id: number) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm ID ${id}?`)) return;
    setMessage('');
    try {
      const res = await api.delete(`/products/${id}`);
      setMessage(res.data?.message ?? 'Xóa thành công');
      await fetchProducts();
    } catch (err) {
      const e = err as AxiosError;
      console.error('Delete product error', e);
      setMessage(`❌ Lỗi xóa: ${e.response?.data?.message ?? e.message}`);
    }
  };

  // ---------------------- UI ----------------------
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

            <button onClick={() => navigate('/')} className="px-4 py-2 border border-gray-800 hover:border-[#007AFF] rounded-lg transition-colors">
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
                { key: 'coupons', icon: <Tag className="w-5 h-5" />, label: 'Mã giảm giá' },
                { key: 'content', icon: <FileText className="w-5 h-5" />, label: 'Nội dung' },
              ].map(tab => (
                  <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.key ? 'bg-[#007AFF] text-white' : 'text-gray-400 hover:bg-[#0a0a0a] hover:text-white'}`}
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
                                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>{order.status}</span>
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
                    <button
                        onClick={() => { setNewProduct({ name: '', category: '', category_id: CATEGORIES[0].id, price: 0, stock: 0, quantity: 0, code: '', brand_id: BRANDS[0].id, status: 'Còn hàng', short_description: '', image: '' }); setIsAddOpen(true); }}
                        className="px-6 py-3 bg-[#007AFF] hover:bg-[#0051D5] rounded-lg flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Thêm sản phẩm
                    </button>
                  </div>

                  {message && <p className="mb-4 text-yellow-400">{message}</p>}

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">#</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Ảnh</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Tên</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Mô tả</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Danh mục</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Giá</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Số lượng</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Trạng thái</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-normal">Hành động</th>
                      </tr>
                      </thead>
                      <tbody>
                      {loadingProducts ? (
                          <tr>
                            <td colSpan={9} className="text-center py-6 text-gray-400">Đang tải...</td>
                          </tr>
                      ) : products.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="text-center py-6 text-gray-400">Chưa có sản phẩm</td>
                          </tr>
                      ) : (
                          products.map((p, idx) => (
                              <tr key={p.id} className="border-b border-gray-800 last:border-0">
                                <td className="py-3 px-4">{idx + 1}</td>
                                <td className="py-3 px-4">{p.image ? <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded" /> : 'Chưa có'}</td>
                                <td className="py-3 px-4">{p.name}</td>
                                <td className="py-3 px-4">{p.short_description}</td>
                                <td className="py-3 px-4">{p.category}</td>
                                <td className="py-3 px-4">{formatPrice(p.price)}</td>
                                <td className="py-3 px-4">{p.stock}</td>
                                <td className="py-3 px-4"><span className={`px-2 py-1 rounded text-xs ${getStatusColor(p.status)}`}>{p.status}</span></td>
                                <td className="py-3 px-4 flex items-center gap-2">
                                  <button
                                      onClick={() => { setEditProduct(p); setIsEditOpen(true); }}
                                      className="p-2 hover:bg-[#0a0a0a] rounded transition-colors"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => deleteProduct(p.id)} className="p-2 hover:bg-[#0a0a0a] rounded transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                          ))
                      )}
                      </tbody>
                    </table>
                  </div>
                </div>
            )}

            {/* Add Product Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                  <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-lg">
                    <h3 className="text-xl mb-4">Thêm sản phẩm</h3>
                    <div className="space-y-3">
                      <input
                          className="w-full p-2 bg-black border border-gray-700 rounded"
                          placeholder="Tên sản phẩm *"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      />
                      <input
                          className="w-full p-2 bg-black border border-gray-700 rounded"
                          placeholder="Mã sản phẩm *"
                          value={newProduct.code}
                          onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
                      />
                      <input
                          className="w-full p-2 bg-black border border-gray-700 rounded"
                          placeholder="Mô tả ngắn"
                          value={newProduct.short_description}
                          onChange={(e) => setNewProduct({ ...newProduct, short_description: e.target.value })}
                      />
                      <input
                          className="w-full p-2 bg-black border border-gray-700 rounded"
                          placeholder="URL ảnh"
                          value={newProduct.image}
                          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      />
                      <input
                          type="number"
                          className="w-full p-2 bg-black border border-gray-700 rounded"
                          placeholder="Giá *"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      />
                      <input
                          type="number"
                          className="w-full p-2 bg-black border border-gray-700 rounded"
                          placeholder="Số lượng"
                          value={newProduct.quantity}
                          onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
                      />
                      <select
                          className="w-full p-2 bg-black border border-gray-700 rounded"
                          value={newProduct.category_id}
                          onChange={(e) => setNewProduct({ ...newProduct, category_id: Number(e.target.value) })}
                      >
                        {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <select
                          className="w-full p-2 bg-black border border-gray-700 rounded"
                          value={newProduct.brand_id}
                          onChange={(e) => setNewProduct({ ...newProduct, brand_id: Number(e.target.value) })}
                      >
                        {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>
                    <div className="mt-4 flex justify-end gap-3">
                      <button onClick={() => setIsAddOpen(false)} className="px-4 py-2 border border-gray-700 rounded">Hủy</button>
                      <button onClick={addProduct} className="px-4 py-2 bg-[#007AFF] rounded">Thêm</button>
                    </div>
                  </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {isEditOpen && editProduct && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                  <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-lg">
                    <h3 className="text-xl mb-4">Chỉnh sửa sản phẩm</h3>
                    <div className="space-y-3">
                      {/* Tên sản phẩm */}
                      <input
                          className="w-full p-2 bg-black border border-gray-700 rounded"
                          placeholder="Tên sản phẩm *"
                          value={editProduct.name ?? ''}
                          onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                      />

                      {/* Mô tả ngắn */}
                      <input
                          className="w-full p-2 bg-black border border-gray-700 rounded"
                          placeholder="Mô tả ngắn"
                          value={editProduct.short_description ?? ''}
                          onChange={(e) => setEditProduct({ ...editProduct, short_description: e.target.value })}
                      />

                      {/* URL ảnh */}
                      <input
                          className="w-full p-2 bg-black border border-gray-700 rounded"
                          placeholder="URL ảnh"
                          value={editProduct.image ?? ''}
                          onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
                      />

                      {/* Giá */}
                      <input
                          type="number"
                          className="w-full p-2 bg-black border border-gray-700 rounded"
                          placeholder="Giá *"
                          value={editProduct.price ?? 0}
                          onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
                      />

                      {/* Số lượng */}
                      <input
                          type="number"
                          className="w-full p-2 bg-black border border-gray-700 rounded"
                          placeholder="Số lượng"
                          value={editProduct.quantity ?? 0}
                          onChange={(e) => setEditProduct({ ...editProduct, quantity: Number(e.target.value) })}
                      />

                      {/* Danh mục */}
                      <select
                          className="w-full p-2 bg-black border border-gray-700 rounded"
                          value={editProduct.category_id ?? CATEGORIES[0].id}
                          onChange={(e) => setEditProduct({ ...editProduct, category_id: Number(e.target.value) })}
                      >
                        {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>

                      {/* Thương hiệu */}
                      <select
                          className="w-full p-2 bg-black border border-gray-700 rounded"
                          value={editProduct.brand_id ?? BRANDS[0].id}
                          onChange={(e) => setEditProduct({ ...editProduct, brand_id: Number(e.target.value) })}
                      >
                        {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>

                    {/* Buttons */}
                    <div className="mt-4 flex justify-end gap-3">
                      <button
                          onClick={() => { setIsEditOpen(false); setEditProduct(null); }}
                          className="px-4 py-2 border border-gray-700 rounded"
                      >
                        Hủy
                      </button>
                      <button
                          onClick={updateProduct}
                          className="px-4 py-2 bg-[#007AFF] rounded"
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                </div>
            )}

          </main>
        </div>
      </div>
  );
}
