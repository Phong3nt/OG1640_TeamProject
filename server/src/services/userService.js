// services/userService.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendConfirmationEmail, sendResetPasswordEmail } = require('./emailService');

// Register a new user
exports.register = async (userData) => {
  const { fullName, email, phone, password, role } = userData;

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error('User already exists');

  const user = await User.create({ fullName, email, phone, password, role });
  sendConfirmationEmail(user.email, user.confirmationToken);

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

  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  sendResetPasswordEmail(user.email, resetToken);

  return resetToken;
};

// Reset user password
exports.resetPassword = async (token, newPassword) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) throw new Error('Invalid token');

  user.password = newPassword;
  await user.save();
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

exports.getUsersByRole = async (role, limit = 0) => {
  if (!role) {
    throw new Error('Role is required');
  }
  const query = User.find({ role: role.toLowerCase() }).select('-password -confirmationToken');
  if (limit > 0) {
    query.limit(Number(limit));
  }
  return await query;
};
