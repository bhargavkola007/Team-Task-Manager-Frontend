import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { signupUser } from "../services/authService";

import "../styles/Auth.css";

const Signup = () => {
  const navigate = useNavigate();
const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  password: "",
});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signupUser(formData);
      toast.success("Signup Successful");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup Failed");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Create <span>account</span></h2>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Create Password"
          onChange={handleChange}
          required
        />

        <button type="submit">Get Started</button>

        <p>
          Already have an account?{" "}
          <Link to="/">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;