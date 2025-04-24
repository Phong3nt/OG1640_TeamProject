const messageService = require('../services/messageService');

exports.send = async (req, res) => {
  const { conversationId, content, type, repliedTo } = req.body;
  const msg = await messageService.send({
    conversationId, sender: req.user._id, content, type, repliedTo
  });
  // socket.emit có thể đặt tại đây
  res.json(msg);
};

exports.fetch = async (req, res) => {
  const { cursor, limit } = req.query;
  const msgs = await messageService.getByConversation(
    req.conversation._id, cursor, parseInt(limit) || 20);
  res.json(msgs);
};

exports.markRead = async (req, res) => {
  const { lastSeenId } = req.body;
  await messageService.markRead(req.conversation._id, req.user._id, lastSeenId);
  res.json({ msg: 'ok' });
};
