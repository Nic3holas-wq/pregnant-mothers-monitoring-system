import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";  // Import axios for API calls
import "react-toastify/dist/ReactToastify.css";
import Navigation from "../../Components/Navigation/Navigation";
import config from "../../utils/config";

const Appointment = () => {
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [pastAppointments, setPastAppointments] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser) {
      setUser(currentUser);
    }
    fetchDoctors();
  }, []); // Runs only once when component mounts
  
  // Fetch appointments only when `user` is available
  useEffect(() => {
    if (user && user.email) {
      fetchAppointments();
    }
  }, [user]); // Runs when `user` changes
  
  // Fetch available doctors from Flask backend
  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${config.API_BASE_URL}/api/doctors`);
      setDoctors(res.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      //toast.error("Failed to load doctors.");
    }
  };

  // Fetch past appointments from Flask backend
  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${config.API_BASE_URL}/api/getappointments`, {
        params: { from: user.email },  // Send user.email as a query parameter
      });
      setPastAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      //toast.error("Failed to load appointments.");
    }
  };
  

  // Handle Appointment Booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor || !date || !time || !reason) {
      toast.error("Please fill in all fields!");
      return;
    }

    const newAppointment = {
      from: user.email,
      doctor: selectedDoctor,
      date,
      time,
      reason,
    };

    try {
      const res = await axios.post(`${config.API_BASE_URL}/api/appointments`, newAppointment);
      toast.success(res.data.message);
      fetchAppointments(); // Refresh past appointments after booking
      setSelectedDoctor("");
      setDate("");
      setTime("");
      setReason("");
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment. Please try again");
    }
  };

  return (
    <div>
      <Navigation />
      <ToastContainer />

      <div className="container pt-4" style={{marginTop:"100px"}}>
        <div className="row">
          
          {/* Left Sidebar - Past Appointments */}
          <div className="col-md-4">
            <div className="card shadow p-3">
              <h4 className="text-center">Past Appointments</h4>
              {pastAppointments.length === 0 ? (
                <p className="text-center text-muted">No past appointments</p>
              ) : (
                <ul className="list-group">
                  {pastAppointments.map((appt, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <p className="mb-0"><strong>{appt.doctor}</strong></p>
                        <small>{appt.date} at {appt.time}</small>
                      </div>
                      <span className={`badge ${
                            appt.status === "Pending"
                              ? "bg-warning"
                              : appt.status === "Confirmed"
                              ? "bg-success"
                              : "bg-danger"
                          }`}>
                        {appt.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right Side - Book New Appointment */}
          <div className="col-md-8">
            <div className="card p-4 shadow">
              <h2 className="text-center mb-4">Book an Appointment</h2>

              <form onSubmit={handleSubmit}>
                {/* Doctor Selection */}
                <div className="mb-3">
                  <label className="form-label">Select Doctor</label>
                  <select className="form-control" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
                    <option value="">-- Choose a Doctor --</option>
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.email}>
                        {doc.email} {doc.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Selection */}
                <div className="mb-3">
                  <label className="form-label">Select Date</label>
                  <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                {/* Time Selection */}
                <div className="mb-3">
                  <label className="form-label">Select Time</label>
                  <input type="time" className="form-control" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>

                {/* Reason for Appointment */}
                <div className="mb-3">
                  <label className="form-label">Reason for Appointment</label>
                  <textarea className="form-control" rows="3" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Describe your symptoms or reason for visit"></textarea>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-100">Book Appointment</button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Appointment;
