import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import { Toaster } from "sonner";
import AuthSuccessPage from "./pages/AuthSuccess"; 
import { ProtectedRoute } from  "./components/auth/ProtectedRouter";
import AdminDashboard from "./pages/admin/AdminDashboard";


// ⬅️ CẦN THIẾT: Import AuthProvider
import { AuthProvider } from "./context/AuthContext";
import AuthSuccess from "./pages/AuthSuccess";

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

export default App;