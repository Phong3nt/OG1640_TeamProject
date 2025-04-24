const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

exports.send = async ({ conversationId, sender, content, type, repliedTo }) => {
  const msg = await Message.create({ conversationId, sender, content, type, repliedTo });
  await Conversation.findByIdAndUpdate(conversationId,
    { lastMessage: msg._id, updatedAt: Date.now() });
  return msg.populate('sender', 'fullName avatarUrl');
};

exports.getByConversation = (conversationId, cursor, limit = 20) => {
  const query = { conversationId };
  if (cursor) query._id = { $lt: cursor };
  return Message.find(query)
                .sort({ _id: -1 })
                .limit(limit)
                .populate('sender', 'fullName avatarUrl');
};

exports.markRead = (conversationId, userId, lastSeenId) =>
  Message.updateMany({
      conversationId,
      _id: { $lte: lastSeenId },
      readBy: { $ne: userId }
    },
    { $addToSet: { readBy: userId }, status: 'read' });
