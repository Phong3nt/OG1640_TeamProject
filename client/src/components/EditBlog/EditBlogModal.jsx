import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditBlogModal.css'; // File CSS riêng cho modal
import { FaTimes } from 'react-icons/fa';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});
// --- ---

export default function EditBlogModal({ blogId, isOpen, onClose, onUpdateSuccess }) {
    const [blogData, setBlogData] = useState({ title: '', description: '', coverImage: '' });
    const [originalAuthorName, setOriginalAuthorName] = useState('');

    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState('');

    useEffect(() => {
        if (isOpen && blogId) {
            const fetchBlog = async () => {
                setLoading(true);
                setFetchError(null);
                setUpdateError(''); // Xóa lỗi update cũ
                try {
                    const response = await api.get(`/blogs/${blogId}`);
                    setBlogData({
                        title: response.data.title || '',
                        description: response.data.description || '',
                        coverImage: response.data.coverImage || '',
                    });
                    setOriginalAuthorName(response.data.author?.fullName || 'Unknown Author');
                } catch (err) {
                    console.error("Failed to fetch blog for editing:", err);
                    setFetchError(err.response?.data?.message || `Could not load blog data (ID: ${blogId}).`);
                } finally {
                    setLoading(false);
                }
            };
            fetchBlog();
        }
    }, [blogId, isOpen]); // Dependency là blogId và isOpen

    // Xử lý input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBlogData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý submit (update)
    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateError('');
        if (!blogData.title.trim() || !blogData.description.trim() || !blogData.coverImage.trim()) {
            setUpdateError('Title, Description, and Cover Image URL are required.');
            return;
        }
        setIsUpdating(true);
        const updatePayload = {
            title: blogData.title,
            description: blogData.description,
            coverImage: blogData.coverImage,
        };
        try {
            await api.put(`/blogs/${blogId}`, updatePayload);
            alert('Blog updated successfully!'); 
            onUpdateSuccess(); 
        } catch (err) {
            console.error("Failed to update blog:", err);
            setUpdateError(err.response?.data?.message || 'An error occurred while updating the post.');
        } finally {
            setIsUpdating(false);
        }
    };

     if (!isOpen) {
       return null;
     }

    return (
        // Lớp phủ và nội dung modal
        <div className="modal-overlay">
            <div className="modal-content edit-blog-modal"> 
                <div className="modal-header">
                    <h2 className="modal-title">Edit Blog Post</h2>
                    <button className="close-button" onClick={onClose} disabled={isUpdating}>
                        <FaTimes />
                    </button>
                </div>

                {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Loading blog data...</p>}
                {fetchError && <p className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>Error: {fetchError}</p>}

                {!loading && !fetchError && (
                    <form onSubmit={handleUpdate}>
                         <p style={{ marginBottom: '1rem', color: '#555', fontSize: '0.9em' }}>Author: {originalAuthorName}</p>
                        {updateError && <p className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{updateError}</p>}

                        <div className="form-group">
                            <label htmlFor="edit-title">Title</label>
                            <input type="text" id="edit-title" name="title" value={blogData.title} onChange={handleChange} required disabled={isUpdating} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="edit-coverImage">Cover Image URL</label>
                            <input type="url" id="edit-coverImage" name="coverImage" value={blogData.coverImage} onChange={handleChange} placeholder="https://..." required disabled={isUpdating} />
                            {blogData.coverImage && <img src={blogData.coverImage} alt="Cover preview" style={{maxWidth: '150px', marginTop: '10px', display:'block'}}/> }
                        </div>
                        <div className="form-group">
                            <label htmlFor="edit-description">Description</label>
                            <textarea id="edit-description" name="description" value={blogData.description} onChange={handleChange} rows="8" required disabled={isUpdating}></textarea>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={onClose} disabled={isUpdating}>Cancel</button>
                            <button type="submit" className="save-btn" disabled={isUpdating}>
                                {isUpdating ? 'Updating...' : 'Update Post'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}