import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { jwtDecode } from 'jwt-decode';

interface UserData {
  id: number;
  role: 'user' | 'staff' | 'admin';
  name: string;
}

// 1️⃣ CẬP NHẬT INTERFACE: Thêm token vào đây
interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
  user: UserData | null; // Sửa lại type cho rõ ràng (bỏ undefined)
  token: string | null;  // ⬅️ THÊM DÒNG NÀY
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  // 2️⃣ CẬP NHẬT STATE: Thêm state lưu token
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      const storedToken = localStorage.getItem("token");
      
      if (storedToken) {
        try {
          const decoded = jwtDecode<UserData & { exp?: number }>(storedToken);
          
          // Kiểm tra hết hạn
          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            console.warn('Token expired');
            logout(); // Gọi hàm logout để dọn dẹp
            return;
          }

          setUser({ id: decoded.id, role: decoded.role, name: decoded.name });
          setIsAuthenticated(true);
          setToken(storedToken); // Cập nhật state token
        } catch (err) {
          console.warn('Invalid token, clearing...');
          logout();
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken); // Cập nhật state
    try {
      const decoded = jwtDecode<UserData & { exp?: number }>(newToken);
      setUser({ id: decoded.id, role: decoded.role, name: decoded.name });
      setIsAuthenticated(true);
    } catch {
      // Nếu decode lỗi thì logout ngay
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null); // Xóa state
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    // 3️⃣ TRẢ VỀ TOKEN TRONG VALUE
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading, user, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;