import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phoneNumber: ''
  });
  
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) {
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate('/login');
    }
  };

  return (
    <div className="auth-container">
      <h2>Đăng Ký Tài Khoản</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên đầy đủ:</label>
          <input name="fullName" type="text" onChange={handleChange} required />
        </div>
        <div>
          <label>Tên đăng nhập (Username):</label>
          <input name="username" type="text" onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input name="email" type="email" onChange={handleChange} required />
        </div>
        <div>
          <label>Số điện thoại:</label>
          <input name="phoneNumber" type="tel" onChange={handleChange} required />
        </div>
        <div>
          <label>Mật khẩu:</label>
          <input name="password" type="password" onChange={handleChange} required />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link></p>
    </div>
  );
};

export default Register;