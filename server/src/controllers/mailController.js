const Mail  = require('../services/mailService');
const { loadTemplate } = require('../services/emailService');
const User  = require('../models/User');

// 1. Kích hoạt tài khoản
exports.sendActivation = async (req, res, next) => {
  try {
    const { toUserId, token } = req.body;
    const user = await User.findById(toUserId).lean();

    const html = loadTemplate('activateAccount.html', {
      NAME:user.fullName,
      LINK:`${process.env.CLIENT_URL}/confirm/${token}`
    });

    await Mail.send({
      sender: req.user,
      toUserId,
      subject: 'Kích hoạt tài khoản eTutoring',
      html
    });
    res.json({ message: 'Sent' });
  } catch (e) { next(e); }
};

// 2. Gửi mật khẩu mới
exports.sendNewPassword = async (req, res, next) => {
  try {
    const { toUserId, password } = req.body;
    const user = await User.findById(toUserId).lean();

    const html = loadTemplate('newPassword.html', {
      NAME: user.fullName,
      PASSWORD: password
    });

    await Mail.send({
      sender: req.user,
      toUserId,
      subject: 'Mật khẩu mới cho tài khoản eTutoring',
      html
    });
    res.json({ message: 'Sent' });
  } catch (e) { next(e); }
};

// 3. Thông báo đổi mật khẩu
exports.sendPasswordChanged = async (req, res, next) => {
  try {
    const { toUserId } = req.body;
    const user = await User.findById(toUserId).lean();

    const html = loadTemplate('passwordChanged.html', {
      NAME: user.fullName,
      TIME: new Date().toLocaleString('vi-VN')
    });

    await Mail.send({
      sender: req.user,
      toUserId,
      subject: 'Bạn đã đổi mật khẩu thành công',
      html
    });
    res.json({ message: 'Sent' });
  } catch (e) { next(e); }
};
