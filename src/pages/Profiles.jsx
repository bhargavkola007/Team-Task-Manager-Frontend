import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

import "../styles/layout.css";
import "../styles/Profiles.css";

const Profiles = () => {
  const { user } = useAuth();

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <h1>Profile</h1>

          <div className="profile-card">
            {/* Avatar + name */}
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {getInitials(user?.fullName || user?.name)}
              </div>
              <div className="profile-avatar-info">
                <h2>{user?.fullName || user?.name || "N/A"}</h2>
                <span className={`profile-role-badge ${user?.role === "ADMIN" ? "admin" : ""}`}>
                  {user?.role || "Member"}
                </span>
              </div>
            </div>

            {/* Info rows */}
            <div className="profile-info-row">
              <span className="profile-info-label">Full Name</span>
              <span className="profile-info-value">{user?.fullName || user?.name || "N/A"}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Email</span>
              <span className="profile-info-value">{user?.email}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Role</span>
              <span className="profile-info-value">{user?.role}</span>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Profiles;