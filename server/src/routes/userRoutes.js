// userRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  createUser,
  getUsers,
  getUsersByRole,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { requireSignIn } = require("../middlewares/auth");

// API Đăng nhập
router.post("/adminLogin", (req, res) => {
  const { email, password } = req.body;
  // test thử
  if (email === "admin@etutoring.com" && password === "123456") {
    return res.json({ success: true, message: "Đăng nhập thành công!" });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Sai email hoặc mật khẩu" });
  }
});
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này.' });
    }
    next();
  };
};

// Route for user registration
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

/// Route for user logout
router.post("/logout", requireSignIn, logoutUser);

// Route for forgot password
router.post("/forgot-password", forgotPassword);

// Route for resetting password
router.post("/reset-password/:token", resetPassword);

// Route for create user
router.post("/create", createUser);

// Route for get all user
router.get("/all", getUsers);

//Route for get user by role
router.get("/by-role", requireSignIn, restrictTo('staff'), getUsersByRole);

// Route for get user
router.get("/:id", getUserById);


// Route for update user
router.put("/:id", updateUser);

// Route for delete user
router.delete("/:id", deleteUser);

module.exports = router;
