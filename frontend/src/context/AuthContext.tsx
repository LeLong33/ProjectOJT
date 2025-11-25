import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, AuthContextType, LoginCredentials, RegisterData, User } from '../types/auth';
import axiosClient from '../api/axiosClient';

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  isLoading: false,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialAuthState);

  // Kiểm tra đăng nhập khi reload trang
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
        setState(s => ({
            ...s,
            isAuthenticated: true,
            token: token,
            user: JSON.parse(userStr)
        }));
    }
  }, []);

  // ĐĂNG NHẬP
  const login = async (credentials: LoginCredentials) => {
    setState(s => ({ ...s, isLoading: true, error: null }));
    try {
      const response = await axiosClient.post('/auth/login', credentials);
      const { token, user } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      setState({
        user: user,
        isAuthenticated: true,
        token: token,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Lỗi đăng nhập';
      setState(s => ({ ...s, isLoading: false, error: msg }));
    }
  };

  // ĐĂNG KÝ
  const register = async (userData: RegisterData) => {
    setState(s => ({ ...s, isLoading: true, error: null }));
    try {
      await axiosClient.post('/auth/register', userData);
      setState(s => ({ ...s, isLoading: false, error: null }));
      return true; // Trả về true để chuyển trang
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Lỗi đăng ký';
      setState(s => ({ ...s, isLoading: false, error: msg }));
      return false;
    }
  };

  // ĐĂNG NHẬP GOOGLE
  const googleLogin = async (googleToken: string) => {
    setState(s => ({ ...s, isLoading: true, error: null }));
    try {
       // Gửi token Google lên backend để xử lý
       const response = await axiosClient.post('/auth/login', { googleToken });
       const { token, user } = response.data;

       localStorage.setItem('authToken', token);
       localStorage.setItem('user', JSON.stringify(user));

       setState({
         user: user,
         isAuthenticated: true,
         token: token,
         isLoading: false,
         error: null,
       });
    } catch (err: any) {
       setState(s => ({ ...s, isLoading: false, error: 'Lỗi đăng nhập Google' }));
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setState(initialAuthState);
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};