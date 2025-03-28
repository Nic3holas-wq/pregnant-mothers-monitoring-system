import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Account = ({ show, onClose }) => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
    useEffect(() => {
      const storedDoctor = localStorage.getItem("doctor");
      if (storedDoctor) {
        setDoctor(JSON.parse(storedDoctor));
      }
    }, []);

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
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Role:</strong> {doctor.role}</p>
          <p><strong>Specialization:</strong> {doctor.specialization}</p>
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
