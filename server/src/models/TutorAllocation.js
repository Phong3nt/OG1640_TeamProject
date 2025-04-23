const mongoose = require("mongoose");

const allocationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến User model
    required: [true, 'Student ID is required.'], // Báo lỗi nếu thiếu
    index: true
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến User model
    required: [true, 'Tutor ID is required.'],
    index: true
  },
  allocatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến User model (là staff)
    required: [true, 'Allocator ID (staff) is required.'],
    index: true
  },
  allocationDate: {
    type: Date,
    default: Date.now
  },
  durationMonths: {
    type: Number,
    required: [true, 'Course duration (in months) is required.'], 
    min: [1, 'Duration must be at least 1 month.'], 
    // enum: {
    //     values: [1, 2, 3], // Chỉ cho phép 1, 2, 3 tháng
    //     message: 'Duration must be 1, 2, or 3 months.'
    // }
  },
  status: {
    type: String,
    enum: {
        values: ['active', 'inactive'],
        message: 'Status must be either active or inactive.'
    },
    default: 'active',
    required: true,
    index: true
  },

}, { timestamps: true }); 



module.exports = mongoose.model('Allocation', allocationSchema);
