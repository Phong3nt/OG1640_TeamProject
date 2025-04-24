import React from "react";

const ProfileInfo = ({ user, onEdit, onChangePassword }) => {
    return (
        <div className="profile-info">
            <div className="form-group">
                <label>Name</label>
                <input type="text" value={user.fullName} disabled />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input type="email" value={user.email} disabled />
            </div>
            <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" value={user.phone} disabled />
            </div>

            <div className="button-group">
                <button className="button button-primary" onClick={onEdit}>EDIT PROFILE</button>
                <button className="button button-outline" onClick={onChangePassword}>CHANGE PASSWORD</button>
            </div>
        </div>
    );
};

export default ProfileInfo;