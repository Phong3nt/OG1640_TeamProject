import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
  });

  const usersPerPage = 10;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "staff") {
      navigate("/login");
    } else {
      fetchUsers();
    }
  }, [navigate, user]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/all");
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE",
    });
    fetchUsers();
  };

  const handleRoleChange = async (id, newRole) => {
    await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    fetchUsers();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Add user failed");
      await fetchUsers();
      setFormData({ fullName: "", email: "", password: "", role: "student" });
      setShowForm(false);
    } catch (err) {
      setError("Could not add user");
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="user-management">
      <h2>User Management</h2>
      {error && <p className="error">{error}</p>}

      <button className="create-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Create"}
      </button>

      {showForm && (
        <form className="user-form" onSubmit={handleAddUser}>
          <h3>Add User</h3>
          <input
            type="text"
            name="fullName"
            value={formData.fullName || ""}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password || ""}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="tutor">Tutor</option>
            <option value="staff">Staff</option>
          </select>
          <button type="submit" className="submit-btn">Add User</button>
        </form>
      )}

      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((u) => (
              <tr key={u._id}>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                  >
                    <option value="student">Student</option>
                    <option value="tutor">Tutor</option>
                    <option value="staff">Staff</option>
                  </select>
                </td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(u._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
