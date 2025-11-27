import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import { Toaster } from "sonner";
import AuthSuccessPage from "./pages/AuthSuccess"; 

// ⬅️ CẦN THIẾT: Import AuthProvider
import { AuthProvider } from "./context/AuthContext";
import AuthSuccess from "./pages/AuthSuccess";

function App() {
  return (
    // 1. BỌC TRONG AUTHPROVIDER
    <AuthProvider>
      <Toaster richColors/>

      {/* 2. BrowserRouter phải nằm trong AuthProvider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<SignInPage />}/>
          <Route path="/register" element={<SignUpPage />}/>
          
          {/* Sửa tên component ở Route */}
          <Route path="/auth/success" element={<AuthSuccess />} /> 
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;