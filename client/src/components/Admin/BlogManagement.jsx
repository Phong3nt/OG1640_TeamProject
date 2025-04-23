import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditBlogModal from '../EditBlog/EditBlogModal'; 
import './BlogManagement.css';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleString('en-US', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: false
    });
};

export default function BlogManagementPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate(); 

   
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
    const [editingBlogId, setEditingBlogId] = useState(null);     

    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/blogs');
            console.log("Fetched blogs for management:", response.data);
            setBlogs(response.data.blogs || response.data || []);
        } catch (err) {
            console.error("Failed to fetch blogs:", err);
            setError(err.response?.data?.message || 'Could not load blog list.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const handleDelete = async (blogId, blogTitle) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the post "${blogTitle}"? This action cannot be undone.`);
        if (!confirmDelete) return;
        setStatusMessage({ type: '', text: '' });
        try {
            console.log(`Attempting to delete blog: ${blogId}`);
            await api.delete(`/blogs/${blogId}`);
            setStatusMessage({ type: 'success', text: `Successfully deleted post: "${blogTitle}".` });
            fetchBlogs();
        } catch (err) {
            console.error("Failed to delete blog:", err);
            setStatusMessage({
                type: 'error',
                text: `Failed to delete post. Error: ${err.response?.data?.message || err.message || 'Unknown error'}`
             });
        }
    };

    // --- Hàm Xử Lý Nhấn Nút Edit (Sửa lại) ---
    const handleEdit = (blogId) => {
        console.log(`Opening edit modal for blog: ${blogId}`);
        setEditingBlogId(blogId); // <-- Lưu ID của blog cần sửa
        setIsEditModalOpen(true); // <-- Mở modal
       
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingBlogId(null); // Reset ID khi đóng
    };

    const handleUpdateSuccess = () => {
        handleCloseEditModal(); // Đóng modal
        fetchBlogs(); // Tải lại danh sách blog
        setStatusMessage({ type: 'success', text: 'Blog updated successfully!' });
        // Xóa thông báo sau vài giây (tùy chọn)
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 3000);
    };


    // --- Render ---
    if (loading) return <div className="container blog-management-container" style={{ padding: '20px', textAlign: 'center' }}>Loading blog posts...</div>;
    if (error) return <div className="container blog-management-container error-message" style={{ padding: '20px', color: 'red', textAlign: 'center' }}>Error: {error}</div>;

    return (
        // Thêm thẻ React.Fragment hoặc div bao ngoài nếu cần thiết khi có modal
        <>
            <div className="container blog-management-container">
                <h1>Blog Post Management</h1>
                {statusMessage.text && (
                    <p className={`status-message ${statusMessage.type}`}>
                        {statusMessage.text}
                    </p>
                )}

                <table className="management-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Created Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>No blog posts found.</td>
                            </tr>
                        ) : (
                            blogs.map(blog => (
                                <tr key={blog._id}>
                                    <td>{blog.title || 'N/A'}</td>
                                    <td>{blog.author?.fullName || blog.author || 'N/A'}</td>
                                    <td>{formatDate(blog.createdAt)}</td>
                                    <td className="action-cell">
                                        <button
                                            className="action-button edit-button"
                                            onClick={() => handleEdit(blog._id)} // Gọi hàm handleEdit đã sửa
                                            title="Edit post"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="action-button delete-button"
                                            onClick={() => handleDelete(blog._id, blog.title)}
                                            title="Delete post"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isEditModalOpen && editingBlogId && (
                <EditBlogModal
                    blogId={editingBlogId}
                    isOpen={isEditModalOpen} // Truyền trạng thái (dù modal tự quản lý cũng được)
                    onClose={handleCloseEditModal} // Truyền hàm để đóng modal
                    onUpdateSuccess={handleUpdateSuccess} // Truyền hàm để xử lý khi update thành công
                />
            )}
        </> 
    );
}