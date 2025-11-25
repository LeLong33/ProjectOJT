import mysql from 'mysql2/promise';
// NOTE: dotenv is loaded in `server.ts` (startup). Avoid re-loading here
// to prevent incorrect relative path resolution and missing env vars.

// Tạo Pool kết nối để quản lý hiệu quả hơn các kết nối DB
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306'), // Đảm bảo port là kiểu số
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log(`Kết nối database: ${process.env.DB_NAME}`);

// Hàm kiểm tra kết nối (Optional)
export async function checkDbConnection(): Promise<boolean> {
    try {
        // Lấy một kết nối từ pool để kiểm tra
        const connection = await pool.getConnection(); 
        connection.release(); // Trả kết nối về pool ngay sau khi kiểm tra
        console.log('✅ Kết nối MySQL thành công!');
        return true;
    } catch (error) {
        console.error('❌ Lỗi kết nối MySQL:', error);
        console.error('Vui lòng kiểm tra Server MySQL có đang chạy và thông tin trong file .env có chính xác không.');
        return false;
    }
}

export default pool;