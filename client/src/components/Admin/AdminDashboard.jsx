
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { FaUsers, FaChalkboardTeacher, FaUserGraduate, FaBlog, FaHandshake } from 'react-icons/fa';
import '../Admin/AdminDashboard.css'; 

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: apiBaseUrl });

// Thêm interceptor để gửi token (quan trọng cho các API cần xác thực)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = token; // Hoặc `Bearer ${token}` tùy backend
        }
        return config;
    },
    (error) => Promise.reject(error)
);
// --- Hết Axios Instance ---


// --- Component StatCard (Helper component) ---
const StatCard = ({ icon, label, value, loading }) => (
    <div className="stat-card">
        <div className="stat-icon">{icon}</div>
        <div className="stat-content">
            {loading ? (
                <div className="stat-value loading">...</div> // Hiển thị '...' khi đang tải
            ) : (
                // Hiển thị giá trị, hoặc 0 nếu giá trị là null/undefined
                <div className="stat-value">{value ?? 0}</div>
            )}
            <div className="stat-label">{label}</div>
        </div>
    </div>
);
// --- Hết StatCard ---


// --- Component StaffDashboard ---
export default function StaffDashboard() {
    // State để lưu trữ số liệu thống kê
    const [stats, setStats] = useState({
        userCount: null,
        tutorCount: null,
        studentCount: null,
        blogCount: null,
        allocationCount: null, // Đã thêm allocation count
    });
    // State cho trạng thái tải và lỗi
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect để fetch dữ liệu khi component được mount
    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                // Gọi API endpoint backend (Đảm bảo đã được bảo vệ ở backend)
                const response = await api.get('/stats/dashboard');
                console.log("Dashboard Stats Response:", response.data);
                setStats(response.data); // Cập nhật state với dữ liệu từ API
            } catch (err) {
                console.error("Failed to fetch dashboard stats:", err);
                // Hiển thị lỗi cụ thể hơn nếu có từ backend
                setError(err.response?.data?.message || "Could not load dashboard statistics.");
            } finally {
                setLoading(false); // Luôn tắt loading sau khi fetch xong (thành công hoặc lỗi)
            }
        };

        fetchStats(); // Gọi hàm fetch
    }, []); // Mảng dependency rỗng nghĩa là chỉ chạy 1 lần khi mount

    // Render giao diện
    return (
        <div className="staff-dashboard-container">
            <h1>Staff Dashboard</h1>

            {/* Hiển thị thông báo lỗi nếu có */}
            {error && <p className="error-message" style={{ color: 'red' }}>Error: {error}</p>}

            {/* Container cho các thẻ thống kê */}
            <div className="stats-grid">
                {/* Thẻ Total Users */}
                <StatCard
                    icon={<FaUsers size={30} />}
                    label="Total Users"
                    value={stats.userCount}
                    loading={loading} // Truyền trạng thái loading
                />
                {/* Thẻ Tutors */}
                <StatCard
                    icon={<FaChalkboardTeacher size={30} />}
                    label="Tutors"
                    value={stats.tutorCount}
                    loading={loading}
                />
                {/* Thẻ Students */}
                <StatCard
                    icon={<FaUserGraduate size={30} />}
                    label="Students"
                    value={stats.studentCount}
                    loading={loading}
                />
                 {/* Thẻ Blog Posts */}
                 <StatCard
                    icon={<FaBlog size={30} />}
                    label="Blog Posts"
                    value={stats.blogCount}
                    loading={loading}
                />
                 {/* Thẻ Allocations */}
                 <StatCard
                    icon={<FaHandshake size={30} />}
                    label="Allocations Created"
                    value={stats.allocationCount}
                    loading={loading}
                />
                 {/* Thêm các thẻ StatCard khác nếu API backend cung cấp thêm số liệu */}
            </div>

             {/* Các phần khác của Dashboard có thể thêm vào đây */}

        </div>
    );
}