import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles: Array<'admin' | 'staff' | 'user'>;
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, user, isLoading } = useAuth();

    // 1. Đang tải: Hiển thị màn hình chờ (tránh nháy redirect)
    if (isLoading) {
        return <div className="p-10 text-center">Đang tải...</div>;
    }

    // 2. Chưa xác thực: Chuyển hướng đến trang đăng nhập
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    // 3. Kiểm tra vai trò: Nếu user tồn tại và không có role hợp lệ
    if (user && !allowedRoles.includes(user.role)) {
        // Chuyển hướng đến trang chủ nếu không đủ quyền
        return <Navigate to="/" replace />; 
    }

    // 4. Hợp lệ: Render component con
    return <>{children}</>;
}