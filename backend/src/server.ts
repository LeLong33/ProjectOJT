// backend/src/server.ts
import dotenv from 'dotenv';
// Load .env trước mọi import khác
dotenv.config();

import express from 'express';
import cors from 'cors';
import { checkDbConnection } from './config/database';
import passport from './config/passport';

// Import Routes
import authRoutes from './routes/AuthRoutes';
import productRoutes from './routes/ProductRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware cơ bản
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Route mặc định
app.get('/', (req, res) => {
    res.send('TechStore API Service is running!');
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);  // ⬅ ✔ Thêm Product API
app.use('/api', authRoutes);

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
