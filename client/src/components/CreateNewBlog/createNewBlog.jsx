import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { AdvancedImage } from '@cloudinary/react'
import axios from 'axios';
import { Cloudinary } from "@cloudinary/url-gen";
import './index.css'; 


const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'; 

const api = axios.create({
  baseURL: apiBaseUrl
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token && config.headers) {
        config.headers.Authorization = token;
       
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


const CreateNewBlog = ({ onClose, onSave, fullName }) => {
    const [newBlog, setNewBlog] = useState({
        title: '',
        description: '',
        coverImage: '', 
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(''); 
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewBlog(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Tạo URL tạm thời để preview
            setImagePreviewUrl(URL.createObjectURL(file));
        } else {
            setImageFile(null);
            setImagePreviewUrl('');
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
        };
    }, [imagePreviewUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!cloudName || !uploadPreset) {
             setError('Cloudinary configuration (cloud name or upload preset) is missing in environment variables.');
             return;
        }
        if (!fullName) { setError('Author information is missing.'); return; }
        if (!newBlog.title.trim()) { setError('Title is required.'); return; }
        if (!newBlog.description.trim()) { setError('Description is required.'); return; }
        if (!imageFile) { setError('Cover Image is required.'); return; }

        setIsUploading(true);
        setIsSaving(true);
        let uploadedImageIdentifier = '';

        try {
            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('upload_preset', uploadPreset); 

            console.log(`Uploading to Cloudinary (Cloud: ${cloudName}, Preset: ${uploadPreset})...`);
            const cloudinaryRes = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            console.log("Cloudinary Response:", cloudinaryRes.data);
            uploadedImageIdentifier = cloudinaryRes.data.public_id;

            if (!uploadedImageIdentifier) {
                 throw new Error("Failed to get identifier from Cloudinary response.");
            }
            console.log(`Image uploaded successfully. Identifier: ${uploadedImageIdentifier}`);
            setIsUploading(false); // Kết thúc upload ảnh

            const payload = {
                title: newBlog.title,
                description: newBlog.description,
                coverImage: uploadedImageIdentifier, 
            };
             console.log("Saving blog post with payload:", payload);

            const blogRes = await api.post('/blogs', payload); // Chỉ cần đường dẫn tương đối

            // Backend thường trả về 201 Created hoặc 200 OK
             if (blogRes.status === 201 || blogRes.status === 200) {
                console.log("Blog post saved successfully:", blogRes.data);
                onSave(blogRes.data); // Gọi hàm callback từ component cha
            } else {
                 setError(`Unexpected response status when saving blog: ${blogRes.status}`);
            }
        } catch (err) {
            console.error("Error during blog creation:", err);
            let errorMessage = 'An error occurred while saving the post.';
             if (isUploading && !uploadedImageIdentifier) { // Lỗi xảy ra khi đang upload hoặc upload xong nhưng không lấy được ID
                 errorMessage = 'Failed to upload image to Cloudinary.';
                 if (err.response) { // Lỗi từ Cloudinary API
                    errorMessage += ` Server response: ${err.response.data?.error?.message || err.response.statusText}`;
                 } else {
                    errorMessage += ` Error: ${err.message}`;
                 }
                 setIsUploading(false); // Đặt lại trạng thái upload nếu lỗi
             } else { // Lỗi xảy ra khi lưu blog vào backend (sau khi upload ảnh thành công)
                if (err.response) { // Lỗi từ API backend của bạn
                    errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
                } else if (err.request) {
                    errorMessage = 'Cannot connect to the backend server.';
                } else { // Lỗi khác (ví dụ: lỗi mạng phía client, lỗi JS)
                    errorMessage = `Error: ${err.message}`;
                }
                // Cân nhắc: Nếu upload ảnh thành công nhưng lưu blog lỗi, ảnh vẫn còn trên Cloudinary.
                // Có thể cần cơ chế xóa ảnh rác sau này hoặc báo lỗi rõ ràng hơn.
             }
            setError(errorMessage);
        } finally {
            // Luôn đặt lại trạng thái loading cuối cùng
            setIsUploading(false);
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">Create New Blog</h2>
                    <button className="close-button" onClick={onClose} disabled={isSaving}>
                        <FaTimes />
                    </button>
                </div>

                {error && <p className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" name="title" value={newBlog.title} onChange={handleChange} required disabled={isSaving} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="coverImageFile">Cover Image</label>
                        <input
                            type="file"
                            id="coverImageFile"
                            name="coverImageFile"
                            onChange={handleImageChange}
                            accept="image/png, image/jpeg, image/gif, image/webp"
                            required
                            disabled={isSaving}
                        />
                        {/* Hiển thị preview ảnh đã chọn */}
                        {imagePreviewUrl && (
                            <div style={{ marginTop: '10px' }}>
                                <img
                                    src={imagePreviewUrl}
                                    alt="Cover preview"
                                    style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', border: '1px solid #ccc' }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={newBlog.description}
                            onChange={handleChange}
                            rows="10"
                            required
                            disabled={isSaving}
                        ></textarea>
                    </div>

                    {/* Hiển thị Author (lấy từ prop) */}
                    {fullName && (
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <strong>Author:</strong> {fullName}
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onClose} disabled={isSaving}>Cancel</button>
                        <button type="submit" className="save-btn" disabled={isSaving || !fullName}>
                            {isUploading ? 'Uploading Image...' : (isSaving ? 'Saving Post...' : 'Save Post')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateNewBlog;