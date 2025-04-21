const User = require("../models/User");
const mongoose = require("mongoose");

// @desc    Lấy thông tin người dùng hiện tại
// @route   GET /api/profile/me
// @access  Private
const getProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID người dùng không hợp lệ" });
    }

    const user = await User.findById(userId).select(
      "-password -confirmationToken"
    );

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Lỗi khi lấy profile:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// @desc    Cập nhật thông tin người dùng
// @route   PUT /api/profile/me
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID người dùng không hợp lệ" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const { fullName, email, phone } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : user.avatar;

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật hồ sơ thành công",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isConfirmed: user.isConfirmed,
        isBanned: user.isBanned,
      },
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật profile:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
