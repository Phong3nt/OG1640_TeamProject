const nodemailer = require('nodemailer');

// Khởi tạo transporter với Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Mail hệ thống
    pass: process.env.EMAIL_PASS, // App password của Gmail
  },
});

// Gửi email xác nhận
exports.sendConfirmationEmail = (to, token) => {
  const mailOptions = {
    from: '"eTutoring" <' + process.env.EMAIL_USER + '>',
    to,
    subject: 'Xác nhận tài khoản eTutoring',
    html: `<p>Vui lòng xác nhận tài khoản của bạn bằng cách click vào link bên dưới:</p>
           <a href="${process.env.CLIENT_URL}/confirm/${token}">Xác nhận tài khoản</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Lỗi gửi mail:', error);
    } else {
      console.log('Email xác nhận đã gửi:', info.response);
    }
  });
};

// Gửi email reset mật khẩu
exports.sendResetPasswordEmail = (to, token) => {
  const mailOptions = {
    from: `"eTutoring" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Khôi phục mật khẩu eTutoring',
    html: `<p>Bạn đã yêu cầu đặt lại mật khẩu, vui lòng nhấn vào link sau để đặt lại:</p>
           <a href="${process.env.CLIENT_URL}/reset-password/${token}">Đặt lại mật khẩu</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Lỗi gửi mail:', error);
    } else {
      console.log('Email đặt lại mật khẩu đã gửi:', info.response);
    }
  });
};
