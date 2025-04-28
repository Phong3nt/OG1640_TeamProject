import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaSpinner } from 'react-icons/fa'; 
import { AdvancedImage } from '@cloudinary/react'; 
import { Cloudinary } from "@cloudinary/url-gen";
import './EditBlogModal.css';

// --- Lấy biến môi trường & Cấu hình Instances ---
const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: apiBaseUrl });
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) { config.headers.Authorization = token; }
    return config;
});

let cld = null;
if (cloudName) {
    cld = new Cloudinary({ cloud: { cloudName }, url: { secure: true } });
} else {
    console.error("EditBlogModal: Cloudinary Cloud Name missing in .env!");
}
// --- Hết cấu hình ---


export default function EditBlogModal({ blogId, isOpen, onClose, onUpdateSuccess }) {
    // State cho dữ liệu blog đang sửa
    const [blogData, setBlogData] = useState({ title: '', description: '', coverImage: '' });
    const [originalAuthorName, setOriginalAuthorName] = useState('');

    // State cho file ảnh mới và preview
    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');

    // State cho trạng thái loading/updating/error
    const [loading, setLoading] = useState(true); // Loading dữ liệu blog ban đầu
    const [fetchError, setFetchError] = useState(null);
    const [isUploading, setIsUploading] = useState(false); // Upload ảnh lên Cloudinary
    const [isUpdating, setIsUpdating] = useState(false);  // Update bài blog lên backend
    const [updateError, setUpdateError] = useState('');

    // Fetch dữ liệu blog khi modal mở hoặc blogId thay đổi
    useEffect(() => {
        // Reset state khi modal mở hoặc blogId thay đổi
        setImageFile(null);
        setImagePreviewUrl('');
        setUpdateError('');
        setIsUploading(false);
        setIsUpdating(false);

        if (isOpen && blogId && cld) { // Chỉ fetch khi modal mở, có ID và có cấu hình Cloudinary
            const fetchBlog = async () => {
                setLoading(true);
                setFetchError(null);
                try {
                    const response = await api.get(`/blogs/${blogId}`);
                    const fetchedBlog = response.data.blog || response.data; // Linh hoạt với response
                    setBlogData({
                        title: fetchedBlog.title || '',
                        description: fetchedBlog.description || '',
                        coverImage: fetchedBlog.coverImage || '', // Lưu public_id hiện tại
                    });
                    setOriginalAuthorName(fetchedBlog.author?.fullName || 'Unknown Author');
                } catch (err) {
                    console.error("Failed to fetch blog for editing:", err);
                    setFetchError(err.response?.data?.message || `Could not load blog data (ID: ${blogId}).`);
                } finally {
                    setLoading(false);
                }
            };
            fetchBlog();
        } else if (!isOpen) {
            setLoading(true); // Đặt lại loading khi modal đóng
        }
    }, [blogId, isOpen, cld]); // Thêm cld vào dependency

    // Xử lý input change (title, description)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBlogData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý chọn file ảnh mới
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // Lưu file mới
            // Tạo URL preview cho file mới
            const currentPreviewUrl = imagePreviewUrl; // Lưu URL cũ để revoke
            const newPreviewUrl = URL.createObjectURL(file);
            setImagePreviewUrl(newPreviewUrl);
            // Dọn dẹp URL preview cũ nếu có
            if (currentPreviewUrl) {
                URL.revokeObjectURL(currentPreviewUrl);
            }
        }
    };

     // Dọn dẹp URL preview khi component unmount
     useEffect(() => {
        return () => {
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
        };
    }, [imagePreviewUrl]);


    // Xử lý submit (update)
    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateError('');

        // Kiểm tra các trường bắt buộc (trừ ảnh vì có thể không đổi)
        if (!blogData.title.trim() || !blogData.description.trim()) {
            setUpdateError('Title and Description are required.');
            return;
        }
        // Kiểm tra cấu hình Cloudinary
        if (!cloudName || !uploadPreset) {
            setUpdateError('Cloudinary configuration is missing.');
            return;
       }

        setIsUpdating(true); // Bắt đầu quá trình update tổng thể
        let finalCoverImageId = blogData.coverImage; // Giữ lại public_id cũ mặc định

        try {
            // --- Bước 1 (Nếu có file mới): Upload ảnh mới lên Cloudinary ---
            if (imageFile) {
                setIsUploading(true); // Bắt đầu upload ảnh
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('upload_preset', uploadPreset);

                console.log("Uploading NEW image to Cloudinary...");
                const cloudinaryRes = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                console.log("Cloudinary Upload Response:", cloudinaryRes.data);

                // Lấy public_id mới và gán vào biến final
                finalCoverImageId = cloudinaryRes.data.public_id;
                if (!finalCoverImageId) {
                    throw new Error("Failed to get new public_id from Cloudinary.");
                }
                console.log(`New image uploaded. New Public ID: ${finalCoverImageId}`);
                setIsUploading(false); // Kết thúc upload ảnh
                // TODO (Optional): Gọi API backend để xóa ảnh cũ với public_id là blogData.coverImage
            } else {
                console.log("No new image selected, keeping existing cover image ID:", finalCoverImageId);
            }

            // --- Bước 2: Gửi dữ liệu cập nhật lên backend ---
            const updatePayload = {
                title: blogData.title,
                description: blogData.description,
                coverImage: finalCoverImageId, // Gửi public_id (cũ hoặc mới)
            };
            console.log("Updating blog post with payload:", updatePayload);

            // Gọi API PUT bằng instance 'api'
            await api.put(`/blogs/${blogId}`, updatePayload);

            console.log('Blog updated successfully!');
            alert('Blog updated successfully!');
            onUpdateSuccess(); // Gọi callback để đóng modal và/hoặc refresh list
            onClose(); // Đóng modal sau khi thành công

        } catch (err) {
            console.error("Failed to update blog:", err);
            let errorMsg = 'An error occurred while updating the post.';
            if (isUploading) { // Lỗi xảy ra khi đang upload ảnh
                 errorMsg = 'Failed to upload new image to Cloudinary.';
                 if (err.response) { errorMsg += ` Server error: ${err.response.data?.error?.message || err.response.statusText}`; }
                 else { errorMsg += ` Error: ${err.message}`; }
                 setIsUploading(false); // Reset trạng thái upload nếu lỗi
            } else { // Lỗi xảy ra khi gọi API backend để update blog
                 if (err.response) { errorMsg = err.response.data?.message || `Server error: ${err.response.status}`; }
                 else if (err.request) { errorMsg = 'Cannot connect to the server.'; }
                 else { errorMsg = `Error: ${err.message}`; }
            }
            setUpdateError(errorMsg);
        } finally {
            setIsUploading(false); // Đảm bảo reset trạng thái upload
            setIsUpdating(false); // Kết thúc quá trình update tổng thể
        }
    };

   // --- Phần Render Modal ---
   if (!isOpen) return null;

    // Tạo đối tượng ảnh Cloudinary cho ảnh HIỆN TẠI (nếu có)
    const currentCoverImage = (blogData.coverImage && cld) ? cld.image(blogData.coverImage) : null;
    // if (currentCoverImage) { currentCoverImage.resize(...) } // Có thể thêm transform nếu muốn

   return (
       <div className="modal-overlay">
           <div className="modal-content edit-blog-modal">
               <div className="modal-header">
                   <h2 className="modal-title">Edit Blog Post</h2>
                   <button className="close-button" onClick={onClose} disabled={isUpdating || isUploading}>
                       <FaTimes />
                   </button>
               </div>

               {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Loading blog data...</p>}
               {fetchError && <p className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>Error: {fetchError}</p>}

               {!loading && !fetchError && (
                   <form onSubmit={handleUpdate}>
                       <p style={{ marginBottom: '1rem', color: '#555', fontSize: '0.9em' }}>Author: {originalAuthorName}</p>
                       {/* Hiển thị lỗi update */}
                       {updateError && <p className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{updateError}</p>}

                       {/* Title */}
                       <div className="form-group">
                           <label htmlFor="edit-title">Title</label>
                           <input type="text" id="edit-title" name="title" value={blogData.title} onChange={handleChange} required disabled={isUpdating} />
                       </div>

                       {/* Cover Image Section */}
                       <div className="form-group">
                            <label>Current Cover Image</label>
                            {/* Hiển thị ảnh hiện tại */}
                            <div style={{ marginBottom: '10px' }}>
                                {currentCoverImage ? (
                                    <AdvancedImage cldImg={currentCoverImage} style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', border: '1px solid #ccc' }} alt="Current Cover"/>
                                ) : (
                                    blogData.coverImage && !cld ?
                                    <p style={{color: 'red'}}>Cloudinary Config Error!</p> :
                                    <p>No current image.</p>
                                )}
                            </div>

                            {/* Input để chọn file MỚI */}
                            <label htmlFor="edit-coverImageFile">Upload New Cover Image (Optional)</label>
                            <input
                                type="file"
                                id="edit-coverImageFile"
                                name="coverImageFile"
                                onChange={handleImageChange}
                                accept="image/png, image/jpeg, image/gif, image/webp"
                                disabled={isUpdating} // Disable khi đang update
                            />
                            {/* Hiển thị preview ảnh MỚI nếu có */}
                            {imagePreviewUrl && (
                                <div style={{ marginTop: '10px' }}>
                                     <p>New image preview:</p>
                                    <img
                                        src={imagePreviewUrl}
                                        alt="New cover preview"
                                        style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', border: '1px solid #ccc' }}
                                    />
                                </div>
                            )}
                       </div>

                       {/* Description */}
                       <div className="form-group">
                           <label htmlFor="edit-description">Description</label>
                           <textarea id="edit-description" name="description" value={blogData.description} onChange={handleChange} rows="8" required disabled={isUpdating}></textarea>
                       </div>

                       {/* Actions */}
                       <div className="form-actions">
                           <button type="button" className="cancel-btn" onClick={onClose} disabled={isUpdating}>Cancel</button>
                           <button type="submit" className="save-btn" disabled={isUpdating || isUploading}>
                               {isUploading ? 'Uploading...' : (isUpdating ? 'Updating...' : 'Update Post')}
                           </button>
                       </div>
                   </form>
               )}
           </div>
       </div>
   );
}