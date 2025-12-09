import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Package, List, Tag, User, Code, LogOut, Home, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';

// Import các component quản lý
import ProductCRUD from './ProductCRUD';
import UserCRUD from './UserCRUD'; // ⬅️ THÊM: Component quản lý người dùng

const Overview = () => (
    <div className="space-y-4">
        <h1 className="text-4xl font-extrabold text-white">Tổng quan Dashboard</h1>
        <div className="grid grid-cols-3 gap-6">
            <div className="p-6 bg-red-700/50 rounded-xl shadow-lg">Tổng sản phẩm: XX</div>
            <div className="p-6 bg-blue-700/50 rounded-xl shadow-lg">Đơn hàng mới: XX</div>
            <div className="p-6 bg-green-700/50 rounded-xl shadow-lg">Doanh thu tháng: XX</div>
        </div>
        <div className="mt-8 p-6 bg-gray-800 rounded-xl shadow-lg">
             <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><Code className="h-6 w-6"/> Test Quyền POST Sản phẩm</h2>
             <p className="text-gray-400">Chọn "Sản phẩm" hoặc "Người dùng" từ menu để thực hiện CRUD và kiểm tra phân quyền 403.</p>
        </div>
    </div>
);


export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const api = useApi();
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    const renderMainContent = () => {
        if (currentPath.endsWith('/admin/products')) {
            return <ProductCRUD />;
        }
        if (currentPath.endsWith('/admin/users')) {
            return <UserCRUD/>; // ⬅️ RENDER USER LIST
        }
        return <Overview />;
    };
    
    if (!user) {
        return <div className="p-10 text-red-500">Đang tải thông tin người dùng...</div>;
    }

    // ⬅️ CẬP NHẬT: Loại bỏ Brand, Category, thêm Users
    const navItems = [
        { name: "Tổng quan", icon: Home, link: "/admin", roles: ['admin', 'staff', 'user'] }, // User cũng có thể xem tổng quan
        { name: "Sản phẩm", icon: Package, link: "/admin/products", roles: ['admin', 'staff'] },
        { name: "Người dùng", icon: Users, link: "/admin/users", roles: ['admin'] }, // Chỉ Admin quản lý users
    ];
    
    const isActive = (path: string) => currentPath.endsWith(path) || (path === '/admin' && currentPath === '/admin');


    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 p-6 shadow-2xl flex flex-col justify-between sticky top-0 h-screen">
                <div>
                    <h2 className="text-3xl font-bold mb-8 text-red-500">Admin Panel</h2>
                    <p className="text-sm text-gray-400 mb-4">Vai trò: <span className="font-bold text-red-400">{user.role.toUpperCase()}</span></p>
                    <nav className="space-y-2">
                        {navItems
                            .filter(item => item.roles.includes(user.role))
                            .map(item => (
                                <Link 
                                    key={item.name} 
                                    to={item.link} 
                                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                                        isActive(item.link) 
                                        ? 'bg-red-600 text-white' 
                                        : 'text-gray-300 hover:bg-gray-700'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-base">{item.name}</span>
                                </Link>
                            ))
                        }
                    </nav>
                </div>

                {/* Footer / Logout */}
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
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                    {renderMainContent()}
                </div>
            </main>
        </div>
    );
}