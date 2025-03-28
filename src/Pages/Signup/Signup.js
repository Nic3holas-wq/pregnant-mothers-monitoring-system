import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DoctorSignupModal from "./DoctorSignupModal";  // Import the doctor signup modal
import './Signup.css'
import config from '../../utils/config';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    role: 'mother',
  });

  const [showDoctorSignup, setShowDoctorSignup] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || `${config.API_BASE_URL}`;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      navigate("/home");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Signup failed!");

      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Signup successful!", { position: "top-center" });
      navigate("/");
    } catch (error) {
      toast.error(`Signup failed: ${error.message}`, { position: "top-center" });
    }
  };

  return (
    <div className={`d-flex justify-content-center align-items-center vh-100`}>
      <div className={`card ${showDoctorSignup ? 'blur-background' : ''}`} style={{ width: "350px" }}>
        <div className="card-body text-center">
          <h5 className="card-title">Create an Account</h5>
          <form onSubmit={handleSubmit}>
          <div className="mb-3 form-floating">
              <input type="text" className="form-control" name="username"
                value={formData.username} onChange={handleChange} required />
              <label>Username</label>
            </div>

            <div className="mb-3 form-floating">
              <input type="email" className="form-control" name="email"
                value={formData.email} onChange={handleChange} required />
              <label>Email</label>
            </div>

            <div className="mb-3 form-floating">
              <input type="tel" className="form-control" name="phone"
                value={formData.phone} onChange={handleChange} required />
              <label>Phone number</label>
            </div>

            <div className="mb-3 form-floating">
              <input type="password" className="form-control" name="password"
                value={formData.password} onChange={handleChange} required />
              <label>Password</label>
            </div>

            <button type="submit" className="btn btn-primary w-100">Submit</button>
          </form>

          <Link to="/" className="text-primary text-decoration-none d-block mt-3">Have an account? Sign in</Link>

          <button className="btn btn-link text-primary mt-2" onClick={() => setShowDoctorSignup(true)}>
            Are you a doctor? Sign up here
          </button>
        </div>
      </div>

      <DoctorSignupModal show={showDoctorSignup} onClose={() => setShowDoctorSignup(false)} />
      <ToastContainer />
    </div>
  );
};

export default Signup;
