const jwt = require("jsonwebtoken");

const requireSignIn = (req, res, next) => {
  let token = null;

  if (req.header("Authorization")?.startsWith("Bearer ")) {
    token = req.header("Authorization").replace("Bearer ", "");
  }

  if (!token) {
    return res.status(401).json({ message: "Truy cập bị từ chối. Token không được cung cấp." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};

module.exports = { requireSignIn };
