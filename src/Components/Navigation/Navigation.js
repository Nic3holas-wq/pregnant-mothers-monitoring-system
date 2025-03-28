import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import theme from '../../utils/theme';
import { auth, signOut } from '../../firebaseConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"; 

const Navigation = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    setUser(currentUser);
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Ensure the user is available before making the request
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (!currentUser || !currentUser.email) {
        console.error("No user found in localStorage.");
        return;
      }
  
      const res = await axios.get("http://10.42.0.1:5000/api/getuserdata", {
        params: { email: currentUser.email }, // Send user email as a parameter
      });
  
      if (res.data) {
        // Store fetched user data in localStorage
        localStorage.setItem("user", JSON.stringify(res.data));
        toast.success("User data loaded successfully!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data.");
    }
  };
  
  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('user');
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
      <nav className="navbar navbar-expand-lg py-3" style={{ background: theme.primary, position:'fixed', top:0, width:'100%', zIndex:100000 }}>
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
          <p className="text-center mt-5 h5 text-white">Welcome {user?.username || "Guest"}!</p>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink to="/home" className={({ isActive }) => isActive ? "h5 text-secondary fw-bold text-decoration-none mx-3" : "h5 text-white text-decoration-none mx-3"}>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/appointment" className={({ isActive }) => isActive ? "h5 text-secondary fw-bold text-decoration-none mx-3" : "h5 text-white text-decoration-none mx-3"}>
                  Appointment
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/insights" className={({ isActive }) => isActive ? "h5 text-secondary fw-bold text-decoration-none mx-3" : "h5 text-white text-decoration-none mx-3"}>
                  Insights
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/trackhealth" className={({ isActive }) => isActive ? "h5 text-secondary fw-bold text-decoration-none mx-3" : "h5 text-white text-decoration-none mx-3"}>
                  Track Health
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/chat" className="h5 text-white text-decoration-none mx-3 d-flex align-items-center position-relative">
                    <span className="material-icons me-2">chat</span>
                    <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                        4
                    </span>
                    </NavLink>
                </li>

              <li className="nav-item">
                <NavLink to="/notification" className="h5 text-white text-decoration-none mx-3 d-flex align-items-center position-relative">
                  <span className="material-icons me-2" aria-label="Notifications">notifications</span>
                  <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                        1
                    </span>
                </NavLink>
              </li>
              {user && (
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
    </>
  );
};

export default Navigation;
