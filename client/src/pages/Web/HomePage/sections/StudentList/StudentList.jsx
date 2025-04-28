import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortAsc, setSortAsc] = useState(true); // Mặc định sort A -> Z

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/me/allocations");
        const allocations = res.data.allocations || [];
        const studentList = allocations.map((allocation) => allocation.student);

        setStudents(studentList);
      } catch (err) {
        console.error("Lỗi fetch students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSort = () => {
    const sorted = [...students].sort((a, b) => {
      if (sortAsc) {
        return a.fullName.localeCompare(b.fullName);
      } else {
        return b.fullName.localeCompare(a.fullName);
      }
    });
    setStudents(sorted);
    setSortAsc(!sortAsc); // Đảo ngược trạng thái sort lần tới
  };

  if (loading) {
    return <div>Loading students...</div>;
  }

  return (
    <div className="list-container">
      <div className="sort-button-container">
        <button onClick={handleSort} className="sort-button">
          Sort {sortAsc ? "A → Z" : "Z → A"}
        </button>
      </div>

      {students.length === 0 ? (
        <div>Không có sinh viên nào được phân bổ.</div>
      ) : (
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.fullName}</td>
                <td>{student.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentList;
