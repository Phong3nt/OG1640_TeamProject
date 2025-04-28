//Dùng cho staff dashboard 
const User = require('../models/User');
const Blog = require('../models/Blog');
const Allocation = require('../models/TutorAllocation'); 

exports.getDashboardStats = async (req, res) => {
    try {
        const [userCount, tutorCount, studentCount, blogCount, allocationCount] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'tutor' }),
            User.countDocuments({ role: 'student' }),
            Blog.countDocuments(),
            Allocation.countDocuments() 
        ]);

        res.status(200).json({
            userCount,
            tutorCount,
            studentCount,
            blogCount,
            allocationCount, 
        });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Lỗi server khi lấy số liệu thống kê." });
    }
};