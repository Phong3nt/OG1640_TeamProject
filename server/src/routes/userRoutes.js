const express = require('express');
const router = express.Router();

// API Đăng nhập
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    // test thử
    if (email === 'admin@etutoring.com' && password === '123456') {
        return res.json({ success: true, message: 'Đăng nhập thành công!' });
    } else {
        return res.status(401).json({ success: false, message: 'Sai email hoặc mật khẩu' });
    }
});

module.exports = router;
