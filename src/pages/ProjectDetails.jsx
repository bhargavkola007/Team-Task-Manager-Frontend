import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import {
  getProjectById,
  addMemberToProject,
} from "../services/projectService";

import {
  getTasksByProject,
  updateTaskStatus,
} from "../services/taskService";

import { getAllUsers } from "../services/userService";

import "../styles/layout.css";
import "../styles/ProjectDetails.css";

const ProjectDetails = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const loadProjectDetails = async () => {
    try {
      const projectData = await getProjectById(id);
      const taskData = await getTasksByProject(id);
      const usersData = await getAllUsers();

      setProject(projectData);
      setTasks(taskData);
      setUsers(usersData);
    } catch {
      toast.error("Failed to load project details");
    }
  };

  useEffect(() => {
    loadProjectDetails();
  }, [id]);

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      toast.success("Task status updated");
      loadProjectDetails();
    } catch {
      toast.error("Failed to update task status");
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser) {
      toast.error("Please select a member");
      return;
    }

    try {
      await addMemberToProject(id, selectedUser);
      toast.success("Member added successfully");
      setSelectedUser("");
      loadProjectDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add member");
    }
  };

  return (
    <>
      <Navbar />

      <div className="layout">
        <Sidebar />

        <main className="main-content">
          <h1>Project Details</h1>

          {project && (
            <div className="project-info-card">
              <h2>{project.name}</h2>
              <p>{project.description}</p>

              <div className="project-meta">
                <div className="project-meta-item">
                  <span className="project-meta-label">Created By</span>
                  <span className="project-meta-value">
                    {project.createdBy}
                  </span>
                </div>

                <div className="project-meta-item">
                  <span className="project-meta-label">Members</span>
                  <span className="project-meta-value">
                    {project.members?.length > 0
                      ? project.members.join(", ")
                      : "No members"}
                  </span>
                </div>
              </div>

              <div className="add-member-box">
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">Select Member</option>

                  {users
                    .filter((user) => user.role === "MEMBER")
                    .filter((user) => !project.members?.includes(user.fullName))
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.fullName} - {user.email}
                      </option>
                    ))}
                </select>

                <button type="button" onClick={handleAddMember}>
                  Add Member
                </button>
              </div>
            </div>
          )}

          <div className="table-card">
            <h2>Project Tasks</h2>

            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Assigned To</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan="5">No tasks found for this project</td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.title}</td>
                      <td>{task.description}</td>
                      <td>{task.assignedTo}</td>
                      <td>
                        <span className={`priority-badge ${task.priority}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        <select
                          className="status-select"
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(task.id, e.target.value)
                          }
                        >
                          <option value="TODO">TODO</option>
                          <option value="IN_PROGRESS">IN PROGRESS</option>
                          <option value="COMPLETED">COMPLETED</option>
                        </select>
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

export default ProjectDetails;