const conversationService = require('../services/conversationService');

exports.create = async (req, res) => {
  const { partnerId } = req.body;
  const convo = await conversationService.getOrCreate(req.user._id, partnerId);
  res.json(convo);
};

exports.list = async (req, res) => {
  const convos = await require('../models/Conversation')
      .find({ participants: req.user._id, deletedBy: { $ne: req.user._id } })
      .populate('lastMessage')
      .sort({ updatedAt: -1 });
  res.json(convos);
};

exports.remove = async (req, res) => {
  const convo = await conversationService.softDelete(req.params.id, req.user._id);
  res.json(convo);
};
