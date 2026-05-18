import API from "../api/axiosConfig";

export const getAllTasks = async () => {
  const response = await API.get("/tasks");
  return response.data;
};

export const getTasksByProject = async (projectId) => {
  const response = await API.get(`/tasks?projectId=${projectId}`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await API.post("/tasks", taskData);
  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await API.patch(`/tasks/${taskId}/status`, { status });
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await API.delete(`/tasks/${taskId}`);
  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await API.put(`/tasks/${taskId}`, taskData);
  return response.data;
};