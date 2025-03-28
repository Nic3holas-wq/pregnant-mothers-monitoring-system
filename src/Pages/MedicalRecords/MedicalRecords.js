import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "../../Components/Navigation/Navigation";

const MedicalRecords = () => {
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);

  // Fetch user from local storage
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // Fetch medical records after user is set
  useEffect(() => {
    if (user && user.email) {
      fetchMedicalRecords();
    }
  }, [user]);  // Runs when `user` is set

  // Function to fetch medical records
  const fetchMedicalRecords = async () => {
    try {
      const res = await axios.get("http://10.42.0.1:5000/api/getmedicalrecords", {
        params: { email: user.email },  // Send user email as a query parameter
      });
      setRecords(res.data);
    } catch (error) {
      console.error("Error fetching medical records:", error);
      toast.error("Failed to load medical records.");
    }
  };

  return (
    <>
    <Navigation/>
    <div className="container mt-5 pt-4">
      <ToastContainer />
      <h2 className="text-center mb-4">🩺 Your Medical Records</h2>

      {records.length === 0 ? (
        <p className="text-muted text-center">No medical records found.</p>
      ) : (
        <ul className="list-group">
          {records.map((record, index) => (
            <li key={index} className="list-group-item">
              <strong>Date:</strong> {record.date} <br />
              <strong>Doctor:</strong> {record.doctor} <br />
              <strong>Diagnosis:</strong> {record.diagnosis} <br />
              <strong>Prescription:</strong> {record.prescription}
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
    
  );
};

export default MedicalRecords;
