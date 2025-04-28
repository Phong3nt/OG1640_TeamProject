import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './AllocationPage.css';
import Select from 'react-select'; // Giữ nguyên import thư viện

// --- Axios Instance Configuration (Giữ nguyên cấu hình) ---
const api = axios.create({ baseURL: 'http://localhost:5000/api' });
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Key 'token'
    if (token) {
        config.headers.Authorization = token; // No Bearer prefix
    }
    return config;
});
// --- End Axios Instance Configuration ---

// --- Helper Functions (Giữ nguyên) ---
const calculateEndDate = (startDateString, durationMonths) => {
    if (!startDateString || !durationMonths || isNaN(parseInt(durationMonths))) {
        return null;
    }
    try {
        const startDate = new Date(startDateString);
        if (isNaN(startDate.getTime())) return null;
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + parseInt(durationMonths));
        return endDate;
    } catch (e) {
        console.error("Error calculating end date:", e);
        return null;
    }
};

const formatDate = (date) => {
    if (!date) return 'N/A';
    if (typeof date === 'string') date = new Date(date);
    if (!(date instanceof Date) || isNaN(date.getTime())) return 'Invalid Date';
    // Format date as DD/MM/YYYY (Vietnamese locale still used for consistency, adjust if needed)
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};
// --- End Helper Functions ---


// --- Main Component ---
export default function AllocationPage() {
    // State variables (tên tiếng Anh)
    const [students, setStudents] = useState([]);
    const [tutors, setTutors] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState(null);
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [selectedTutorId, setSelectedTutorId] = useState('');
    const [selectedDuration, setSelectedDuration] = useState(''); // State mới
    const [isAllocating, setIsAllocating] = useState(false);
    const [allocationMessage, setAllocationMessage] = useState({ type: '', text: '' });
    const [allocations, setAllocations] = useState([]);
    const [allocationsLoading, setAllocationsLoading] = useState(false);
    const [allocationsError, setAllocationsError] = useState(null);

    // --- Fetch Users ---
    const fetchUsers = useCallback(async (role, setter, errorSetter) => {
        setUsersLoading(true);
        errorSetter(null);
        try {
            const response = await api.get(`/users/by-role?role=${role}&limit=1000`);
            setter(response.data || []);
            ;
        } catch (err) {
            console.error(`Failed to fetch ${role}s:`, err);
            errorSetter(`Could not load ${role} list.`);
        } finally {
            setUsersLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers('student', setStudents, setUsersError);
        fetchUsers('tutor', setTutors, setUsersError);
    }, [fetchUsers]);

    // --- Fetch Allocations ---
    const fetchAllocations = useCallback(async () => {
        setAllocationsLoading(true);
        setAllocationsError(null);
        try {
            const params = { status: 'active', limit: 20 };
            const response = await api.get('/allocations', { params });
            console.log('Fetched allocations:', response.data);
            setAllocations(response.data.allocations || []);
        } catch (err) {
            console.error("Failed to fetch allocations:", err);
            setAllocationsError(err.response?.data?.message || 'Could not load allocation list.'); // Thông báo lỗi tiếng Anh
        } finally {
            setAllocationsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllocations();
    }, [fetchAllocations]);

    // --- Prepare options for react-select ---
    const studentOptions = students.map(student => ({
        value: student._id,
        label: `${student.fullName} (${student.email})`
    }));

    const handleStudentSelectChange = (selectedOptions) => {
        setSelectedStudentIds(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    // --- Handle Allocation Submit ---
    const handleAllocate = async () => {
        if (selectedStudentIds.length === 0 || !selectedTutorId || !selectedDuration) {
            setAllocationMessage({ type: 'error', text: 'Please select Student(s), Tutor, and Course Duration.' }); // Thông báo lỗi tiếng Anh
            return;
        }

        setIsAllocating(true);
        setAllocationMessage({ type: '', text: '' });

        try {
            const payload = {
                studentIds: selectedStudentIds,
                tutorId: selectedTutorId,
                duration: parseInt(selectedDuration, 10)
            };

            console.log("Submitting allocation with payload:", payload);
            const response = await api.post('/allocations', payload);

            console.log('Allocation successful:', response.data);
            setAllocationMessage({ type: 'success', text: 'Allocation successful!' }); // Thông báo lỗi tiếng Anh

            setSelectedStudentIds([]);
            setSelectedTutorId('');
            setSelectedDuration('');

            fetchAllocations();

        } catch (err) {
            console.error("Allocation failed:", err);
            setAllocationMessage({ type: 'error', text: err.response?.data?.message || 'Allocation failed. Please try again.' }); // Thông báo lỗi tiếng Anh
        } finally {
            setIsAllocating(false);
        }
    };

    // --- Handle Deactivate ---
    const handleDeactivate = async (allocationId) => {
        if (!window.confirm('Are you sure you want to deactivate this allocation?')) {
            return;
        }
        setAllocationMessage({ type: '', text: '' });
        try {
            await api.put(`/allocations/${allocationId}/deactivate`);
            setAllocationMessage({ type: 'success', text: 'Allocation deactivated successfully!' }); // Thông báo lỗi tiếng Anh
            fetchAllocations();
        } catch (err) {
            console.error("Deactivation failed:", err);
            setAllocationMessage({ type: 'error', text: err.response?.data?.message || 'Deactivation failed.' }); // Thông báo lỗi tiếng Anh
        }
    };

    return (
        <div className="allocation-page-container">
            <h1>Tutor Allocation</h1>

            {usersLoading && <p>Loading user lists...</p>}
            {usersError && <p className="error-message">{usersError}</p>}

            {!usersLoading && !usersError && (
                <div className="allocation-controls">
                    <div className="selector-group">
                        <label htmlFor="student-select">Select Student(s):</label>
                        <Select
                            id="student-select"
                            isMulti
                            options={studentOptions}
                            value={studentOptions.filter(option => selectedStudentIds.includes(option.value))}
                            onChange={handleStudentSelectChange}
                            placeholder="-- Find and select Students --"
                            isLoading={usersLoading}
                            noOptionsMessage={() => 'No students found'}
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>

                    {/* Tutor Selector */}
                    <div className="selector-group">
                        <label htmlFor="tutor-select">Select Tutor:</label>
                        <select
                            id="tutor-select"
                            value={selectedTutorId}
                            onChange={(e) => setSelectedTutorId(e.target.value)}
                            disabled={usersLoading || isAllocating}
                        >
                            <option value="">-- Select Tutor --</option>
                            {tutors.map(tutor => (
                                <option key={tutor._id} value={tutor._id}>
                                    {tutor.fullName} ({tutor.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Duration Selector */}
                    <div className="selector-group">
                        <label htmlFor="duration-select">Course Duration:</label>
                        <select
                            id="duration-select"
                            value={selectedDuration}
                            onChange={(e) => setSelectedDuration(e.target.value)}
                            disabled={isAllocating}
                        >
                            <option value="">-- Select Duration --</option>
                            <option value="1">1 Month</option>
                            <option value="2">2 Months</option>
                            <option value="3">3 Months</option>
                        </select>
                    </div>

                    {/* Allocate Button */}
                    <button
                        className="allocate-button"
                        onClick={handleAllocate}
                        disabled={selectedStudentIds.length === 0 || !selectedTutorId || !selectedDuration || isAllocating}
                    >
                        {isAllocating ? 'Processing...' : 'Allocate'}
                    </button>

                    {/* Allocation Message */}
                    {allocationMessage.text && (
                        <p className={`allocation-message ${allocationMessage.type}`}>
                            {allocationMessage.text}
                        </p>
                    )}
                </div>
            )}

            {/* Allocation Table Section */}
            <div className="allocation-table-section">
                <h2>Current Allocations (Active)</h2>
                {allocationsLoading && <p>Loading allocation list...</p>}
                {allocationsError && <p className="error-message">{allocationsError}</p>}
                {!allocationsLoading && !allocationsError && (
                    <table className="allocation-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Tutor</th>
                                <th>Allocated By</th>
                                <th>Allocation Date</th>
                                <th>Duration (Months)</th>
                                <th>End Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allocations.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center' }}>No allocation data found.</td>
                                </tr>
                            ) : (
                                allocations.map(allocation => {
                                    console.log("Rendering Allocation Object:", JSON.stringify(allocation, null, 2));
                                    const endDate = calculateEndDate(allocation.allocationDate, allocation.durationMonths);
                                    const isOverdue = endDate && new Date() > endDate;
                                    const displayStatus = allocation.status === 'active' && isOverdue ? 'overdue' : (allocation.status === 'active' ? 'active' : 'inactive');
                                    const statusClassName = allocation.status === 'active' && isOverdue ? 'status-overdue' : `status-${allocation.status}`;
                                    return (
                                        <tr key={allocation._id}>
                                            <td>{allocation.student?.fullName || 'N/A'}</td>
                                            <td>{allocation.tutor?.fullName || 'N/A'}</td>
                                            <td>{allocation.allocatedBy?.fullName || 'N/A'}</td>
                                            <td>{formatDate(allocation.allocationDate)}</td>
                                            <td>{allocation.durationMonths ? `${allocation.durationMonths} months` : 'N/A'}</td>
                                            <td>{formatDate(endDate)}</td>
                                            <td>
                                                {/* console.log("Applying status class:", statusClassName); */}
                                                <span className={`status-badge ${statusClassName}`}>
                                                    {displayStatus}
                                                </span>
                                            </td>
                                            <td>
                                                {/* Nút hủy vẫn dựa vào status gốc từ DB */}
                                                {allocation.status === 'active' && !isOverdue && ( // Có thể ẩn nút hủy nếu quá hạn
                                                    <button
                                                        className="deactivate-button"
                                                        onClick={() => handleDeactivate(allocation._id)}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                )}
                {/* TODO: Add pagination controls here if needed */}
            </div>
        </div>
    );
}