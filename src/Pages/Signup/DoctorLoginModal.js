import React, { useState } from 'react';
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import config from '../../utils/config';

const DoctorLoginModal = ({ show, onClose }) => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const API_URL = process.env.REACT_APP_API_URL || `${config.API_BASE_URL}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleDoctorLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/doctor/login`, {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Doctor login failed!");

      toast.success("Doctor login successful!", { position: "top-center" });
      localStorage.setItem("token", data.token);  // Store token for authentication
    localStorage.setItem("doctor", JSON.stringify(data.doctor));

    toast.success(`Welcome, ${data.token}!`, { position: "top-center", autoClose: 4000 });
      // onClose();
      navigate('/dashboard')
    } catch (error) {
      toast.error(`Login failed: ${error.message}`, { position: "top-center" });
    }
  };

  return (
    <div className={`modal ${show ? "d-block" : "d-none"}`} tabIndex="-1">
      <div className="modal-dialog d-flex justify-content-center align-items-center vh-100">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Doctor Login</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleDoctorLogin}>
              <div className="mb-3">
                <input type="email" className="form-control" name="email"
                  value={loginData.email} onChange={handleChange} required placeholder="Email" />
              </div>

              <div className="mb-3">
                <input type="password" className="form-control" name="password"
                  value={loginData.password} onChange={handleChange} required placeholder="Password" />
              </div>

              <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLoginModal;
