const Message = require("../models/Message.js");
const User = require("../models/User.js");

exports.sendMessage = async (io, socket, data) => {
  try {
    const { senderId, receiverId, content, fileUrl } = data;

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
      fileUrl,
      timestamp: new Date(),
    });

    await message.save();

    // Gửi real-time đến người nhận
    io.to(receiverId).emit("newMessage", message);

    // Cập nhật danh sách chat gần đây
    await User.updateOne(
      { _id: senderId },
      { $addToSet: { recentChats: receiverId } }
    );

    await User.updateOne(
      { _id: receiverId },
      { $addToSet: { recentChats: senderId } }
    );
  } catch (err) {
    console.error("Lỗi gửi tin nhắn:", err);
  }
};
