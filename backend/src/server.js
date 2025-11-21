const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const authRoutes = require('backend/authRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', authRoutes);



app.listen(PORT, () => {
    console.log(`\n========================================================`);
    console.log(`    BACKEND API ĐANG CHẠY`);
    console.log(`    Địa chỉ: http://localhost:${PORT}`);
    console.log(`   - Auth: POST http://localhost:${PORT}/api/register`);
    console.log(`========================================================\n`);
});