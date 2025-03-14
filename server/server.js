require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');
const blogRoutes = require('./src/routes/blogRoutes');
// const messageRoutes = require('./src/routes/messageRoutes');
// const meetingRoutes = require('./src/routes/meetingRoutes');
// const fileRoutes = require('./src/routes/fileRoutes');
// const postRoutes = require('./src/routes/postRoutes');
// const commentRoutes = require('./src/routes/commentRoutes');
// const tutorAllocationRoutes = require('./src/routes/tutorAllocationRoutes');
// const recordingRoutes = require('./src/routes/recordingRoutes');
// const reportRoutes = require('./src/routes/reportRoutes');
// const dashboardRoutes = require('./src/routes/dashboardRoutes');
// const conversationRoutes = require('./src/routes/conversationRoutes');
// const profileRoutes = require('./src/routes/profileRoutes');
const app = express();
connectDB();

// Cấu hình middleware
app.use(cors()); // Cho phép frontend React truy cập
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


 

 app.use('/api/users', userRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/meetings', meetingRoutes);
// app.use('/api/files', fileRoutes);
 app.use('/api/blogs', blogRoutes);
// app.use('/api/posts', postRoutes);
// app.use('/api/comments', commentRoutes);
// app.use('/api/tutor-allocations', tutorAllocationRoutes);
// app.use('/api/recordings', recordingRoutes);
// app.use('/api/reports', reportRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/conversation', conversationRoutes);
// app.use('/api/profile', profileRoutes);

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
