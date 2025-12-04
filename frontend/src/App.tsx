import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import { Toaster } from "sonner";
import AuthSuccessPage from "./pages/AuthSuccess"; 
import { ProtectedRoute } from  "./components/auth/ProtectedRouter";
import AdminDashboard from "./pages/admin/AdminDashboard";


// ⬅️ CẦN THIẾT: Import AuthProvider
import { AuthProvider } from "./context/AuthContext";
import AuthSuccess from "./pages/AuthSuccess";
import { CartProvider } from './contexts/CartContext';
import { ProductListPage } from './pages/ProductListPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { UserAccountPage } from './pages/UserAccountPage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  return (
    <AuthProvider>
      <Toaster richColors/>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<SignInPage />}/>
          <Route path="/register" element={<SignUpPage />}/>
          <Route path="/auth/success" element={<AuthSuccess />} /> 
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/account" element={<UserAccountPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          {/* ⬅️ ROUTE ADMIN DASHBOARD */}
            <Route 
                path="/admin" 
                element={
                    <ProtectedRoute allowedRoles={['admin', 'staff']}> 
                        <AdminDashboard /> 
                    </ProtectedRoute>
                } 
            />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    
  );
}
