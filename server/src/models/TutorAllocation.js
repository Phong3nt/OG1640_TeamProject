const mongoose = require('mongoose');

const tutorAllocationSchema = new mongoose.Schema({
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  isCurrent: { type: Boolean, default: true }
}, { timestamps: true });

tutorAllocationSchema.index({ student: 1, isCurrent: 1 });
tutorAllocationSchema.index({ tutor: 1, isCurrent: 1 });
module.exports = mongoose.model('TutorAllocation', tutorAllocationSchema);
