import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, List, Tag, User, Code, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const api = useApi();
    const navigate = useNavigate();
    const [testResult, setTestResult] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Hàm TEST API POST (chỉ Admin/Staff)
    const testAdminPost = async () => {
        setTestResult('Đang chạy test POST...');
        if (!user) return;

        // Dữ liệu tạo sản phẩm TEST (cần brand_id=1, category_id=1 từ DB mẫu)
        const testData = {
            name: `Test Quyền ${user.role} ${Date.now()}`, 
            price: 99.99, 
            quantity: 1, 
            code: `TEST${Date.now().toString().slice(-6)}`,
            brand_id: 1, 
            category_id: 1
        };

        try {
            const res = await api.post('/products/admin', testData);
            setTestResult(`✅ Thành công! Role ${user.role} đã tạo sản phẩm ID: ${res.data.product_id}`);
        } catch (error: any) {
            if (error.response?.status === 403) {
                 setTestResult(`❌ Thất bại: Bạn có role [${user.role.toUpperCase()}] nhưng không đủ quyền tạo sản phẩm (403 Forbidden).`);
            } else if (error.response?.status === 401) {
                 setTestResult('❌ Thất bại: Token hết hạn/Không hợp lệ (401 Unauthorized).');
            } else {
                 setTestResult(`❌ Lỗi API: ${error.message}`);
            }
        }
    };

    if (!user) {
        return <div className="p-10 text-red-500">Đang tải thông tin người dùng...</div>;
    }

    // Các mục điều hướng
    const navItems = [
        { name: "Sản phẩm", icon: Package, link: "/admin/products", roles: ['admin', 'staff'] },
        { name: "Danh mục", icon: List, link: "/admin/categories", roles: ['admin', 'staff'] },
        { name: "Thương hiệu", icon: Tag, link: "/admin/brands", roles: ['admin', 'staff'] },
        { name: "Người dùng", icon: User, link: "/admin/users", roles: ['admin'] },
    ];

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 p-6 shadow-2xl flex flex-col justify-between">
                <div>
                    <h2 className="text-3xl font-bold mb-8 text-red-500">Admin Panel</h2>
                    <p className="text-sm text-gray-400 mb-4">Vai trò hiện tại: <span className="font-bold text-red-400">{user.role.toUpperCase()}</span></p>
                    <nav className="space-y-2">
                        {navItems
                            // Lọc các mục chỉ được phép hiển thị cho vai trò hiện tại
                            .filter(item => item.roles.includes(user.role))
                            .map(item => (
                                <Link 
                                    key={item.name} 
                                    to={item.link} 
                                    className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-red-600/50 hover:text-white transition-colors duration-200"
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-base">{item.name}</span>
                                </Link>
                            ))
                        }
                    </nav>
                </div>

                {/* Footer / User Info */}
                <div className="mt-8 pt-4 border-t border-gray-700">
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-3 w-full p-3 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-4xl font-extrabold mb-6 text-white">Chào mừng, {user.name}!</h1>
                <p className="text-lg text-gray-400">Dashboard thử nghiệm chức năng Backend Admin.</p>

                <div className="mt-10 p-6 bg-gray-800 rounded-xl shadow-lg border border-red-700/50">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><Code className="h-6 w-6"/> Test Quyền POST Sản phẩm (/api/products/admin)</h2>
                    <button 
                        onClick={testAdminPost} 
                        disabled={!['admin', 'staff'].includes(user.role)}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-4 py-2 rounded text-white font-semibold transition-colors"
                    >
                        {['admin', 'staff'].includes(user.role) ? 'Chạy Test POST' : 'Yêu cầu quyền Admin/Staff'}
                    </button>
                    <p className="mt-4 text-lg font-medium text-yellow-400">Kết quả: {testResult}</p>
                </div>

            </main>
        </div>
    );
}