import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Account from './Account';
import axios from 'axios';
import config from '../../../utils/config';
const NavPanel = () => {
  const [doctor, setDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedDoctor = localStorage.getItem("doctor");
    if (storedDoctor) {
      const parsedDoctor = JSON.parse(storedDoctor);
      setDoctor(parsedDoctor);
      console.log("Doctor:", parsedDoctor.email)
      // Send update to backend that doctor is online
      updateDoctorStatus(parsedDoctor.email, "online");

    } else {
      navigate("/"); // Redirect if doctor is not logged in
    }

    // Set doctor offline when they leave the dashboard
    
  }, []);

  // Function to update doctor status in backend
  const updateDoctorStatus = async (doctorEmail, status) => {
    try {
      await axios.post(`${config.API_BASE_URL}/update_status`, {
        doctor_email: doctorEmail,
        status: status,
      });
      // toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      // toast.error("Failed to update status.");
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      const doctorEmail = doctor.email;
      console.log("Email:", doctorEmail)
      updateDoctorStatus(doctorEmail, "offline");
      setDoctor(null);
      localStorage.removeItem('doctor');
      toast.info('You have been logged out!', {
        position: 'top-center',
        autoClose: 2000,
        theme: 'colored',
      });
  
      setTimeout(() => {
        navigate('/');
      }, 2500);
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };
  

  return (
    <>
      <ToastContainer />
      <nav className="navbar navbar-expand-lg py-3 bg-primary" style={{ position:'fixed', top:0, width:'100%', zIndex:10000 }}>
        <div className="container-fluid">
          {/* Navbar Toggler for Mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Links */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? "h5 text-secondary fw-bold text-decoration-none mx-3" : "h5 text-white text-decoration-none mx-3"}>
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/patientsappointment" className={({ isActive }) => isActive ? "h5 text-secondary fw-bold text-decoration-none mx-3" : "h5 text-white text-decoration-none mx-3"}>
                  Appointments
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/messages" className="h5 text-white text-decoration-none mx-3 d-flex align-items-center position-relative">
                  <span className="material-icons me-2">chat</span>
                  <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                    4
                  </span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/alerts" className="h5 text-white text-decoration-none mx-3 d-flex align-items-center position-relative">
                  <span className="material-icons me-2" aria-label="Notifications">notifications</span>
                  <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                    1
                  </span>
                </NavLink>
              </li>

              {/* Person Icon - Opens Modal */}
              <li className="nav-item" onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>
                <span className="material-icons me-2 text-white" aria-label="Person">person</span>
              </li>

              {/* Logout Button */}
              {doctor && (
                <li className="nav-item ms-3">
                  <button className="btn btn-danger d-flex align-items-center px-3" onClick={handleLogout}>
                    <span>Logout</span>
                    <span className="material-icons ms-2">logout</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Modal Component */}
      {showModal && <Account show={showModal} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default NavPanel;
