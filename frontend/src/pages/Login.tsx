import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, googleLogin, isAuthenticated, isLoading, error } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/categories');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div className="auth-container">
      <h2>Đăng Nhập</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Mật khẩu:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        
        {/* --- THÊM LINK QUÊN MẬT KHẨU --- */}
        <div style={{ textAlign: 'right', marginBottom: '15px', fontSize: '0.9rem' }}>
            <Link to="/forgot-password" style={{ color: '#007bff', textDecoration: 'none' }}>
                Quên mật khẩu?
            </Link>
        </div>
        {/* ------------------------------- */}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
        </button>
      </form>
      
      <div style={{ margin: '20px 0' }}>
        <p>Hoặc đăng nhập bằng:</p>
        <GoogleLogin
          onSuccess={(credentialResponse: any) => {
            if (credentialResponse.credential) {
                googleLogin(credentialResponse.credential);
            }
          }}
          onError={() => console.log('Login Failed')}
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
    </div>
  );
};

export default Login;