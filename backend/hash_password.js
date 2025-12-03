// hash_password.js
const bcrypt = require('bcryptjs'); 

const password = '123456';
const saltRounds = 10; 

console.log(`Đang băm mật khẩu: ${password}...`);

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('Lỗi khi băm:', err);
        return;
    }
    console.log('----------------------------------------------------');
    console.log('✅ CHUỖI HASH MỚI (COPY VÀ DÁN VÀO DB):');
    console.log(hash); 
    console.log('----------------------------------------------------');
    process.exit(0);
});