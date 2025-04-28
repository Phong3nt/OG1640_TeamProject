import React, { useState } from "react";

const CreateMeetingForm = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    duration: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onCreate({
      ...formData,
    });

    // Reset the form
    setFormData({
      title: "",
      date: "",
      duration: "",
    });
  };

  return (
    <form className="create-meeting-form" onSubmit={handleSubmit}>
      <div className="create-meeting-inputs">
        <input
          type="text"
          placeholder="Meeting Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Meeting Duration (optional)"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Create Meeting</button>
    </form>
  );
};

export default CreateMeetingForm;