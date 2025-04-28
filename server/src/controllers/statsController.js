const User = require('../models/User');
const Blog = require('../models/Blog');
const Allocation = require('../models/TutorAllocation'); 
const Task = require('../models/Task')

exports.getDashboardStats = async (req, res) => {
    try {
        const [userCount, tutorCount, studentCount, staffCount, blogCount, allocationCount] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'tutor' }),
            User.countDocuments({ role: 'student' }),
            User.countDocuments({ role: 'staff' }),
            Blog.countDocuments(),
            Allocation.countDocuments() 
        ]);

        res.status(200).json({
            userCount,
            tutorCount,
            studentCount,
            staffCount,
            blogCount,
            allocationCount, 
        });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Lỗi server khi lấy số liệu thống kê." });
    }
};
exports.getTasksPerTutor = async (req, res) => {
    try {
        console.log("Fetching tasks per tutor statistics...");

        
        const tasksPerTutor = await Task.aggregate([
            {
                $group: {
                    _id: "$tutorId", // Trường ID của tutor trong Task model
                    assignedTaskCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "users", 
                    localField: "_id", 
                    foreignField: "_id", 
                    as: "tutorInfo"
                }
            },
            {
                $unwind: { path: "$tutorInfo", preserveNullAndEmptyArrays: true } 
            },
             {
                 $match: {
                     "tutorInfo.role": "tutor"
                 }
             },
            {
                $project: {
                    _id: 0, 
                    tutorId: "$_id",
                    tutorName: "$tutorInfo.fullName", 
                    assignedTaskCount: 1
                }
            },
            {
                $sort: { assignedTaskCount: -1 } // Sắp xếp giảm dần theo số task
            }
        ]);

        console.log("Tasks per tutor data calculated:", tasksPerTutor);

        res.status(200).json(tasksPerTutor);

    } catch (error) {
        console.error("Error fetching tasks per tutor stats:", error);
        res.status(500).json({ message: "Lỗi server khi lấy thống kê task theo tutor.", error: error.message });
    }
};