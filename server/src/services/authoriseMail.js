const TutorAllocation = require('../models/TutorAllocation');

async function canSend(sender, receiver) {
  // system luôn OK
  if (sender.role === 'system') return true;

  // staff -> không được gửi cho staff khác
  if (sender.role === 'staff') return receiver.role !== 'staff';

  // tutor / student
  if (['tutor', 'student'].includes(sender.role)) {
    if (receiver.role === 'system' || receiver.role === 'staff') return true;

    // chỉ được gửi khi có allocation active giữa hai bên
    const alloc = await TutorAllocation.findOne({
      isCurrent: true,
      status: 'active',
      $or: [
        { tutor: sender._id,   student: receiver._id },
        { tutor: receiver._id, student: sender._id }
      ]
    }).lean();
    return !!alloc;
  }

  return false;
}

module.exports = { canSend };
