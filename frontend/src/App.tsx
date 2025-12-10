import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import { Toaster } from "sonner";
import { ProtectedRoute } from  "./components/auth/ProtectedRouter";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import ProductDetail from "./pages/products/ProductDetail";
import CartPage from "./pages/cart/CartPage";
import ProductList from "./pages/ProductList";
import { CheckoutPage } from "./pages/orders/CheckoutPage";
import { UserProfilePage } from "./pages/user/UserProfilePage";
import OrderConfirmationPage from './pages/orders/OrderConfirmationPage';
import { PaymentResultPage } from './pages/orders/PaymentResultPage'

// ⬅️ CẦN THIẾT: Import AuthProvider
import { AuthProvider } from "./context/AuthContext";
import AuthSuccess from "./pages/AuthSuccess";

function App() {
  const [cartCount, setCartCount] = useState(0);
  return (
    <AuthProvider>
      <Toaster richColors/>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<SignInPage />}/>
          <Route path="/register" element={<SignUpPage />}/>
          <Route path="/auth/success" element={<AuthSuccess />} /> 
          <Route path="/checkout" element={<CheckoutPage cartCount={cartCount} />} /> 
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/payment-result" element={<PaymentResultPage />} />
          {/* ⬅️ ROUTE ADMIN DASHBOARD */}
            <Route 
                path="/admin" 
                element={
                    <ProtectedRoute allowedRoles={['admin', 'staff']}> 
                        <AdminDashboard /> 
                    </ProtectedRoute>
                } 
            />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={['admin', 'staff', 'user']}> <UserProfilePage cartCount={cartCount} /> </ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;