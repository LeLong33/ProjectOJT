import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Categories from './pages/Categories';

// Thay bằng Client ID thật của bạn
const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"; 

const NavBar: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    return (
        <nav style={{ padding: '10px', background: '#eee', marginBottom: '20px', display: 'flex', gap: '15px' }}>
            <Link to="/categories">Danh Mục</Link>
            <div style={{ marginLeft: 'auto' }}>
                {isAuthenticated ? (
                    <>
                        <span>Xin chào, <b>{user?.fullName}</b></span>
                        <button onClick={logout} style={{ marginLeft: '10px' }}>Đăng xuất</button>
                    </>
                ) : (
                    <Link to="/login">Đăng nhập</Link>
                )}
            </div>
        </nav>
    );
};

const App: React.FC = () => {
  return (
    <Router>
        <GoogleOAuthProvider clientId={CLIENT_ID}> 
            <AuthProvider> 
                <NavBar />
                <Routes>
                    <Route path="/" element={<Categories />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/categories" element={<Categories />} />
                </Routes>
            </AuthProvider>
        </GoogleOAuthProvider>
    </Router>
  );
};

export default App;