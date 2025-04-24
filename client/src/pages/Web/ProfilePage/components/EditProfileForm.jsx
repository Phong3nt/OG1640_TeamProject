import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const EditProfileForm = ({ user, onUpdateProfile, onCancel }) => {
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        reset({
            fullName: user.fullName || "",
            email: user.email || "",
            phone: user.phone || "",
        });
    }, [user, reset]);

    const onSubmit = async (data) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/users/${user._id}`, data);
            if (res.data && res.data._id) {
                onUpdateProfile(res.data);
            }
        } catch (err) {
            console.error("Lỗi khi cập nhật profile:", err);
            alert("Cập nhật thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="edit-profile-form">
            <div className="form-group">
                <label>Full Name</label>
                <input {...register("fullName")} required />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input type="email" {...register("email")} required />
            </div>
            <div className="form-group">
                <label>Phone</label>
                <input type="tel" {...register("phone")} required />
            </div>
            <div className="button-group">
                <button type="submit" className="save">SAVE</button>
                <button type="button" className="cancel" onClick={onCancel}>CANCEL</button>
            </div>
        </form>
    );
};

export default EditProfileForm;