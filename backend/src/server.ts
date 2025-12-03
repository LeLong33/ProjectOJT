// backend/src/server.ts
import dotenv from 'dotenv';
// Load .env trước
dotenv.config();

import express from 'express';
import cors from 'cors';
import session from 'express-session';

import { checkDbConnection } from './config/database';
import passport from './config/passport';

// Import Routes
import authRoutes from './routes/AuthRoutes';
import productRoutes from './routes/ProductRoutes';
import cartRoutes from './routes/CartRoutes';   

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====

// Cho phép CORS
app.use(cors({
    origin: "*",       // Có thể chỉnh sau
    credentials: true  // Session cần cái này nếu FE dùng cookies
}));

// Parse JSON body
app.use(express.json());

// ⚡️ Thêm express-session (LƯU CART TRONG SESSION)
app.use(
    session({
        secret: "techstore-session-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000, // 1 ngày
        }
    })
);

// Passport
app.use(passport.initialize());

// ===== ROUTES =====

// Route mặc định
app.get('/', (req, res) => {
    res.send('TechStore API Service is running!');
});

// Đăng ký router
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);  // ⬅ Thêm Cart API
app.use('/api', authRoutes);       // (Bạn có thể xoá dòng này, đang bị dư)

// ===== START SERVER =====
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
