// services/dashboardService.js
const User = require('../models/User');
const Message = require('../models/Message');
const Meeting = require('../models/Meeting');
const File = require('../models/File');
const Blog = require('../models/Blog');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const TutorAllocation = require('../models/TutorAllocation');
const Recording = require('../models/Recording');
const Conversation = require('../models/Conversation');

// Lấy dữ liệu tổng quan cho dashboard
exports.getDashboardData = async () => {
  const totalUsers = await User.countDocuments();
  const totalMessages = await Message.countDocuments();
  const totalMeetings = await Meeting.countDocuments();
  const totalFiles = await File.countDocuments();
  const totalBlogs = await Blog.countDocuments();
  const totalPosts = await Post.countDocuments();
  const totalComments = await Comment.countDocuments();
  const totalTutorAllocations = await TutorAllocation.countDocuments();
  const totalRecordings = await Recording.countDocuments();
  const totalConversations = await Conversation.countDocuments();

  return {
    totalUsers,
    totalMessages,
    totalMeetings,
    totalFiles,
    totalBlogs,
    totalPosts,
    totalComments,
    totalTutorAllocations,
    totalRecordings,
    totalConversations
  };
};
