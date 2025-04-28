const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  meetingRoom: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: Number, default: 60 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Meeting", meetingSchema);
