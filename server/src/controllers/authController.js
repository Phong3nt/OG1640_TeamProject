// [Feature] Create Auth Controller - v1
// Task: Handle authentication processes (JWT, OAuth, password hashing).
// Assigned to: Name2

// TODO: Implement user authentication with JWT
// TODO: Implement refresh token mechanism
// TODO: Implement password reset
// TODO: Implement email verification
const { comparePassword, hashPassword } = require("../helpers/authHelper.js");
const userModel = require("../models/User.js");
const JWT = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).send({
        success: false,
        message: "Missing required fields",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User already registered",
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      fullName,
      email,
      phone,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};
// Login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email not registered",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};
// Forgot password
const forgotPasswordController = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }
    if (!newPassword) {
      return res.status(400).send({
        success: false,
        message: "New password is required",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in forgot password",
      error,
    });
  }
};

//get user profile
const getProfileController = async (req, res) => {
  try {
    // Lấy thông tin user từ request (đã được xác thực qua middleware)
    const user = await userModel
      .findById(req.user._id)
      .select("-password -confirmationToken -createdAt -updatedAt -__v");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Profile retrieved successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        isConfirmed: user.isConfirmed,
        isBanned: user.isBanned,
      },
    });
  } catch (error) {
    console.error("Error in getProfileController:", error);
    res.status(500).send({
      success: false,
      message: "Error retrieving profile",
      error: error.message,
    });
  }
};

//update user profile
const updateProfileController = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    const user = await userModel.findById(req.user._id);

    if (password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        fullName: fullName || user.fullName,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating profile",
      error,
    });
  }
};
module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
  getProfileController,
  updateProfileController,
};
