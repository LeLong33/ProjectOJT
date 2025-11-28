import dotenv from 'dotenv';
// Load .env trước mọi import khác
dotenv.config();

import express from 'express';
import cors from 'cors';
import { checkDbConnection } from './config/database';
import passport from './config/passport';

// Import TẤT CẢ các Routes đã tạo
import authRoutes from './routes/AuthRoutes';
import productRoutes from './routes/ProductRoutes';
import categoryRoutes from './routes/CategoryRoutes'; // ⬅️ THÊM
import brandRoutes from './routes/BrandRoutes';       // ⬅️ THÊM
import userRoutes from './routes/UserRoutes';         // ⬅️ THÊM (Cho Profile/Address)

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware cơ bản
app.use(cors());
app.use(express.json());
app.use(passport.initialize()); // Khởi tạo Passport cho Google Auth

// Route mặc định
app.get('/', (req, res) => {
    res.send('TechStore API Service is running!');
});

// Register routes (Tích hợp tất cả các module vào /api)
app.use('/api/auth', authRoutes);       // Đăng ký/Đăng nhập
app.use('/api/users', userRoutes);      // Profile và Địa chỉ (Yêu cầu Token)
app.use('/api/products', productRoutes); // Sản phẩm (Public & Admin)
app.use('/api/categories', categoryRoutes); // ⬅️ Tích hợp Category CRUD
app.use('/api/brands', brandRoutes);       // ⬅️ Tích hợp Brand CRUD

// KHÔNG CẦN DÒNG app.use('/api', authRoutes);

// Khởi động server
const startServer = async () => {
    // Lưu ý: checkDbConnection() của bạn đang import từ './config/database', 
    // đảm bảo tên file đó là 'database.ts' thay vì 'db.ts'.
    const isConnected = await checkDbConnection(); 

    if (!isConnected) {
        console.error('❌ Không thể kết nối cơ sở dữ liệu. Server dừng lại.');
        return;
    }

    app.listen(PORT, () => {
        console.log(`⚡️ Server đang chạy tại http://localhost:${PORT}`);
    });
};

startServer();