import React, { useState } from "react";
import ProfileInfo from "./components/ProfileInfo";
import EditProfileForm from "./components/EditProfileForm";
import ChangePasswordForm from "./components/ChangePasswordForm";
import AvatarUpload from "./components/AvatarUpload";
import "./ProfilePage.css";

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [user, setUser] = useState({
        name: "Hồ Quang Minh",
        email: "minhhtc11b4@gmail.com",
        address: "12 Nguyễn Thị Định, Đà Nẵng",
        phone: "0787739048",
        avatar: "/default-avatar.png",
    });

    const handleUpdateProfile = (updatedUser) => {
        setUser(updatedUser);
        setIsEditing(false);
    };

    return (
        <div className="profile-container">
            <div className="card">
                <AvatarUpload avatar={user.avatar} setUser={setUser} />
                {isEditing ? (
                    <EditProfileForm user={user} onUpdateProfile={handleUpdateProfile} onCancel={() => setIsEditing(false)} />
                ) : isChangingPassword ? (
                    <ChangePasswordForm onCancel={() => setIsChangingPassword(false)} />
                ) : (
                    <ProfileInfo user={user} onEdit={() => setIsEditing(true)} onChangePassword={() => setIsChangingPassword(true)} />
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
