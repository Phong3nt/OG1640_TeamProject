import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

export const UserList = ({ role }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = useCallback(async () => {
    try {
      let url = "/api/users";
      if (role) url = `/api/users?role=${role}`;
      const response = await axios.get(url);
      setUsers(response.data);
    } catch (error) {
      console.error(`Error fetching ${role || "all"} users`, error);
    }
  }, [role]);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  return (
    <section>
      <h2>
        {role
          ? `${role.charAt(0).toUpperCase() + role.slice(1)} List`
          : "All Users"}
      </h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email} ({user.role})
          </li>
        ))}
      </ul>
    </section>
  );
};
