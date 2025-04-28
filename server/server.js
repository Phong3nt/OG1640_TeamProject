const mongoose = require("mongoose");
const dotenv = require("dotenv");
//const app = require("../src/app");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const connectDB = require("./src/config/db");
const userRoutes = require("./src/routes/userRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const blogRoutes = require("./src/routes/blogRoutes");
const commentRoutes = require('./src/routes/commentRoutes');
const allocationRoutes = require('./src/routes/tutorAllocationRoutes');
const taskRoutes = require("./src/routes/taskRoutes");
const meRoutes = require('./src/routes/meRoutes'); 
const statsRoutes = require('./src/routes/statsRoutes');
const cookieParser = require("cookie-parser");


// const messageRoutes = require('./src/routes/messageRoutes');
// const meetingRoutes = require('./src/routes/meetingRoutes');
// const fileRoutes = require('./src/routes/fileRoutes');
// const postRoutes = require('./src/routes/postRoutes');
// const commentRoutes = require('./src/routes/commentRoutes');
// const recordingRoutes = require('./src/routes/recordingRoutes');
// const reportRoutes = require('./src/routes/reportRoutes');
// const dashboardRoutes = require('./src/routes/dashboardRoutes');
// const conversationRoutes = require('./src/routes/conversationRoutes');
dotenv.config();
const app = express();
connectDB();
// ✅ Fix CORS for credentials
app.use(cors({
    origin: 'http://localhost:3000',   // CHÍNH XÁC frontend origin
    credentials: true                  // Cho phép gửi cookie/token
  }));
// Cấu hình middleware
app.use(morgan("dev"));
app.use(express.json());
//app.use(express.static("public"));
//app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/api", profileRoutes); // ✅ profile routes
app.use(cookieParser()); // ủa có profile route hả có chiều m fix có mà quên merge vharddaau t dùng user chơ mấy nhở vl t pull code xuống thấy

app.use("/api/users", userRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/meetings', meetingRoutes);
// app.use('/api/files', fileRoutes);
app.use("/api", blogRoutes);
app.use('/api/allocations', allocationRoutes);
app.use("/api/tasks", taskRoutes); // <-- đăng ký routes cho tasks
app.use('/api/comments', commentRoutes);
// app.use('/api/posts', postRoutes);
// app.use('/api/recordings', recordingRoutes);
// app.use('/api/reports', reportRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/conversation', conversationRoutes);
 app.use("/api/profile", profileRoutes);
 app.use('/api/me', meRoutes);
 app.use("/uploads", express.static("uploads"));
 app.use("/api", profileRoutes); 
 app.use('/api/stats', statsRoutes);
// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
