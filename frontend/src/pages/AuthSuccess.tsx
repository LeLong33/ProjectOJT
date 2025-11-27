// Ví dụ: frontend/src/pages/AuthSuccess.tsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AuthSuccess = () => {
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (token) {
            localStorage.setItem('token', token);
            // Chuyển hướng người dùng về trang chủ sau khi lưu token
            window.location.href = '/'; 
        } else {
            // Xử lý trường hợp không có token (ví dụ: thông báo lỗi)
            console.error("Không nhận được token từ Google.");
            window.location.href = '/login'; 
        }
    }, [location]);

    return <h1>Đang đăng nhập...</h1>;
};

// Đảm bảo cấu hình Router ở Frontend để route /auth/success trỏ đến component này.
export default AuthSuccess;