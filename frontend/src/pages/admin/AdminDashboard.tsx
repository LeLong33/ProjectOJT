import React, {type JSX, useEffect, useState } from 'react';
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

// ---------------------- Types used in UI ----------------------
/**
 * This type represents the shape used by the UI. We will normalize backend product objects
 * into this shape when loading, and when adding/updating we'll send the payload backend expects.
 */
interface UIProduct {
  id: number;          // maps from product_id
  name: string;
  category: string;    // category name for display
  category_id?: number; // underlying id (used for sending)
  price: number;
  stock: number;       // maps from quantity
  status: string;
  code?: string;
  brand_id?: number;
  product_id?: number; // optional original id if present
}

// ---------------------- Component ----------------------
export function AdminDashboard(): JSX.Element {
  const navigate = useNavigate();
  const api = useApi();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'coupons' | 'content'>('dashboard');

  // Stats sample
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

  // newProduct state must include backend-required fields (we also keep category name for display)
  const [newProduct, setNewProduct] = useState<Partial<UIProduct & {
    // these are required for backend
    code: string;
    brand_id: number;
    category_id: number;
    quantity: number;
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
  });

  const [editProduct, setEditProduct] = useState<Partial<UIProduct & {
    code?: string;
    brand_id?: number;
    category_id?: number;
    quantity?: number;
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
      // backend may return { success: true, data: [...] } or array directly
      const data = (res.data?.data ?? res.data) as any[];

      // Normalize to UIProduct: id, category (name), stock (quantity)
      const normalized: UIProduct[] = (data || []).map((p: any) => {
        const categoryId = p.category_id ?? null;
        const categoryName = (() => {
          if (p.category_name) return p.category_name;
          if (p.category) return p.category;
          if (categoryId) {
            const found = CATEGORIES.find(c => c.id === Number(categoryId));
            return found ? found.name : String(categoryId);
          }
          return '';
        })();

        return {
          id: Number(p.product_id ?? p.id ?? p.productId ?? 0),
          name: p.name ?? '',
          category: categoryName,
          category_id: categoryId ?? undefined,
          price: Number(p.price ?? 0),
          stock: Number(p.quantity ?? p.stock ?? 0),
          status: p.is_active ? 'Còn hàng' : (p.status ?? 'Ngưng bán'),
          code: p.code ?? p.product_code ?? '',
          brand_id: p.brand_id ?? undefined,
          product_id: p.product_id ?? undefined,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------- API: Add product ----------------------
  const addProduct = async () => {
    setMessage('');
    try {
      // build payload matching backend expectations
      const payload = {
        name: String(newProduct.name ?? ''),
        price: Number(newProduct.price ?? 0),
        code: String(newProduct.code ?? ''),
        brand_id: Number(newProduct.brand_id ?? BRANDS[0].id),
        category_id: Number(newProduct.category_id ?? CATEGORIES[0].id),
        quantity: Number(newProduct.quantity ?? newProduct.stock ?? 0),
        // optional: description, short_description, rating...
      };

      const res = await api.post('/products', payload); // matches ProductRoutes (POST /api/products)

      setMessage(res.data?.message ?? 'Tạo sản phẩm thành công');
      setIsAddOpen(false);
      // reset form
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

    try {
      const id = Number(editProduct.product_id ?? editProduct.id ?? 0);
      if (!id) {
        setMessage('❌ ID sản phẩm không hợp lệ');
        return;
      }

      const payload: any = {
        name: String(editProduct.name ?? ''),
        price: Number(editProduct.price ?? 0),
        quantity: Number(editProduct.quantity ?? editProduct.stock ?? 0),
        category_id: Number(editProduct.category_id ?? (CATEGORIES.find(c => c.name === editProduct.category)?.id ?? CATEGORIES[0].id)),
        brand_id: Number(editProduct.brand_id ?? BRANDS[0].id),
        // do not include code/product_id if backend forbids changing code via PUT; adjust if needed
      };

      const res = await api.put(`/products/${id}`, payload); // matches ProductRoutes (PUT /api/products/:id)

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
      const res = await api.delete(`/products/${id}`); // DELETE /api/products/:id
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
              <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-[#007AFF] text-white' : 'text-gray-400 hover:bg-[#0a0a0a] hover:text-white'}`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </button>

              <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-[#007AFF] text-white' : 'text-gray-400 hover:bg-[#0a0a0a] hover:text-white'}`}
              >
                <Package className="w-5 h-5" />
                <span>Sản phẩm</span>
              </button>

              <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-[#007AFF] text-white' : 'text-gray-400 hover:bg-[#0a0a0a] hover:text-white'}`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Đơn hàng</span>
              </button>

              <button
                  onClick={() => setActiveTab('customers')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'customers' ? 'bg-[#007AFF] text-white' : 'text-gray-400 hover:bg-[#0a0a0a] hover:text-white'}`}
              >
                <Users className="w-5 h-5" />
                <span>Khách hàng</span>
              </button>

              <button
                  onClick={() => setActiveTab('coupons')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'coupons' ? 'bg-[#007AFF] text-white' : 'text-gray-400 hover:bg-[#0a0a0a] hover:text-white'}`}
              >
                <Tag className="w-5 h-5" />
                <span>Mã giảm giá</span>
              </button>

              <button
                  onClick={() => setActiveTab('content')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'content' ? 'bg-[#007AFF] text-white' : 'text-gray-400 hover:bg-[#0a0a0a] hover:text-white'}`}
              >
                <FileText className="w-5 h-5" />
                <span>Nội dung</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
                <div>
                  <h2 className="text-2xl mb-6">Dashboard</h2>

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
                        onClick={() => {
                          setNewProduct({
                            name: '',
                            category: '',
                            category_id: CATEGORIES[0].id,
                            price: 0,
                            stock: 0,
                            quantity: 0,
                            code: '',
                            brand_id: BRANDS[0].id,
                            status: 'Còn hàng'
                          });
                          setIsAddOpen(true);
                        }}
                        className="px-6 py-3 bg-[#007AFF] hover:bg-[#0051D5] rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" /> Thêm sản phẩm
                    </button>
                  </div>

                  {message && <div className={`p-3 rounded-lg ${message.startsWith('❌') ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>{message}</div>}

                  <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
                    {loadingProducts ? (
                        <div className="text-gray-400">Đang tải danh sách sản phẩm...</div>
                    ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-800">
                              <th className="py-3 px-4 text-left text-gray-400">Tên</th>
                              <th className="py-3 px-4 text-left text-gray-400">Danh mục</th>
                              <th className="py-3 px-4 text-left text-gray-400">Giá</th>
                              <th className="py-3 px-4 text-left text-gray-400">Kho</th>
                              <th className="py-3 px-4 text-left text-gray-400">Trạng thái</th>
                              <th className="py-3 px-4 text-left text-gray-400">Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.map((p) => (
                                <tr key={p.id} className="border-b border-gray-800 last:border-0">
                                  <td className="py-3 px-4">{p.name}</td>
                                  <td className="py-3 px-4 text-gray-400">{p.category}</td>
                                  <td className="py-3 px-4 text-[#007AFF]">{formatPrice(p.price)}</td>
                                  <td className="py-3 px-4">{p.stock}</td>
                                  <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded ${getStatusColor(p.status)} text-xs`}>{p.status}</span>
                                  </td>
                                  <td className="py-3 px-4 flex gap-3">
                                    <button onClick={() => { setEditProduct({
                                      ...p,
                                      // ensure editProduct has code/brand/category_id/quantity fields for edit form
                                      code: (p as any).code ?? '',
                                      brand_id: (p as any).brand_id ?? BRANDS[0].id,
                                      category_id: (p as any).category_id ?? (CATEGORIES.find(c => c.name === p.category)?.id ?? CATEGORIES[0].id),
                                      quantity: p.stock
                                    }); setIsEditOpen(true); }} className="p-2 hover:bg-[#0a0a0a] rounded">
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => deleteProduct(p.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                            ))}
                            </tbody>
                          </table>
                        </div>
                    )}
                  </div>

                  {/* Add Modal */}
                  {isAddOpen && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-[#1a1a1a] border border-gray-700 p-6 rounded-xl w-[520px]">
                          <h3 className="text-xl mb-4">Thêm sản phẩm</h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input className="w-full p-2 bg-black border border-gray-700 rounded" placeholder="Tên sản phẩm"
                                   value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />

                            <select className="w-full p-2 bg-black border border-gray-700 rounded" value={newProduct.category_id}
                                    onChange={(e) => {
                                      const cid = Number(e.target.value);
                                      const catName = CATEGORIES.find(c => c.id === cid)?.name ?? '';
                                      setNewProduct({ ...newProduct, category_id: cid, category: catName });
                                    }}>
                              <option value="">-- Chọn danh mục --</option>
                              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>

                            <input className="w-full p-2 bg-black border border-gray-700 rounded" type="number" placeholder="Giá"
                                   value={newProduct.price ?? ''} onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })} />
                            <input className="w-full p-2 bg-black border border-gray-700 rounded" type="number" placeholder="Tồn kho"
                                   value={newProduct.stock ?? ''} onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value), quantity: Number(e.target.value) })} />

                            <input className="w-full p-2 bg-black border border-gray-700 rounded" placeholder="Mã sản phẩm (code)"
                                   value={newProduct.code ?? ''} onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })} />

                            <select className="w-full p-2 bg-black border border-gray-700 rounded" value={newProduct.brand_id}
                                    onChange={(e) => setNewProduct({ ...newProduct, brand_id: Number(e.target.value) })}>
                              {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>

                            <select className="w-full p-2 bg-black border border-gray-700 rounded" value={newProduct.status}
                                    onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}>
                              <option>Còn hàng</option>
                              <option>Sắp hết</option>
                              <option>Hết hàng</option>
                            </select>
                          </div>

                          <div className="flex justify-end gap-3 mt-4">
                            <button className="px-4 py-2 bg-gray-700 rounded" onClick={() => setIsAddOpen(false)}>Hủy</button>
                            <button className="px-4 py-2 bg-blue-600 rounded" onClick={addProduct}>Thêm</button>
                          </div>
                        </div>
                      </div>
                  )}

                  {/* Edit Modal */}
                  {isEditOpen && editProduct && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-[#1a1a1a] border border-gray-700 p-6 rounded-xl w-[520px]">
                          <h3 className="text-xl mb-4">Chỉnh sửa sản phẩm</h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input className="w-full p-2 bg-black border border-gray-700 rounded" value={editProduct.name ?? ''}
                                   onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} />

                            <select className="w-full p-2 bg-black border border-gray-700 rounded" value={editProduct.category_id ?? editProduct.category}
                                    onChange={(e) => {
                                      const cid = Number(e.target.value);
                                      const catName = CATEGORIES.find(c => c.id === cid)?.name ?? '';
                                      setEditProduct({ ...editProduct, category_id: cid, category: catName });
                                    }}>
                              <option value="">-- Chọn danh mục --</option>
                              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>

                            <input className="w-full p-2 bg-black border border-gray-700 rounded" type="number" value={editProduct.price ?? 0}
                                   onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })} />
                            <input className="w-full p-2 bg-black border border-gray-700 rounded" type="number" value={editProduct.stock ?? 0}
                                   onChange={(e) => setEditProduct({ ...editProduct, stock: Number(e.target.value), quantity: Number(e.target.value) })} />

                            <input className="w-full p-2 bg-black border border-gray-700 rounded" placeholder="Mã sản phẩm (code)"
                                   value={editProduct.code ?? ''} onChange={(e) => setEditProduct({ ...editProduct, code: e.target.value })} />

                            <select className="w-full p-2 bg-black border border-gray-700 rounded" value={editProduct.brand_id ?? BRANDS[0].id}
                                    onChange={(e) => setEditProduct({ ...editProduct, brand_id: Number(e.target.value) })}>
                              {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>

                            <select className="w-full p-2 bg-black border border-gray-700 rounded" value={editProduct.status ?? 'Còn hàng'}
                                    onChange={(e) => setEditProduct({ ...editProduct, status: e.target.value })}>
                              <option>Còn hàng</option>
                              <option>Sắp hết</option>
                              <option>Hết hàng</option>
                            </select>
                          </div>

                          <div className="flex justify-end gap-3 mt-4">
                            <button className="px-4 py-2 bg-gray-700 rounded" onClick={() => setIsEditOpen(false)}>Hủy</button>
                            <button className="px-4 py-2 bg-blue-600 rounded" onClick={updateProduct}>Lưu</button>
                          </div>
                        </div>
                      </div>
                  )}
                </div>
            )}

            {/* Các tab khác */}
            {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl mb-6">Quản lý đơn hàng</h2>
                  {/* ... */}
                </div>
            )}
            {activeTab === 'customers' && (
                <div>
                  <h2 className="text-2xl mb-6">Quản lý khách hàng</h2>
                  {/* ... */}
                </div>
            )}
            {activeTab === 'coupons' && (
                <div>
                  <h2 className="text-2xl mb-6">Mã giảm giá</h2>
                  {/* ... */}
                </div>
            )}
            {activeTab === 'content' && (
                <div>
                  <h2 className="text-2xl mb-6">Quản lý nội dung</h2>
                  {/* ... */}
                </div>
            )}
          </main>
        </div>
      </div>
  );
}
