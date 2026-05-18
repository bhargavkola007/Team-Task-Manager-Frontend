import API from "../api/axiosConfig";

export const getDashboard = async () => {
  const response = await API.get("/dashboard");
  return response.data;
};