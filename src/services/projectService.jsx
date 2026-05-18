import API from "../api/axiosConfig";

export const getAllProjects = async () => {
  const response = await API.get("/projects");
  return response.data;
};

export const getProjectById = async (id) => {
  const response = await API.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (projectData) => {
  const response = await API.post("/projects", projectData);
  return response.data;
};

export const updateProject = async (id, projectData) => {
  const response = await API.put(`/projects/${id}`, projectData);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await API.delete(`/projects/${id}`);
  return response.data;
};

export const addMemberToProject = async (projectId, userId) => {
  const response = await API.post(`/projects/${projectId}/members/${userId}`);
  return response.data;
};