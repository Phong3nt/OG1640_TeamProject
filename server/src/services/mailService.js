const { transporter } = require('./emailService');
const TutorAllocation = require('../models/TutorAllocation');
const User = require('../models/User');

/* ---------- rule helper ---------- */
async function canSend(sender, receiver) {
  if (sender.role === 'staff')  return receiver.role !== 'staff';   
  return false;               // tutor & student không bao giờ gửi
}

/* ---------- main send ---------- */
async function send({ sender, toUserId, subject, html, text }) {
  // 1. lấy người nhận
  const receiver = await User.findById(toUserId).lean();
  if (!receiver) throw Object.assign(new Error('Receiver not found'), { statusCode: 404 });

  // 2. rule
  if (!(await canSend(sender, receiver)))
    throw Object.assign(new Error('Forbidden'), { statusCode: 403 });

  // 3. gửi
  return transporter.sendMail({
    from: `"no‑reply eTutoring" <${process.env.EMAIL_USER}>`,
    to:   receiver.email,
    subject,
    text,
    html
  });
}

module.exports = { send };

async function sendSystem(toEmail, subject, html) {
    return transporter.sendMail({
      from: `"no‑reply eTutoring" <${process.env.EMAIL_USER}>`,
      to:   toEmail,
      subject,
      html
    });
  }
  
  module.exports = { sendSystem };