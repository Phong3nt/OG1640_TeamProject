import React from "react";
import { useForm } from "react-hook-form";

const EditProfileForm = ({ user, onUpdateProfile, onCancel }) => {
    const { register, handleSubmit } = useForm({
        defaultValues: user,
    });

    const onSubmit = (data) => {
        onUpdateProfile(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="edit-profile-form">
            <div className="form-group">
                <label>Name</label>
                <input {...register("name")} required />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input type="email" {...register("email")} required />
            </div>
            <div className="form-group">
                <label>Address</label>
                <input type="text" {...register("address")} required />
            </div>
            <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" {...register("phone")} required />
            </div>

            <div className="button-group">
                <button type="submit" className="save">SAVE</button>
                <button type="button" className="cancel" onClick={onCancel}>CANCEL</button>
                <button className="change-password">CHANGE PASSWORD</button>
            </div>
        </form>
    );
};

export default EditProfileForm;
