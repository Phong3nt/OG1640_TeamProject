import React from "react";

const AssignList = ({ allocations }) => {
  return (
    <div className="assign-list">
      <h3>Danh sách Gán Tutor</h3>
      <table>
        <thead>
          <tr>
            <th>Staff</th>
            <th>Tutor</th>
            <th>Student</th>
            <th>Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {allocations.map((alloc) => (
            <tr key={alloc._id}>
              <td>{alloc.staff.fullName}</td>
              <td>{alloc.tutor.fullName}</td>
              <td>{alloc.student.fullName}</td>
              <td>
                {alloc.status === "active"
                  ? "Đang Hoạt Động"
                  : "Ngừng Hoạt Động"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignList;
