
// userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserService = require('../services/userService');

// Register a new user
exports.registerUser = async (req, res) => {
    try {
      await UserService.register(req.body);
      res.status(201).json({ message: 'Đăng ký thành công – kiểm tra email để kích hoạt' });
    } catch (e) { res.status(400).json({ message: e.message }); }
  };

  exports.confirmEmail = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).send('User not found');
  
      if (user.isConfirmed) return res.send('Tài khoản đã kích hoạt');
  
      user.isConfirmed = true;
      await user.save();
      res.send('Kích hoạt thành công – bạn có thể đăng nhập');
    } catch (e) {
      res.status(500).send('Server error');
    }
  };
// Login user and return JWT
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // Kiểm tra email & mật khẩu
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Kiểm tra email đã xác nhận chưa
        if (!user.isConfirmed) {
            return res.status(403).json({ message: "Please confirm your email first" });
        }

        // Tạo token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Trả về token + thông tin user
        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.fullName,
                email: user.email,
                role: user.role
            },
            message: "Login successful"
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// Logout user
exports.logoutUser = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

// Forgot password
exports.forgotPassword = async (req, res) => {
    try {
      await UserService.requestPasswordReset(req.body.email);
    } finally {
      res.json({ message: 'Nếu email tồn tại, mật khẩu mới đã được gửi' });
    }
  };

// Reset password
exports.changePassword = async (req, res) => {
    try {
      await UserService.changePassword(req.user._id, req.body.newPassword);
      res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (e) { res.status(400).json({ message: e.message }); }
  };

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await UserService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const user = await UserService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await UserService.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};