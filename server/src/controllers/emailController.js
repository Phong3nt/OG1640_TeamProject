// controllers/emailController.js  (đã rút gọn)
const { authoriseAndSend } = require('../services/mailService');
const { loadTemplate }     = require('../services/emailService');

exports.sendActivation = async (req, res, next) => {
  try {
    const sender = req.user;             // system hoặc staff
    const { toUserId, token } = req.body;

    const user = await User.findById(toUserId).lean();
    const html = loadTemplate('activateAccount.html', {
      NAME: user.fullName,
      LINK: `${process.env.CLIENT_URL}/confirm/${token}`
    });

    await authoriseAndSend({
      sender,
      toUserId,
      subject: 'Kích hoạt tài khoản eTutoring',
      html
    });
    res.json({ message: 'Sent' });
  } catch (err) { next(err); }
};
