import React, { useState } from 'react';
import { toast } from "react-toastify";
import DoctorLoginModal from './DoctorLoginModal';  // Import the login modal
import './Signup.css';

const DoctorSignupModal = ({ show, onClose }) => {
  const [doctorData, setDoctorData] = useState({
    email: '',
    password: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    role: "doctor"
  });

  const [showLoginModal, setShowLoginModal] = useState(false); // State to show login modal

  const API_URL = process.env.REACT_APP_API_URL || "http://10.42.0.1:5000";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorData({
      ...doctorData,
      [name]: value
    });
  };

  const handleDoctorSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/doctor/signup`, {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorData)
      });
  
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.error || "Doctor signup failed!");
  
      toast.success("Doctor signup successful!", { position: "top-center" });

      onClose(); // Close signup modal
      setShowLoginModal(true); // Show login modal after signup
    } catch (error) {
      toast.error(`Signup failed: ${error.message}`, { position: "top-center" });
    }
  };

  return (
    <>
      {/* Background blur effect */}
      <div className={showLoginModal ? 'blur-background' : ''}>
        {/* Doctor Signup Modal */}
        {show && (
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog d-flex justify-content-center align-items-center vh-100">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Doctor Signup</h5>
                  <button type="button" className="btn-close" onClick={onClose}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleDoctorSignup}>
                    <div className="mb-3">
                      <input type="email" className="form-control" name="email"
                        value={doctorData.email} onChange={handleChange} required placeholder="Email" />
                    </div>

                    <div className="mb-3">
                      <input type="password" className="form-control" name="password"
                        value={doctorData.password} onChange={handleChange} required placeholder="Password" />
                    </div>

                    <div className="mb-3">
                      <input type="tel" className="form-control" name="phone"
                        value={doctorData.phone} onChange={handleChange} required placeholder="Phone Number" />
                    </div>

                    <div className="mb-3">
                      <input type="text" className="form-control" name="specialization"
                        value={doctorData.specialization} onChange={handleChange} required placeholder="Specialization" />
                    </div>

                    <div className="mb-3">
                      <input type="text" className="form-control" name="licenseNumber"
                        value={doctorData.licenseNumber} onChange={handleChange} required placeholder="License Number" />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                  </form>
                  <button className="btn btn-link text-primary mt-2" onClick={() => {
                    onClose(); // Close signup modal
                    setShowLoginModal(true); // Show login modal
                  }}>
                    Have an account? Login here
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Doctor Login Modal */}
      {showLoginModal && <DoctorLoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />}
    </>
  );
};

export default DoctorSignupModal;
