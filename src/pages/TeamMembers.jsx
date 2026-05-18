import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { updateUser } from "../services/userService";
import { getAllUsers, deleteUser } from "../services/userService";

import "../styles/layout.css";
import "../styles/TeamMembers.css";

// Helper: get initials from full name
const getInitials = (name) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

const TeamMembers = () => {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);


const handleMakeAdmin = async (user) => {
  const confirmAction = window.confirm(
    `Make ${user.fullName} an admin?`
  );

  if (!confirmAction) return;

  try {
    await updateUser(user.id, {
      fullName: user.fullName,
      role: "ADMIN",
    });

    toast.success("User promoted to admin");

    loadUsers();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Failed to promote user"
    );
  }
};
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted");
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <h1>Team Members</h1>

          <div className="table-card">
            <h2>All Members</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5">No users found</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <span className="id-cell">#{user.id}</span>
                      </td>
                      <td>
                        <div className="member-cell">
                          <div className="member-avatar-sm">
                            {getInitials(user.fullName)}
                          </div>
                          <span className="member-name">{user.fullName}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        {user.role !== "ADMIN" && (
                          <button
                            onClick={() => handleMakeAdmin(user)}
                            style={{ marginRight: "10px" }}
                          >
                            Make Admin
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
};

export default TeamMembers;