import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { useAuth } from '@/context/AuthContext'; // Dùng để xử lý lỗi 401

// Lấy API URL từ biến môi trường (Giả định: http://localhost:5000/api)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Custom hook cho các request có xác thực (Authentication)
 */
export const useApi = (): AxiosInstance => {
    const defaultOptions: AxiosRequestConfig = {
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    const instance = axios.create(defaultOptions);

    // THÊM INTERCEPTOR: Tự động gắn Token vào Header
    instance.interceptors.request.use(async (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    // THÊM INTERCEPTOR: Xử lý lỗi 401/403 toàn cục (Optional, nhưng tốt cho UX)
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401 || error.response?.status === 403) {
                // Đây là nơi bạn có thể gọi logout() và chuyển hướng về trang đăng nhập
                // (Cần dùng navigate/useAuth bên ngoài hook này, nên ta chỉ log lỗi)
                console.error("API Call Unauthorized/Forbidden:", error.response.status);
            }
            return Promise.reject(error);
        }
    );

    return instance;
};