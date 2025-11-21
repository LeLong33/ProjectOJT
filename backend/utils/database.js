
const fs = require('fs');
const path = require('path');
const DB_PATH = path.join(__dirname, '..', '..', 'database.json');

const loadDb = () => {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("LỖI: Không thể đọc database.json. Sử dụng cấu trúc rỗng.");
        return { users: [], products: [], orders: [] };
    }
};

const saveDb = (dbData) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2), 'utf8');
    } catch (error) {
        console.error("LỖI: Không thể ghi vào database.json:", error.message);
    }
};

module.exports = {
    loadDb,
    saveDb
};