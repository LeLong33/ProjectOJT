// backend/src/server.ts (Phần cập nhật)
import dotenv from 'dotenv';
// Load .env ngay lập tức trước khi import bất kỳ module nào dùng env
dotenv.config();

import express from 'express';
import cors from 'cors';
import { checkDbConnection } from './config/database';

// Import Routes
import authRoutes from './routes/AuthRoutes';
import productRoutes from './routes/ProductRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware cơ bản
app.use(cors());
app.use(express.json());

// Route mặc định
app.get('/', (req, res) => {
    res.send('TechStore API Service is running!');
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);  // ⬅ ✔ Thêm Product API

// Khởi động server
const startServer = async () => {
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