const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    validate: {
      validator: function(v) {
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return emailRegex.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        const phoneRegex = /^[0-9]{10,15}$/; // Simplified phone validation
        return phoneRegex.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    required: true,
    enum: ['student', 'tutor', 'staff','admin','system'],
    index: true,
    default: 'student'
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  confirmationToken: {
    type: String
  },
  isBanned: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Hash password before saving the user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create and export the User model
module.exports = mongoose.model('User', userSchema);
