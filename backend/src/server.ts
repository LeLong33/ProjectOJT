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
import orderRoutes from './routes/OrderRoutes';   // ⬅️ THÊM (Cho Orders)
import paymentRoutes from './routes/PaymentRoutes';


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
app.use('/api/auth', authRoutes);
console.log('✅ /api/auth registered');

app.use('/api/users', userRoutes);
console.log('✅ /api/users registered');

app.use('/api/products', productRoutes);
console.log('✅ /api/products registered');

app.use('/api/categories', categoryRoutes);
console.log('✅ /api/categories registered');

app.use('/api/brands', brandRoutes);
console.log('✅ /api/brands registered');

app.use('/api/orders', orderRoutes);
console.log('✅ /api/orders registered');

app.use('/api/payment', paymentRoutes);
console.log('✅ /api/payment registered');

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