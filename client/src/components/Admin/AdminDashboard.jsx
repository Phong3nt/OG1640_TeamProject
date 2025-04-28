import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { FaUsers, FaChalkboardTeacher, FaUserGraduate, FaBlog, FaHandshake } from 'react-icons/fa';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend, Title,
    CategoryScale, LinearScale, BarElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import '../Admin/AdminDashboard.css';

ChartJS.register(
    ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, BarElement, ChartDataLabels
);

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: apiBaseUrl });

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = token; 
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const StatCard = ({ icon, label, value, loading }) => (
    <div className="stat-card">
        <div className="stat-icon">{icon}</div>
        <div className="stat-content">
            {loading ? (
                <div className="stat-value loading">...</div>
            ) : (
                <div className="stat-value">{value ?? 0}</div>
            )}
            <div className="stat-label">{label}</div>
        </div>
    </div>
);

export default function StaffDashboard() {
    const [stats, setStats] = useState({
        userCount: null, tutorCount: null, studentCount: null,
        staffCount: null, blogCount: null, allocationCount: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [tutorTaskStats, setTutorTaskStats] = useState([]);
    const [tutorTaskLoading, setTutorTaskLoading] = useState(true);
    const [tutorTaskError, setTutorTaskError] = useState(null);

    useEffect(() => {
        const fetchAllDashboardData = async () => {
            setLoading(true); setTutorTaskLoading(true);
            setError(null); setTutorTaskError(null);
            try {
                const dashboardPromise = api.get('/stats/dashboard');
                const tutorTaskPromise = api.get('/stats/tasks-per-tutor');
                const [dashboardResponse, tutorTaskResponse] = await Promise.all([
                    dashboardPromise, tutorTaskPromise
                ]);
                setStats(dashboardResponse.data || {});
                setTutorTaskStats(tutorTaskResponse.data || []);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                const message = err.response?.data?.message || err.message || "Could not load statistics.";
                setError(message);
                setTutorTaskError(message); 
            } finally {
                setLoading(false); setTutorTaskLoading(false);
            }
        };
        fetchAllDashboardData();
    }, []);

    const roleChartData = {
        labels: ['Staff', 'Tutor', 'Student'],
        datasets: [ {
            label: '# of Accounts',
            data: [stats.staffCount ?? 0, stats.tutorCount ?? 0, stats.studentCount ?? 0],
            backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
            borderWidth: 1,
        } ],
    };
    const roleChartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'User Account Distribution', font: { size: 16 }, padding: {bottom: 15} },
            tooltip: { enabled: true },
            datalabels: {
                formatter: (value, ctx) => {
                    const total = ctx.chart.data.datasets[0].data.reduce((sum, data) => sum + parseFloat(data || 0), 0);
                    if (total === 0 || value === 0) return '';
                    const percentage = (value / total) * 100;
                    return percentage >= 1 ? percentage.toFixed(1) + '%' : '';
                },
                color: '#fff', font: { weight: 'bold', size: 12 },
            }
        },
    };
    const canDisplayPieChart = !loading && stats.staffCount !== null && stats.tutorCount !== null && stats.studentCount !== null && !error;

    const hasTutorTaskData = Array.isArray(tutorTaskStats) && tutorTaskStats.length > 0;
    const tutorTaskChartData = {
        labels: hasTutorTaskData ? tutorTaskStats.map(stat => stat.tutorName || `Tutor ${stat.tutorId?.slice(-4)}`) : [],
        datasets: [ {
            label: 'Tasks Assigned',
            data: hasTutorTaskData ? tutorTaskStats.map(stat => stat.assignedTaskCount ?? 0) : [],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        } ],
    };
    const tutorTaskChartOptions = {
        indexAxis: 'x', responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Tasks Assigned per Tutor', font: { size: 16 }, padding: {bottom: 20} },
            tooltip: { enabled: true },
            datalabels: { display: false }
        },
        scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Number of Tasks' }, ticks: { precision: 0 } },
            x: { title: { display: true, text: 'Tutor Name' } }
        },
    };

    // --- JSX Render ---
    return (
        <div className="staff-dashboard-container">
            <h1>Staff Dashboard</h1>

            <div className="stats-grid">
                <StatCard icon={<FaUsers size={30} />} label="Total Users" value={stats.userCount} loading={loading}/>
                <StatCard icon={<FaChalkboardTeacher size={30} />} label="Tutors" value={stats.tutorCount} loading={loading}/>
                <StatCard icon={<FaUserGraduate size={30} />} label="Students" value={stats.studentCount} loading={loading}/>
                <StatCard icon={<FaBlog size={30} />} label="Blog Posts" value={stats.blogCount} loading={loading}/>
                <StatCard icon={<FaHandshake size={30} />} label="Allocations" value={stats.allocationCount} loading={loading}/>
            </div>

            <div className="charts-area charts-area-flex">

                <div className="chart-section chart-flex-item">
                    <h2>Account Distribution</h2>
                    <div className="chart-container pie-chart-container" style={{ height: '350px', position: 'relative' }}>
                        {loading && <p>Loading...</p>}
                        {!loading && error && <p className="error-message">Error: {error}</p>}
                        {!loading && !error && canDisplayPieChart && (
                            <Pie data={roleChartData} options={roleChartOptions} />
                        )}
                        {!loading && !error && !canDisplayPieChart && (
                             <p>Data unavailable.</p>
                        )}
                    </div>
                </div>

                <div className="chart-section chart-flex-item">
                    <h2>Tasks Assigned</h2>
                    <div className="chart-container bar-chart-container" style={{ height: '350px', position: 'relative' }}>
                        {tutorTaskLoading && <p>Loading...</p>}
                        {!tutorTaskLoading && tutorTaskError && (
                            <p className="error-message">Error: {tutorTaskError}</p>
                        )}
                        {!tutorTaskLoading && !tutorTaskError && hasTutorTaskData && (
                            <Bar options={tutorTaskChartOptions} data={tutorTaskChartData} />
                        )}
                        {!tutorTaskLoading && !tutorTaskError && !hasTutorTaskData && (
                            <p>No data available.</p>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
}

StatCard.propTypes = {
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.number,
    loading: PropTypes.bool.isRequired,
};