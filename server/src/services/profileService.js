// services/profileService.js
const User = require('../models/User');

// Lấy thông tin user từ database
exports.getUserProfile = async (userId) => {
    return await User.findById(userId).select('-password'); // Không trả về password
};

// Cập nhật thông tin user trong database
exports.updateUserProfile = async (userId, updatedData) => {
    return await User.findByIdAndUpdate(userId, updatedData, { new: true }).select('-password');
};
