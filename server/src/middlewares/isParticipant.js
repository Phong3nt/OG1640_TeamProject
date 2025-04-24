const Conversation = require('../models/Conversation');

module.exports = async (req, res, next) => {
  const { conversationId } = req.params;
  const convo = await Conversation.findById(conversationId);
  if (!convo || !convo.participants.includes(req.user._id))
    return res.status(403).json({ msg: 'Not your conversation' });
  req.conversation = convo;
  next();
};
