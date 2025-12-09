import mysql from 'mysql2/promise';

// Tạo Pool kết nối để quản lý hiệu quả hơn các kết nối DB
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'techstore',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

console.log(`Kết nối database: ${process.env.DB_NAME}`);

// Hàm kiểm tra kết nối (Optional)
export const checkDbConnection = async () => {
    try {
        // Lấy một kết nối từ pool để kiểm tra
        const connection = await pool.getConnection(); 
        console.log('✅ Kết nối database thành công');
        connection.release(); // Trả kết nối về pool ngay sau khi kiểm tra
        return true;
    } catch (err: any) {
        console.error('❌ Lỗi kết nối database:', err.message);
        return false;
    }
};

export default pool;