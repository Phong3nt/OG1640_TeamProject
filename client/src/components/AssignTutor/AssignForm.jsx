import React, { useState, useEffect } from "react";
import axios from "axios";

const AssignForm = ({ onAssignSuccess }) => {
  const [staffs, setStaffs] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ staff: "", tutor: "", student: "" });

  useEffect(() => {
    fetchUsersByRole("staff", setStaffs);
    fetchUsersByRole("tutor", setTutors);
    fetchUsersByRole("student", setStudents);
  }, []);

  const fetchUsersByRole = async (role, setState) => {
    try {
      const response = await axios.get(`/api/users?role=${role}`);
      setState(response.data);
    } catch (error) {
      console.error(`Lỗi khi lấy danh sách ${role}`, error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/tutor-allocation", formData);
      onAssignSuccess();
    } catch (error) {
      console.error("Lỗi khi gán tutor", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="assign-form">
      <label>Staff:</label>
      <select name="staff" onChange={handleChange} required>
        <option value="">Chọn Staff</option>
        {staffs.map((s) => (
          <option key={s._id} value={s._id}>{s.fullName}</option>
        ))}
      </select>

      <label>Tutor:</label>
      <select name="tutor" onChange={handleChange} required>
        <option value="">Chọn Tutor</option>
        {tutors.map((t) => (
          <option key={t._id} value={t._id}>{t.fullName}</option>
        ))}
      </select>

      <label>Student:</label>
      <select name="student" onChange={handleChange} required>
        <option value="">Chọn Student</option>
        {students.map((st) => (
          <option key={st._id} value={st._id}>{st.fullName}</option>
        ))}
      </select>

      <button type="submit">Gán Tutor</button>
    </form>
  );
};

export default AssignForm;
