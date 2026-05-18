import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import "../styles/Navbar.css";

const getInitials = (name) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <span className="navbar-brand-dot" />
        Team Task <span>Manager</span>
      </div>

      {/* Right side */}
      <div className="navbar-actions">
        <div className="navbar-user">
          <div className="navbar-avatar">
            {getInitials(user?.fullName || user?.email)}
          </div>
          <span className="navbar-user-name">
            {user?.fullName || user?.email}
          </span>
        </div>

        <button className="navbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;