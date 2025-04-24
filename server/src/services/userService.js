const User  = require('../models/User');
const bcrypt= require('bcryptjs');
const jwt   = require('jsonwebtoken');
const { sendSystem }  = require('./mailService');
const { loadTemplate }= require('./emailService');

// Register a new user
exports.register = async ({ fullName, email, phone, password, role }) => {
    if (await User.findOne({ email })) throw new Error('Email đã tồn tại');
  
    const user = await User.create({ fullName, email, phone, password, role });
  
    // gửi mail kích hoạt
    const html = loadTemplate('activateAccount.html', {
      NAME: fullName,
      LINK: `${process.env.CLIENT_URL}/confirm/${user._id}`     // ví dụ xác nhận đơn giản
    });
    await sendSystem(email, 'Kích hoạt tài khoản eTutoring', html);
  
    return user;
  };

// Authenticate user and generate JWT
exports.authenticate = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) throw new Error('Invalid email or password');

  if (!user.isConfirmed) throw new Error('Please confirm your email first');

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

// Request password reset
exports.requestPasswordReset = async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
  
    // sinh mật khẩu tạm
    const tempPass = Math.random().toString(36).slice(-10);
    user.password  = tempPass;               // bcrypt hash qua middleware model
    await user.save();
  
    const html = loadTemplate('newPassword.html', {
      NAME: user.fullName,
      PASSWORD: tempPass
    });
    await sendSystem(email, 'Mật khẩu mới cho tài khoản eTutoring', html);
  };

// Reset user password
exports.changePassword = async (userId, newPass) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
  
    user.password = newPass;
    await user.save();
  
    const html = loadTemplate('passwordChanged.html', {
      NAME: user.fullName,
      TIME: new Date().toLocaleString('vi-VN')
    });
    await sendSystem(user.email, 'Bạn đã đổi mật khẩu thành công', html);
  };

// Create a new user
exports.createUser = async (userData) => {
    const userExists = await User.findOne({ email: userData.email });
    if (userExists) throw new Error('User already exists');
    return await User.create(userData);
  };
  
  // Get all users
  exports.getUsers = async () => {
    return await User.find();
  };
  
  // Get a user by ID
  exports.getUserById = async (id) => {
    return await User.findById(id);
  };
  
  // Update a user
  exports.updateUser = async (id, userData) => {
    return await User.findByIdAndUpdate(id, userData, { new: true, runValidators: true });
  };
  
  // Delete a user
  exports.deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
  };
  
