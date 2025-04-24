// middlewares/auth.js  (GIỮ NGUYÊN)
const jwt  = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Truy cập bị từ chối' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).lean();
    if (!req.user) return res.status(401).json({ message: 'Invalid user' });
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token không hợp lệ' });
  }
};
