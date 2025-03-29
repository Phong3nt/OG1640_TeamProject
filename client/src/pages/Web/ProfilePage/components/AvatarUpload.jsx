import React, { useState } from "react";

const AvatarUpload = ({ avatar, setUser }) => {
    const [preview, setPreview] = useState(avatar || "/default-avatar.png");

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
        }
    };

    return (
        <div className="avatar-container">
            <label htmlFor="avatar-input" className="avatar-label">
                <img src={preview} alt="Avatar" className="avatar" />
                <div className="edit-icon">✏️</div>
            </label>
            <input type="file" id="avatar-input" onChange={handleFileChange} hidden />
        </div>
    );
};

export default AvatarUpload;
