// backend/src/server.ts (Phần cập nhật)
import dotenv from 'dotenv';
// Load .env ngay lập tức trước khi import bất kỳ module nào dùng env
dotenv.config();

import express from 'express';
import cors from 'cors';
import { checkDbConnection } from './config/database';
import authRoutes from './routes/AuthRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware cơ bản
app.use(cors()); 
app.use(express.json()); // Đọc body JSON từ request

// Định tuyến chính
app.get('/', (req, res) => {
    res.send('TechStore API Service is running!');
});

// Sử dụng các định tuyến đã tạo
app.use('/api/auth', authRoutes); // Thêm đường dẫn Auth

// Khởi động server (Hàm checkDbConnection phải được code trong config/db.ts)
const startServer = async () => {
    const isConnected = await checkDbConnection(); // Giả định hàm này đã có
    if (!isConnected) {
        console.error('Ứng dụng không thể khởi động nếu không kết nối được DB.');
        return; 
    }

    app.listen(PORT, () => {
        console.log(`⚡️ Server đang chạy tại http://localhost:${PORT}`);
    });
};

startServer();