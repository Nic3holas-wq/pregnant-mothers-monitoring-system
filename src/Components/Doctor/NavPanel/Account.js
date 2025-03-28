import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; 

const Account = ({ show, onClose }) => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
    useEffect(() => {
      const storedDoctor = localStorage.getItem("doctor");
      if (storedDoctor) {
        setDoctor(JSON.parse(storedDoctor));
        fetchUserData();
      }
    }, []);

    const fetchUserData = async () => {
      try {
        // Ensure the user is available before making the request
        const currentUser = JSON.parse(localStorage.getItem("doctor"));
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

  return (
    <div className={`modal ${show ? "d-block" : "d-none"}`} tabIndex="-1">
      <div className="modal-dialog d-flex justify-content-center align-items-center vh-100">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Doctors Information</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
          {doctor ? (
        <div>
          <p><strong>Name:</strong> {doctor.username}</p>
          <p><strong>Role:</strong> {doctor.role}</p>
          <p><strong>Specialization:</strong> {doctor.specialization}</p>
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Phone:</strong> {doctor.phone}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
