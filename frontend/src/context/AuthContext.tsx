import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import jwtDecode from 'jwt-decode';
// Định nghĩa kiểu cho User Data (Payload JWT)
interface UserData {
  id: number;
  role: 'user' | 'staff' | 'admin'; // Role lấy từ Backend
  name: string;
  // exp: number; (Thời gian hết hạn)
}
// Định nghĩa kiểu dữ liệu cho Context
interface AuthContextType {
  isAuthenticated: boolean; // Trạng thái: Đã đăng nhập chưa?
  login: (token: string) => void; // Hàm đăng nhập
  logout: () => void; // Hàm đăng xuất
  isLoading: boolean; // Trạng thái đang kiểm tra token
  user?: UserData | null;
}

// Tạo Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode<UserData & { exp?: number }>(token);
          setUser({ id: decoded.id, role: decoded.role, name: decoded.name });
          // Nếu token có exp và đã hết hạn thì logout
          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
            setIsLoading(false);
            return;
          }
          setIsAuthenticated(true);
        } catch (err) {
          // Nếu token không hợp lệ
          console.warn('Invalid token stored, clearing it.');
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    try {
      const decoded = jwtDecode<UserData & { exp?: number }>(token);
      setUser({ id: decoded.id, role: decoded.role, name: decoded.name });
    } catch {
      setUser(null);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading, user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook (Giữ nguyên Named Export)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ⬅️ PHẦN BỔ SUNG QUAN TRỌNG: Thêm Default Export
// Điều này giúp giải quyết lỗi khi các file khác dùng import useAuth from '...'
// Export default the Provider for convenience
export default AuthProvider;
