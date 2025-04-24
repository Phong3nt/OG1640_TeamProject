require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS      // APP PASSWORD
  }
});

const loadTemplate = (name, replacements={}) => {
  const file = path.join(__dirname, '../templates', name);
  let html = fs.readFileSync(file, 'utf-8');
  for (const key in replacements) {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
  }
  return html;
};

module.exports = { transporter, loadTemplate };
