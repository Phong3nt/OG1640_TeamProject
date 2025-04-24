import React, { useState, useEffect } from "react";
import axios from "axios";
import AssignForm from "./AssignForm";
import AssignList from "./AssignList";
import "./AssignTutor.css";

const AssignTutor = () => {
  const [allocations, setAllocations] = useState([]);

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    try {
      const response = await axios.get("/api/tutor-allocation");
      setAllocations(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tutor allocation", error);
    }
  };

  return (
    <div className="assign-tutor-container">
      <h2>Gán Tutor cho Sinh Viên</h2>
      <AssignForm onAssignSuccess={fetchAllocations} />
      <AssignList allocations={allocations} />
    </div>
  );
};

export default AssignTutor;
