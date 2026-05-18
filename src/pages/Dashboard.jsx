import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getDashboard } from "../services/dashboardService";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

import "../styles/layout.css";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
  });

  const loadDashboardStats = async () => {
    try {
      const data = await getDashboard();
      setStats({
        totalProjects: data.totalProjects,
        totalTasks: data.totalTasks,
        todoTasks: data.pendingTasks,
        inProgressTasks: data.inProgressTasks,
        completedTasks: data.completedTasks,
      });
    } catch (error) {
      toast.error("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <h1>Dashboard</h1>

          {/* Welcome banner */}
          <div className="dashboard-welcome">
            <div>
              <h2>Welcome back, {user?.fullName?.split(" ")[0] || "there"} 👋</h2>
              <p>Here's what's happening with your projects today.</p>
            </div>
            <span className="dashboard-welcome-badge">
              {user?.role || "Member"}
            </span>
          </div>

          <p className="dashboard-section-label">Overview</p>

          {/* Stats cards */}
          <div className="cards dashboard-cards">
            <div className="card">
              <h3>Total Projects</h3>
              <p>{stats.totalProjects}</p>
            </div>
            <div className="card">
              <h3>Total Tasks</h3>
              <p>{stats.totalTasks}</p>
            </div>
            <div className="card">
              <h3>TODO</h3>
              <p>{stats.todoTasks}</p>
            </div>
            <div className="card">
              <h3>In Progress</h3>
              <p>{stats.inProgressTasks}</p>
            </div>
            <div className="card">
              <h3>Completed</h3>
              <p>{stats.completedTasks}</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;