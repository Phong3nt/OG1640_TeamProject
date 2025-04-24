import React, { useState, useEffect } from "react";
import ProfileInfo from "./components/ProfileInfo";
import EditProfileForm from "./components/EditProfileForm";
import ChangePasswordForm from "./components/ChangePasswordForm";
import AvatarUpload from "./components/AvatarUpload";
import "./ProfilePage.css";
import axios from "axios";

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [user, setUser] = useState(null);

    // ✅ Lấy user ID từ localStorage
    const localUser = JSON.parse(localStorage.getItem("user"));
    const id = localUser?.id;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/users/${id}`);
                const data = res.data;

                if (data && data.user && data.user._id) {
                    setUser(data.user);
                } else {
                    console.error("Không tìm thấy thông tin user:", data);
                }
            } catch (err) {
                console.error("Lỗi khi fetch profile:", err);
            }
        };

        if (id) {
            fetchProfile();
        }
    }, [id]);

    const handleUpdateProfile = (updatedUser) => {
        setUser(updatedUser);
        setIsEditing(false);
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="profile-container">
            <div className="card">
                <AvatarUpload avatar={user.avatar} setUser={setUser} />
                {isEditing ? (
                    <EditProfileForm
                        user={user}
                        onUpdateProfile={handleUpdateProfile}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : isChangingPassword ? (
                    <ChangePasswordForm
                        onCancel={() => setIsChangingPassword(false)}
                    />
                ) : (
                    <ProfileInfo
                        user={user}
                        onEdit={() => setIsEditing(true)}
                        onChangePassword={() => setIsChangingPassword(true)}
                    />
                )}
            </div>
        </div>
    );
};

export default ProfilePage;