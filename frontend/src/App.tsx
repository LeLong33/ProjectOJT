import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import AuthSuccess from "./pages/AuthSuccess";
import ForgotPassword from "./pages/ForgotPassword"; // Import trang mới
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import CartPage from './pages/CartPage';

function App() {
  return (
    <AuthProvider>
      <Toaster richColors/>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<SignInPage />}/>
          <Route path="/register" element={<SignUpPage />}/>
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;