import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Đảm bảo backend đang chạy ở port này
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động thêm Token vào Header cho mọi request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;