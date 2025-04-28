import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './MyAllocationInfo.css'; 

const api = axios.create({ baseURL: 'http://localhost:5000/api' });
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

const calculateEndDate = (startDateString, durationMonths) => {
    if (!startDateString || !durationMonths || isNaN(parseInt(durationMonths))) return null;
    try {
        const startDate = new Date(startDateString);
        if (isNaN(startDate.getTime())) return null;
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + parseInt(durationMonths));
        return endDate;
    } catch (e) { console.error("Error calculating end date:", e); return null; }
};

const formatDate = (date) => {
    if (!date) return 'N/A';
    if (typeof date === 'string') date = new Date(date);
    if (!(date instanceof Date) || isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

function MyAllocationInfo({ currentUser }) {
    const [allocations, setAllocations] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMyAllocations = useCallback(async () => {
        if (!currentUser?._id || !currentUser?.role) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        setAllocations([]);
        try {
            console.log(`Workspaceing MY allocations for user ${currentUser._id}`); 
            const response = await api.get('/me/allocations');
            console.log('My Allocations Response:', response.data);
            setAllocations(response.data.allocations || response.data || []);
        } catch (err) {
            console.error("Failed to fetch my allocations:", err);
            setError(err.response?.data?.message || 'Could not load your allocation information.');
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchMyAllocations();
    }, [fetchMyAllocations]);

   
    if (loading) {
        return <div className="allocation-info loading">Loading allocation info...</div>;
    }

    if (error) {
        return <div className="allocation-info error">Error: {error}</div>;
    }

    if (currentUser.role === 'student') {
        const allocation = allocations[0]; 
        if (!allocation) {
            return <div className="allocation-info">You currently have no active tutor assignment.</div>;
        }
        const endDate = calculateEndDate(allocation.allocationDate, allocation.durationMonths);
        return (
            <div className="allocation-info student-info">
                <h3>Your Assigned Tutor</h3>
                <p><strong>Tutor:</strong> {allocation.tutor?.fullName || 'N/A'}</p>
                <p><strong>Email:</strong> {allocation.tutor?.email || 'N/A'}</p>
                <p><strong>Assigned By:</strong> {allocation.allocatedBy?.fullName || 'N/A'}</p>
                <p><strong>Start Date:</strong> {formatDate(allocation.allocationDate)}</p>
                <p><strong>Duration:</strong> {allocation.durationMonths ? `${allocation.durationMonths} months` : 'N/A'}</p>
                <p><strong>Estimated End Date:</strong> {formatDate(endDate)}</p>
            </div>
        );
    }

    if (currentUser.role === 'tutor') {
        if (allocations.length === 0) {
            return <div className="allocation-info">You currently have no active student assignments.</div>;
        }
        return (
            <div className="allocation-info tutor-info">
                <h3>Your Assigned Student(s)</h3>
                <ul className="student-list">
                    {allocations.map(allocation => {
                         const endDate = calculateEndDate(allocation.allocationDate, allocation.durationMonths);
                         return (
                            <li key={allocation._id} className="student-item">
                                <p><strong>Student:</strong> {allocation.student?.fullName || 'N/A'}</p>
                                <p><strong>Start Date:</strong> {formatDate(allocation.allocationDate)}</p>
                                <p><strong>Duration:</strong> {allocation.durationMonths ? `${allocation.durationMonths} months` : 'N/A'}</p>
                                <p><strong>Estimated End Date:</strong> {formatDate(endDate)}</p>
                            </li>
                         );
                    })}
                </ul>
            </div>
        );
    }
    return null; 
} 

MyAllocationInfo.propTypes = {
    currentUser: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        
    }), 
};

export default MyAllocationInfo;