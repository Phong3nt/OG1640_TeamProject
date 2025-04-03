// userRoutes.js
const express = require('express');
const router = express.Router();

const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword } = require('../controllers/userController');
const { createUser, getUsers , getUserById, updateUser, deleteUser } = require('../controllers/userController');
const auth = require('../middlewares/auth');

// API Đăng nhập
router.post('/adminLogin', (req, res) => {
    const { email, password } = req.body;
    // test thử
    if (email === 'admin@etutoring.com' && password === '123456') {
        return res.json({ success: true, message: 'Đăng nhập thành công!' });
    } else {
        return res.status(401).json({ success: false, message: 'Sai email hoặc mật khẩu' });
    }
});

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route for user logout
router.post('/logout',auth, logoutUser);

// Route for forgot password
router.post('/forgot-password', forgotPassword);

// Route for resetting password
router.post('/reset-password/:token', resetPassword);

// Route for create user
router.post('/create', createUser);

// Route for get all user
router.get('/all', getUsers );

// Route for get user
router.get('/:id', getUserById);

// Route for update user
router.put('/:id', updateUser);

// Route for delete user
router.delete('/:id', deleteUser);

module.exports = router;
