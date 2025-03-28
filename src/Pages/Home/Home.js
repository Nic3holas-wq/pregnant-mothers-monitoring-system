import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "../../Components/Navigation/Navigation";
import axios from "axios";  

const Home = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  // Fetch user from local storage
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // Fetch appointments only when user is available
  useEffect(() => {
    if (user && user.email) {
      fetchAppointments();
    }
  }, [user]);  

  // Fetch upcoming appointments from Flask backend
  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://10.42.0.1:5000/api/getappointments", {
        params: { from: user.email },
      });
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments.");
    }
  };

  // Function to cancel an appointment
  const handleCancelAppointment = async (appointmentReason) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await axios.delete(`http://10.42.0.1:5000/api/deleteappointment/${appointmentReason}`);
      
      // Remove the deleted appointment from state
      setAppointments(appointments.filter((appt) => appt._id !== appointmentReason));

      toast.success("Appointment canceled successfully!");
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast.error("Failed to cancel appointment.");
    }
  };

  return (
    <div>
      <Navigation />
      <ToastContainer />

      <div
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // This keeps the background fixed
        minHeight: "100vh",
        marginTop: "100px",
      }}
      >
        <div className="container d-flex justify-content-center flex-wrap gap-3 pt-4" >

{/* Book Appointment Section */}
<div className="card p-3 mb-3 text-center bg-warning text-white">
  <h4>Need a Checkup?</h4>
  <p>Book an appointment with your doctor today!</p>
  <button className="btn btn-primary" onClick={() => navigate("/appointment")}>
    Book Appointment
  </button>
</div>

{/* Upcoming Appointments Section */}
<div className="card p-3 mb-3">
  <h4>Upcoming Appointments</h4>
  {appointments.filter(appt => appt.status === "Confirmed").length === 0 ? (
    <p className="text-muted">No upcoming appointments.</p>
  ) : (
    <ul className="list-group">
      {appointments
        .filter(appt => appt.status === "Confirmed") // Only show confirmed appointments
        .map((appt) => (
          <li key={appt._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              {appt.date} - {appt.time} with <strong>{appt.doctor}</strong>
              <p>{appt.reason}</p>
            </span>
            <button 
              className="btn btn-danger btn-sm"
              onClick={() => handleCancelAppointment(appt._id)} // Use _id for canceling
            >
              Cancel
            </button>
          </li>
        ))}
    </ul>
  )}
</div>


{/* Messages from Doctor */}
<div className="card p-3 mb-3">
  <h4>Messages from Your Doctor</h4>
  <p className="text-muted">You have no new messages.</p>
  <Link to="/chat" className="btn btn-secondary">View Messages</Link>
</div>

{/* Health Tips */}
<div className="card p-3 mb-3">
  <h4>Daily Health Tip</h4>
  <p>Stay hydrated and drink at least 8 glasses of water daily.</p>
</div>

{/* Medical Records Section */}
<div className="card p-3 mb-3 text-center">
  <h4>Your Medical Records</h4>
  <p>View past appointments and prescriptions.</p>
  <Link to="/medical-records" className="btn btn-info">View Records</Link>
</div>

<div className="card p-3 mb-3 text-center">
  <p className="h4">Did you know?</p>
  <p>Marijuana has 500 different chemicals that can pass through the placenta and affect baby?</p>
  <p>The unborn baby can suck their thumb (you might even get to see this on screen during the 20-week anatomy scan). </p>
</div>
</div>
      </div>

      
    </div>
  );
};

export default Home;
