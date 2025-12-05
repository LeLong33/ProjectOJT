import React, { useEffect, useState } from 'react';
import { Package, Plus, Trash, Edit, Star } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/context/AuthContext';

interface Product {
    product_id: number;
    name: string;
    code: string;
    price: number;
    quantity: number;
    is_active: boolean;
    rating: number;
}

export default function ProductCRUD() {
    const { user } = useAuth();
    const api = useApi();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Lấy TẤT CẢ sản phẩm (Admin thường cần xem cả sản phẩm không active)
            const res = await api.get('/products'); // Giả định Admin API có endpoint chung
            setProducts(res.data.data || []);
            setLoading(false);
        } catch (error: any) {
            setMessage(`Lỗi tải dữ liệu: ${error.response?.data?.message || error.message}`);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // TEST: Xóa sản phẩm (Chỉ Admin)
    const handleDelete = async (id: number) => {
        if (user?.role !== 'admin' || !confirm(`Bạn có chắc chắn muốn xóa (soft delete) sản phẩm ID ${id}?`)) return;

        try {
            const res = await api.delete(`/products/admin/${id}`);
            setMessage(res.data.message);
            fetchProducts(); // Tải lại danh sách
        } catch (error: any) {
            setMessage(`❌ Lỗi xóa: ${error.response?.data?.message || 'Không đủ quyền/Lỗi server'}`);
        }
    };

    if (loading) return <div className="text-gray-400">Đang tải danh sách sản phẩm...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                    <Package className="w-6 h-6" /> Quản lý Sản phẩm
                </h3>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Thêm mới
                </button>
            </div>

            {message && <div className={`p-3 rounded-lg ${message.startsWith('❌') ? 'bg-red-500/30 text-red-300' : 'bg-green-500/30 text-green-300'}`}>{message}</div>}

            <div className="bg-gray-800 rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Tên sản phẩm</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Giá</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Trạng thái</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {products.map((p) => (
                            <tr key={p.product_id} className="hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-400">{p.product_id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{p.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">{new Intl.NumberFormat('vi-VN').format(p.price)} đ</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {p.is_active ? 'Active' : 'Deleted'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button className="text-blue-400 hover:text-blue-300" title="Sửa"><Edit className="w-4 h-4 inline-block" /></button>
                                    <button 
                                        onClick={() => handleDelete(p.product_id)} 
                                        disabled={user?.role !== 'admin'}
                                        className="text-red-400 hover:text-red-300 disabled:opacity-50" title="Xóa">
                                        <Trash className="w-4 h-4 inline-block" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="text-xs text-gray-500">Người dùng có role 'staff' có thể Sửa/Thêm, chỉ 'admin' mới được Xóa.</div>
        </div>
    );
}