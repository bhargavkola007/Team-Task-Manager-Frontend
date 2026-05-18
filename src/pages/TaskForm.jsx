import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { createTask } from "../services/taskService";
import { getAllProjects } from "../services/projectService";
import { getAllUsers } from "../services/userService";

import "../styles/ProjectForm.css";
import "../styles/TaskForm.css";

const TaskForm = ({ onTaskCreated }) => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

 const [task, setTask] = useState({
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  projectId: "",
  assignedToId: "",
  dueDate: "",
});

  const loadData = async () => {
    try {
      const projectData = await getAllProjects();
      const userData = await getAllUsers();
      setProjects(projectData);
      setUsers(userData);
    } catch {
      toast.error("Failed to load projects/users");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask({
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  dueDate: task.dueDate || null,
  projectId: Number(task.projectId),
  assignedToId: Number(task.assignedToId),
});
      toast.success("Task created successfully");
      setTask({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
        projectId: "",
        assignedToId: "",
        dueDate: "",
      });
      onTaskCreated();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card task-form">
      <h2>Create Task</h2>

      <input
        type="text"
        name="title"
        placeholder="Task Title"
        value={task.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Task Description"
        value={task.description}
        onChange={handleChange}
      />

      {/* Project + Assignee row */}
      <div className="form-grid-2">
        <select name="projectId" value={task.projectId} onChange={handleChange} required>
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        <select name="assignedToId" value={task.assignedToId} onChange={handleChange} required>
          <option value="">Assign Member</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.fullName} — {u.email}
            </option>
          ))}
        </select>
      </div>

      {/* Priority + Due Date row */}
      <div className="form-grid-2">
        <select name="priority" value={task.priority} onChange={handleChange}>
          <option value="LOW">Low Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="HIGH">High Priority</option>
        </select>

        <input
  type="date"
  name="dueDate"
  value={task.dueDate}
  onChange={handleChange}
/>
      </div>

      <button type="submit">Create Task</button>
    </form>
  );
};

export default TaskForm;