// src/server.ts
import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/AuthRoutes';
// import productRoutes from './routes/ProductRoutes'; // Ví dụ cho routes khác

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON body

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});