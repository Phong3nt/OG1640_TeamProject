const Allocation = require('../models/TutorAllocation');
const User = require('../models/User'); 
const mongoose = require('mongoose');

/**
 * @description Tạo phân bổ mới (Staff only)
 * @route POST /api/allocations
 * @access Private/Staff
 */
exports.createAllocation = async (req, res) => {
    const { studentIds, tutorId, duration } = req.body;
    const staffId = req.user?.id; // Lấy từ middleware

    if (!staffId) {
        return res.status(401).json({ message: 'Yêu cầu xác thực Staff.' });
    }
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
        return res.status(400).json({ message: 'Vui lòng cung cấp danh sách ID Sinh viên hợp lệ (studentIds).' });
    }
    if (!tutorId || !mongoose.Types.ObjectId.isValid(tutorId)) {
        return res.status(400).json({ message: 'Vui lòng cung cấp Tutor ID hợp lệ.' });
    }

    // --- Validate Duration ---
    const durationValue = parseInt(duration, 10);
    if (isNaN(durationValue) || durationValue <= 0 /* || ![1, 2, 3].includes(durationValue) */) {
        return res.status(400).json({ message: 'Vui lòng cung cấp thời gian khóa học hợp lệ (số tháng > 0).' });
    }

    // --- Kiểm tra Tutor ---
    let tutor;
    try {
         tutor = await User.findOne({ _id: tutorId, role: 'tutor' });
         if (!tutor) {
            return res.status(404).json({ message: `Không tìm thấy Tutor với ID: ${tutorId}` });
        }
    } catch(err) {
         console.error("Lỗi tìm kiếm Tutor:", err);
         return res.status(500).json({ message: 'Lỗi server khi kiểm tra Tutor.' });
    }

    const results = [];
    const errors = [];
    try {
        for (const studentId of studentIds) {
            if (!mongoose.Types.ObjectId.isValid(studentId)) {
                errors.push({ studentId, message: 'ID không hợp lệ.' }); continue;
            }
            if (studentId === tutorId) {
                 errors.push({ studentId, message: 'Không thể phân bổ gia sư cho chính họ.'}); continue;
            }
            const student = await User.findOne({ _id: studentId, role: 'student' });
            if (!student) {
                errors.push({ studentId, message: 'Không tìm thấy Student.' }); continue;
            }

            try {
                await Allocation.updateMany(
                    { student: studentId, status: 'active' },
                    { $set: { status: 'inactive' } }
                );

                const newAllocation = new Allocation({
                    student: studentId,
                    tutor: tutorId,
                    allocatedBy: staffId,
                    durationMonths: durationValue, // <--- Lưu duration đã parse
                    status: 'active'
                });
                const savedAllocation = await newAllocation.save();

                 const populated = await savedAllocation.populate([
                    { path: 'student', select: 'fullName email _id' },
                    { path: 'tutor', select: 'fullName email _id' },
                    { path: 'allocatedBy', select: 'fullName email _id' }
                 ]).then(doc => doc.toObject());
                 populated.durationMonths = savedAllocation.durationMonths;
                 populated.allocationDate = savedAllocation.allocationDate; // Đảm bảo có cả ngày tạo

                results.push(populated);
                console.log(`Phân bổ thành công student ${studentId} cho tutor ${tutorId} với thời hạn ${durationValue} tháng`);

            } catch (allocError) {
                 console.error(`Lỗi xử lý phân bổ cho student ${studentId}:`, allocError);
                 errors.push({ studentId, message: allocError.message || 'Lỗi khi xử lý phân bổ.' });
            }
        } 

        if (errors.length > 0 && results.length === 0) {
             return res.status(400).json({ message: 'Phân bổ thất bại cho tất cả sinh viên.', errors });
        } else if (errors.length > 0) {
             return res.status(207).json({ message: 'Phân bổ hoàn tất với một số lỗi.', successfulAllocations: results, failedAllocations: errors });
        } else {
            return res.status(201).json({ message: `Phân bổ thành công cho ${results.length} sinh viên.`, allocations: results });
        }

    } catch (error) {
        console.error("Lỗi chung trong createAllocation:", error);
        res.status(500).json({ message: 'Lỗi server khi thực hiện phân bổ.', error: error.message });
    }
};

/**
 * @description Lấy danh sách allocations (Staff only, có thể mở rộng)
 * @route GET /api/allocations
 * @access Private/Staff
 */
exports.getAllocations = async (req, res) => {
    try {

        const filter = {};
        if (req.query.status) {
 
             if (['active', 'inactive'].includes(req.query.status)) {
                 filter.status = req.query.status;
             } else {
                 return res.status(400).json({ message: "Giá trị status không hợp lệ (chỉ chấp nhận 'active' hoặc 'inactive')." });
             }
        }
      

        if (req.query.studentId && mongoose.Types.ObjectId.isValid(req.query.studentId)) {
            filter.student = req.query.studentId;
        }
        if (req.query.tutorId && mongoose.Types.ObjectId.isValid(req.query.tutorId)) {
            filter.tutor = req.query.tutorId;
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const sort = {};
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        } else {
            sort.createdAt = -1; // Mặc định sort mới nhất trước
        }

        const allocations = await Allocation.find(filter)
            .populate('student', 'fullName email') // Lấy tên, email student
            .populate('tutor', 'fullName email') // Lấy tên, email tutor
            .populate('allocatedBy', 'fullName email') // Lấy tên, email staff
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const totalAllocations = await Allocation.countDocuments(filter);
        const totalPages = Math.ceil(totalAllocations / limit);

        res.status(200).json({
            allocations,
            currentPage: page,
            totalPages,
            totalAllocations,
        });

    } catch (error) {
        console.error("Lỗi lấy allocations:", error);
        res.status(500).json({ message: 'Lỗi server khi lấy allocations.', error: error.message });
    }
};

/**
 * @description Hủy kích hoạt một allocation (Staff only)
 * @route PUT /api/allocations/:id/deactivate
 * @access Private/Staff
 */
exports.deactivateAllocation = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Allocation ID không hợp lệ.' });
    }

    try {
        const allocation = await Allocation.findByIdAndUpdate(
            id,
            { status: 'inactive' },
            { new: true } // Trả về document đã cập nhật
        ).populate('student', 'fullName').populate('tutor', 'fullName'); // Populate nếu muốn trả về thông tin

        if (!allocation) {
            return res.status(404).json({ message: `Không tìm thấy allocation với ID: ${id}` });
        }

        res.status(200).json({ message: 'Allocation đã được hủy kích hoạt.', allocation });

    } catch (error) {
        console.error("Lỗi hủy kích hoạt allocation:", error);
        res.status(500).json({ message: 'Lỗi server khi hủy kích hoạt allocation.', error: error.message });
    }
};

/**
 * @description Lấy danh sách phân công CÁ NHÂN (student hoặc tutor) đang active
 * @route GET /api/me/allocations (Ví dụ endpoint mới)
 * @access Private (Student, Tutor)
 */
exports.getMyAllocations = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        const filter = { status: 'active' }; 

        if (userRole === 'student') {
            filter.student = userId;
        } else if (userRole === 'tutor') {
            filter.tutor = userId;
        } else {
            console.log(`User role ${userRole} không phải student/tutor, không có 'my allocations'.`);
            return res.status(200).json({ allocations: [] });
        }

        console.log(`getMyAllocations: Finding allocations with filter:`, filter); 
        const allocations = await Allocation.find(filter)
            .populate('student', 'fullName email avatar')   
            .populate('tutor', 'fullName email avatar')    
            .populate('allocatedBy', 'fullName email') 
            .sort({ createdAt: -1 });            

        res.status(200).json({ allocations });

    } catch (error) {
        console.error("Lỗi khi lấy 'my allocations':", error);
        res.status(500).json({ message: 'Lỗi server khi lấy thông tin phân công của bạn.' });
    }
};

