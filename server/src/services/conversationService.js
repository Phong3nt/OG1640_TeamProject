const Conversation = require('../models/Conversation');
const ObjectId = require('mongoose').Types.ObjectId;

exports.getOrCreate = async (userA, userB) => {
  const key = [userA, userB].sort();           // bảo đảm cùng thứ tự
  let convo = await Conversation.findOne({ participants: key });
  if (convo) return convo;

  convo = await Conversation.create({ participants: key });
  return convo;
};

exports.softDelete = async (convoId, userId) =>
  Conversation.findByIdAndUpdate(convoId,
    { $addToSet: { deletedBy: userId } },
    { new: true });
