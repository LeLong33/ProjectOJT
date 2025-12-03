import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { checkDbConnection } from './config/database'; 

// Import các định tuyến
import authRoutes from './routes/AuthRoutes';
import productRoutes from './routes/ProductRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware cơ bản
app.use(cors()); 
app.use(express.json());

// Định tuyến chính
app.get('/', (req, res) => {
    res.send('TechStore API Service is running!');
});

// Sử dụng các định tuyến đã tạo
app.use('/api/auth', authRoutes);     
app.use('/api/products', productRoutes);

// Khởi động server
const startServer = async () => {
    const isConnected = await checkDbConnection();
    if (!isConnected) {
        console.error('Ứng dụng không thể khởi động nếu không kết nối được DB.');
        return; 
    }

    app.listen(PORT, () => {
        console.log(`⚡️ Server đang chạy tại http://localhost:${PORT}`);
        console.log(`Endpoint Sản phẩm sẵn sàng: GET http://localhost:${PORT}/api/products`);
    });
};

startServer();