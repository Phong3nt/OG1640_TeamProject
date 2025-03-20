import React from "react";
import { useForm } from "react-hook-form";

const ChangePasswordForm = ({ onCancel }) => {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        console.log("Password Changed:", data);
        alert("Password updated successfully!");
        onCancel();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="change-password-form">
            <div className="form-group">
                <label>Current Password</label>
                <input type="password" {...register("currentPassword")} required />
            </div>
            <div className="form-group">
                <label>New Password</label>
                <input type="password" {...register("newPassword")} required />
            </div>
            <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" {...register("confirmPassword")} required />
            </div>

            <div className="button-group">
                <button type="submit" className="button button-primary">SAVE</button>
                <button type="button" className="button button-outline" onClick={onCancel}>CANCEL</button>
            </div>
        </form>
    );
};

export default ChangePasswordForm;
