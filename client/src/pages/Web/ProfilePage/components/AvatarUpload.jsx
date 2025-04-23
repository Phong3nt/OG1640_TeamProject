import React, { useState } from "react";
import axios from "axios";

const AvatarUpload = ({ avatar, setUser }) => {
    const [preview, setPreview] = useState(avatar || "/default-avatar.png");

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Preview ảnh tạm
        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);

        // Gửi ảnh lên server
        try {
            const formData = new FormData();
            formData.append("avatar", file);

            const res = await axios.put("/api/profile/me", formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data && res.data.user) {
                setUser((prev) => ({
                    ...prev,
                    avatar: res.data.user.avatar,
                }));
            }
        } catch (err) {
            console.error("Lỗi khi upload avatar:", err);
            alert("Không thể cập nhật ảnh đại diện.");
        }
    };

    return (
        <div className="avatar-container">
            <label htmlFor="avatar-input" className="avatar-label">
                <img src={preview} alt="Avatar" className="avatar" />
                {/* <div className="edit-icon">✏️</div> */}
            </label>
            <input
                type="file"
                id="avatar-input"
                accept="image/*"
                onChange={handleFileChange}
                hidden
            />
        </div>
    );
};

export default AvatarUpload;
