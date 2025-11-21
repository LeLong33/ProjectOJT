
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { loadDb, saveDb } = require('./utils/database'); 

const router = express.Router(); 
const JWT_SECRET = 'YOUR_SUPER_SECRET_KEY_FOR_JWT'; 


router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    let db = loadDb();

    if (!email || !password || password.length < 6) {
        return res.status(400).json({ message: 'Email hoặc Mật khẩu không hợp lệ.' });
    }

    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
        return res.status(409).json({ message: 'Email đã được sử dụng.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const maxId = db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) : 0;
        
        const newUser = {
            id: maxId + 1,
            email: email,
            password: hashedPassword, 
            name: email.split('@')[0],
            isAdmin: false,
            createdAt: new Date().toISOString()
        };

        db.users.push(newUser);
        saveDb(db);
        
        const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ 
            message: 'Đăng ký thành công!',
            token: token,
            userId: newUser.id,
        });

    } catch (err) {
        res.status(500).json({ message: 'Lỗi server. Không thể đăng ký.' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let db = loadDb();

    if (!email || !password) {
        return res.status(400).json({ message: 'Vui lòng cung cấp Email và Mật khẩu.' });
    }

    const user = db.users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ message: 'Sai Email hoặc Mật khẩu.' });
    }

    let isMatch = false;

   
    if (user.password && user.password.startsWith('$')) {
        isMatch = await bcrypt.compare(password, user.password);
    } else if (user.password) {
      
        isMatch = (password === user.password);
    }
    
    if (!isMatch) {
        return res.status(401).json({ message: 'Sai Email hoặc Mật khẩu.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ 
        message: 'Đăng nhập thành công!',
        token: token,
        userId: user.id,
        email: user.email 
    });
});

module.exports = router;