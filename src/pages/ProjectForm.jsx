import { useState } from "react";
import toast from "react-hot-toast";
import { createProject } from "../services/projectService";

import "../styles/ProjectForm.css";

const ProjectForm = ({ onProjectCreated }) => {
  const [project, setProject] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProject(project);
      toast.success("Project created successfully");
      setProject({ name: "", description: "" });
      onProjectCreated();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h2>Create Project</h2>

      <input
        type="text"
        name="name"
        placeholder="Project Name"
        value={project.name}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Project Description (optional)"
        value={project.description}
        onChange={handleChange}
      />

      <button type="submit">Create Project</button>
    </form>
  );
};

export default ProjectForm;