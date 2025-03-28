import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import theme from "../../utils/theme";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://10.42.0.1:5000";
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        navigate("/home");
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      localStorage.removeItem("user"); // Remove invalid data
    }
  }, [navigate]);
  
  
  
  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // ✅ Prevent form refresh
  
    try {
      const response = await fetch(`${API_URL}/api/login`, {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials!");
      }
  
      // Store JWT token and user info
      console.log(data.token)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
  
      toast.success("Login successful!", { position: "top-center", autoClose: 2000 });
  
      // Redirect based on user role
      setTimeout(() => {
        if (data.user.role === "doctor") {
          navigate("/doctor-dashboard");
        } else {
          navigate("/home");
        }
      }, 2000);
    } catch (error) {
      toast.error(error.message, { position: "top-center", autoClose: 3000 });
    }
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <ToastContainer />
      <div className="card" style={{ width: "350px" }}>
        <div className="card-body text-center">
          <h4 className="card-title" style={{ color: theme.primary }}>
            Welcome back,
          </h4>
          <p className="card-text">Login to get started</p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3 mt-3 form-floating">
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="email">Email</label>
            </div>

            <div className="mb-3 form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label htmlFor="password">Password</label>
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="remember"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="remember">
                Remember me
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Submit
            </button>
            <Link to="/signup" className="text-primary text-decoration-none">
              Create an account
            </Link>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
