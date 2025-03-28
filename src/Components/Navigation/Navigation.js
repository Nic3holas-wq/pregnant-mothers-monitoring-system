import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import theme from '../../utils/theme';
import { auth, signOut } from '../../firebaseConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import config from '../../utils/config';
const Navigation = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    setUser(currentUser);
    fetchUserData();

    const fetchUnreadMessages = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (!currentUser || !currentUser.email) {
          console.error("No user email found.");
          return;
        }
    
        const response = await fetch(
          `${config.API_BASE_URL}/messages/unread?email=${encodeURIComponent(currentUser.email)}`
        );
        const data = await response.json();
    
        setUnreadCount(data.count || 0); // Ensure default to 0
    
        // Store both count and messages in localStorage
        localStorage.setItem("newMessages", data.count || 0);
        localStorage.setItem("unreadMessages", JSON.stringify(data.messages || []));
      } catch (error) {
        console.error("Error fetching unread messages:", error);
      }
    };
    
    

    fetchUnreadMessages(); // Fetch immediately

    // Poll every 10 seconds
    const interval = setInterval(fetchUnreadMessages, 10000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const fetchUserData = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (!currentUser || !currentUser.email) {
        console.error("No user found in localStorage.");
        return;
      }
  
      const res = await axios.get(`${config.API_BASE_URL}/api/getuserdata`, {
        params: { email: currentUser.email },
      });
  
      if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data));
        //toast.success("User data loaded successfully!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      //toast.error("Failed to load user data.");
    }
  };

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
      <nav className="navbar navbar-expand-lg py-3" style={{ background: theme.primary, position: 'fixed', top: 0, width: '100%', zIndex: 100000 }}>
        <div className="container-fluid">
          
          {/* Navbar Toggler for OffCanvas */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <p className="text-center h5 text-white">Welcome {user?.username || "Guest"}!</p>

          {/* OffCanvas Sidebar */}
          <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasNavbar">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title text-primary">Menu</h5>
              <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
              
              <ul className="navbar-nav ms-auto">
                <li className="nav-item pb-2">
                  <NavLink to="/home" className={({ isActive }) => isActive ? "h5 text-secondary fw-bold text-decoration-none mx-3" : " text-dark text-decoration-none mx-3"}>
                    Home
                  </NavLink>
                </li>
                <li className="nav-item pb-2">
                  <NavLink to="/appointment" className={({ isActive }) => isActive ? "h5 text-secondary fw-bold text-decoration-none mx-3" : " text-dark text-decoration-none mx-3"}>
                    Appointment
                  </NavLink>
                </li>
                <li className="nav-item pb-2">
                  <NavLink to="/insights" className={({ isActive }) => isActive ? "h5 text-secondary fw-bold text-decoration-none mx-3" : " text-dark text-decoration-none mx-3"}>
                    Insights
                  </NavLink>
                </li>
                <li className="nav-item pb-2">
                  <NavLink to="/trackhealth" className={({ isActive }) => isActive ? "h5 text-secondary fw-bold text-decoration-none mx-3" : " text-dark text-decoration-none mx-3"}>
                    Track Health
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/chat" className="h5 text-dark text-decoration-none mx-3 d-flex align-items-center position-relative">
                    <span className="material-icons me-2">chat</span>
                    {unreadCount > 0 && (
                      <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                        {unreadCount}
                      </span>
                    )}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/notification" className="h5 text-dark text-decoration-none mx-3 d-flex align-items-center position-relative">
                    <span className="material-icons me-2">notifications</span>
                    {unreadCount > 0 && (
                      <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                        {unreadCount}
                      </span>
                    )}
                  </NavLink>
                </li>
                {user && (
                  <li className="nav-item">
                    <button className="btn btn-danger d-flex align-items-center px-3 mt-3" onClick={handleLogout}>
                      <span>Logout</span>
                      <span className="material-icons ms-2">logout</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>

        </div>
      </nav>
    </>
  );
};

export default Navigation;
