// src/types/auth.d.ts

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
}

export interface LoginCredentials {
  email: string; // Backend dùng email để đăng nhập
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<boolean>;
  googleLogin: (token: string) => Promise<void>;
  logout: () => void;
}