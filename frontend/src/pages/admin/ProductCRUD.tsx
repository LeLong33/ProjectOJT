import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useApi } from '@/hooks/useApi';

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

const BRANDS = [
  { id: 1, name: 'Asus' },
  { id: 2, name: 'Acer' },
  { id: 3, name: 'Dell' },
  { id: 4, name: 'HP' },
  { id: 5, name: 'MSI' },
];

interface Product {
  product_id: number;
  name: string;
  code: string;
  price: number;
  quantity: number;
  brand_id: number;
  brand_name?: string;
  category_id: number;
  category_name?: string;
  description?: string;
  short_description?: string;
  image?: string;
  is_active?: boolean;
}

interface ProductFormData {
  name: string;
  code: string;
  price: number;
  quantity: number;
  brand_id: number;
  category_id: number;
  description: string;
  short_description: string;
  image_url: string;
}

export function ProductCRUD() {
  const api = useApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    code: '',
    price: 0,
    quantity: 0,
    brand_id: BRANDS[0].id,
    category_id: CATEGORIES[0].id,
    description: '',
    short_description: '',
    image_url: '',
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const getStatusColor = (stock: number) => {
    if (stock > 10) return 'bg-green-500/20 text-green-500';
    if (stock > 0) return 'bg-yellow-500/20 text-yellow-500';
    return 'bg-red-500/20 text-red-500';
  };

  const getStatusText = (stock: number) => {
    if (stock > 10) return 'Còn hàng';
    if (stock > 0) return 'Sắp hết';
    return 'Hết hàng';
  };

  const fetchProducts = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await api.get('/products');
      const data = res.data?.data ?? res.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      const error = err as any;
      setMessage(`❌ Lỗi tải sản phẩm: ${error.response?.data?.message ?? error.message ?? 'Lỗi không xác định'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      price: 0,
      quantity: 0,
      brand_id: BRANDS[0].id,
      category_id: CATEGORIES[0].id,
      description: '',
      short_description: '',
      image_url: '',
    });
  };

  const handleAdd = async () => {
    setMessage('');
    if (!formData.name || !formData.code || !formData.price) {
      setMessage('❌ Vui lòng nhập đầy đủ Tên, Mã và Giá sản phẩm');
      return;
    }

    try {
      const res = await api.post('/products', formData);
      setMessage(res.data?.message ?? '✅ Tạo sản phẩm thành công');
      setIsAddOpen(false);
      resetForm();
      await fetchProducts();
    } catch (err) {
      const error = err as any;
      setMessage(`❌ Lỗi: ${error.response?.data?.message ?? error.message ?? 'Lỗi không xác định'}`);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      code: product.code,
      price: product.price,
      quantity: product.quantity,
      brand_id: product.brand_id,
      category_id: product.category_id,
      description: product.description ?? '',
      short_description: product.short_description ?? '',
      image_url: product.image ?? '',
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    setMessage('');
    if (!editingProduct) return;
    if (!formData.name || !formData.price) {
      setMessage('❌ Vui lòng nhập đầy đủ Tên và Giá sản phẩm');
      return;
    }

    try {
      const res = await api.put(`/products/${editingProduct.product_id}`, formData);
      setMessage(res.data?.message ?? '✅ Cập nhật thành công');
      setIsEditOpen(false);
      setEditingProduct(null);
      resetForm();
      await fetchProducts();
    } catch (err) {
      const error = err as any;
      setMessage(`❌ Lỗi: ${error.response?.data?.message ?? error.message ?? 'Lỗi không xác định'}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm ID ${id}?`)) return;
    setMessage('');
    try {
      const res = await api.delete(`/products/${id}`);
      setMessage(res.data?.message ?? '✅ Xóa thành công');
      await fetchProducts();
    } catch (err) {
      const error = err as any;
      setMessage(`❌ Lỗi: ${error.response?.data?.message ?? error.message ?? 'Lỗi không xác định'}`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl">Quản lý sản phẩm</h2>
        <button
          onClick={() => {
            resetForm();
            setIsAddOpen(true);
          }}
          className="px-6 py-3 bg-[#007AFF] hover:bg-[#0051D5] rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Thêm sản phẩm
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes('❌') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {message}
        </div>
      )}

      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-gray-400 font-normal">#</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Ảnh</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Mã SP</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Tên sản phẩm</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Danh mục</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Thương hiệu</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Giá</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Số lượng</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Trạng thái</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-gray-400">
                    Đang tải...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-gray-400">
                    Chưa có sản phẩm
                  </td>
                </tr>
              ) : (
                products.map((p, idx) => (
                  <tr key={p.product_id} className="border-b border-gray-800 last:border-0 hover:bg-[#0a0a0a]">
                    <td className="py-3 px-4">{idx + 1}</td>
                    <td className="py-3 px-4">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center text-gray-600 text-xs">
                          No img
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-sm text-gray-400">{p.code}</td>
                    <td className="py-3 px-4">{p.name}</td>
                    <td className="py-3 px-4 text-gray-400">
                      {p.category_name ?? CATEGORIES.find(c => c.id === p.category_id)?.name ?? '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {p.brand_name ?? BRANDS.find(b => b.id === p.brand_id)?.name ?? '-'}
                    </td>
                    <td className="py-3 px-4 text-[#007AFF]">{formatPrice(p.price)}</td>
                    <td className="py-3 px-4">{p.quantity}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(p.quantity)}`}>
                        {getStatusText(p.quantity)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-2 hover:bg-[#0a0a0a] rounded transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.product_id)}
                          className="p-2 hover:bg-[#0a0a0a] rounded transition-colors text-red-400"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl">Thêm sản phẩm mới</h3>
              <button onClick={() => setIsAddOpen(false)} className="p-2 hover:bg-[#0a0a0a] rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tên sản phẩm *</label>
                <input
                  className="w-full p-2 bg-black border border-gray-700 rounded focus:border-[#007AFF] outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Mã sản phẩm *</label>
                <input
                  className="w-full p-2 bg-black border border-gray-700 rounded focus:border-[#007AFF] outline-none"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Giá *</label>
                  <input
                    type="number"
                    className="w-full p-2 bg-black border border-gray-700 rounded focus:border-[#007AFF] outline-none"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Số lượng</label>
                  <input
                    type="number"
                    className="w-full p-2 bg-black border border-gray-700 rounded focus:border-[#007AFF] outline-none"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Danh mục</label>
                  <select
                    className="w-full p-2 bg-black border border-gray-700 rounded focus:border-[#007AFF] outline-none"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                  >
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Thương hiệu</label>
                  <select
                    className="w-full p-2 bg-black border border-gray-700 rounded focus:border-[#007AFF] outline-none"
                    value={formData.brand_id}
                    onChange={(e) => setFormData({ ...formData, brand_id: Number(e.target.value) })}
                  >
                    {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Mô tả ngắn</label>
                <input
                  className="w-full p-2 bg-black border border-gray-700 rounded focus:border-[#007AFF] outline-none"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Mô tả chi tiết</label>
                <textarea
                  className="w-full p-2 bg-black border border-gray-700 rounded focus:border-[#007AFF] outline-none"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">URL ảnh</label>
                <input
                  className="w-full p-2 bg-black border border-gray-700 rounded focus:border-[#007AFF] outline-none"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsAddOpen(false)}
                className="px-6 py-2 border border-gray-700 rounded hover:bg-[#0a0a0a] transition-colors"
              >
                Hủy
              </button>
              <button onClick={handleAdd} className="px-6 py-2 bg-[#007AFF] rounded hover:bg-[#0051D5] transition-colors">
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl">Chỉnh sửa sản phẩm</h3>
              <button onClick={() => setIsEditOpen(false)} className="p-2 hover:bg-[#0a0a0a] rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tên sản phẩm *</label>
                <input
                  className="w-full p-2 bg-black border border-gray-700 rounded focus:border-[#007AFF] outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Mã sản phẩm</label>
                <input
                  className="w-full p-2 bg-black border border-gray-700 rounded focus:border-[#007AFF] outline-none"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  disabled
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Giá *</label>
                  <input
                    type="number"
                    className="w-full p-2 bg-black border border-gray-700 rounded focus:border-[#007AFF] outline-none"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Số lượng</label>
                  <input
                    type="number"
                    className="w-full p-2 bg-black border border-gray-700 rounded focus:border-[#007AFF] outline-none"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Danh mục</label>
                  <select
                    className="w-full p-2 bg-black border border-gray-700 rounded focus:border-[#007AFF] outline-none"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                  >
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Thương hiệu</label>
                  <select
                    className="w-full p-2 bg-black border border-gray-700 rounded focus:border-[#007AFF] outline-none"
                    value={formData.brand_id}
                    onChange={(e) => setFormData({ ...formData, brand_id: Number(e.target.value) })}
                  >
                    {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Mô tả ngắn</label>
                <input
                  className="w-full p-2 bg-black border border-gray-700 rounded focus:border-[#007AFF] outline-none"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Mô tả chi tiết</label>
                <textarea
                  className="w-full p-2 bg-black border border-gray-700 rounded focus:border-[#007AFF] outline-none"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">URL ảnh</label>
                <input
                  className="w-full p-2 bg-black border border-gray-700 rounded focus:border-[#007AFF] outline-none"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-6 py-2 border border-gray-700 rounded hover:bg-[#0a0a0a] transition-colors"
              >
                Hủy
              </button>
              <button onClick={handleUpdate} className="px-6 py-2 bg-[#007AFF] rounded hover:bg-[#0051D5] transition-colors">
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}