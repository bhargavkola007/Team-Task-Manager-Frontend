import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskForm from "./TaskForm";

import {
  deleteTask,
  getAllTasks,
  updateTaskStatus,
} from "../services/taskService";

import { useAuth } from "../context/AuthContext";

import "../styles/layout.css";
import "../styles/Tasks.css";

const Tasks = () => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const loadTasks = async () => {
    try {
      const data = await getAllTasks();
      setTasks(data);
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      toast.success("Task status updated");
      loadTasks();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(taskId);
      toast.success("Task deleted");
      loadTasks();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const textMatch =
      task.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchText.toLowerCase()) ||
      task.assignedTo?.toLowerCase().includes(searchText.toLowerCase()) ||
      task.projectName?.toLowerCase().includes(searchText.toLowerCase());

    const statusMatch = statusFilter === "ALL" || task.status === statusFilter;
    const priorityMatch = priorityFilter === "ALL" || task.priority === priorityFilter;

    return textMatch && statusMatch && priorityMatch;
  });

  const getPriorityClass = (priority) => {
    if (priority === "HIGH") return "priority-high";
    if (priority === "MEDIUM") return "priority-medium";
    return "priority-low";
  };

  const getStatusClass = (status) => {
    if (status === "COMPLETED") return "status-completed status-badge";
    if (status === "IN_PROGRESS") return "status-progress status-badge";
    return "status-todo status-badge";
  };

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <h1>Tasks</h1>

          {user?.role === "ADMIN" && <TaskForm onTaskCreated={loadTasks} />}

          {/* Filter bar */}
          <div className="filter-card">
            <input
              type="text"
              placeholder="Search by title, description, or member…"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="ALL">All Status</option>
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="ALL">All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {/* Tasks table */}
          <div className="table-card">
            <h2>All Tasks</h2>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Project</th>
                  <th>Assigned To</th>
                  <th>Priority</th>
                  <th>Status</th>
                  {user?.role === "ADMIN" && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={user?.role === "ADMIN" ? 7 : 6}>No tasks found</td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.title}</td>
                      <td>{task.description}</td>
                      <td>{task.projectName || task.projectId}</td>
                      <td>{task.assignedToName || task.assignedToEmail || task.assignedTo}</td>
                      <td>
                        <span className={getPriorityClass(task.priority)}>
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        <select
                          className={getStatusClass(task.status)}
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        >
                          <option value="TODO">TODO</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </td>
                      {user?.role === "ADMIN" && (
                        <td>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(task.id)}
                          >
                            Delete
                          </button>
                        </td>
                      )}
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

export default Tasks;