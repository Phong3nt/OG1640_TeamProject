// controllers/profileController.js
const profileService = require('../services/profileService');

// Lấy thông tin profile của user
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy ID của user từ token
        const profile = await profileService.getUserProfile(userId);
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin profile', error });
    }
};

// Cập nhật thông tin profile của user
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updatedData = req.body;
        const updatedProfile = await profileService.updateUserProfile(userId, updatedData);
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật profile', error });
    }
};
