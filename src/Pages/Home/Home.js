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
  const [newMessages, setNewMessages] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState([])
  // Fetch user from local storage
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const unread = Number(localStorage.getItem("newMessages")) || 0;
    console.log("Unread:", unread)
    if (currentUser) {
      setUser(currentUser);
      setNewMessages(unread)
    }
  }, []);

  useEffect(() => {
    const unread = Number(localStorage.getItem("newMessages")) || 0;
    const unreadMessages = JSON.parse(localStorage.getItem("unreadMessages")) || [];
    setUnreadMessages(unreadMessages)
    console.log("Unread Messages:", unreadMessages);
    console.log("Unread Count:", unread);
  
    // Update state only if the unread count is different
    if (unread !== newMessages) {
      setNewMessages(unread);
    }
  }, []); // Run only on mount
  

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

  // Emergency contact
  const handleEmergencyCall = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (!currentUser || !currentUser.email) {
        alert("User not found! Please log in.");
        return;
      }
  
      const response = await fetch("http://10.42.0.1:5000/emergency-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUser.email, timestamp: new Date() }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Emergency alert sent successfully!");
        toast.success("Emergency alert sent successfully!");
      } else {
        alert(`Error: ${data.error}`);
        toast.error("Failed to send emergency alert. Please try again")
      }
    } catch (error) {
      console.error("Error sending emergency alert:", error);
      alert("Failed to send emergency alert.");
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
          backgroundAttachment:"fixed", // Fix for mobile scrolling
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
{/* Emergency Action */}
<div
  className="card p-3 bg-danger text-white text-center d-flex justify-content-center align-items-center"
  style={{ cursor: "pointer" }}
  onClick={handleEmergencyCall}
>
  <h3>Emergency Call!</h3>
  <p className="h5">Press Here To Connect to any Available doctor</p>
</div>


{/* Messages from Doctor */}
<div className="card p-3 mb-3">
  <h4>Messages from Your Doctor</h4>

  {newMessages > 0 ? (
  <>
    <p className="text-success h4">{newMessages} new messages.</p>
    {unreadMessages.map((msg, index) => (
      <div key={index} className="bg-primary rounded text-white mb-2 p-1">
        <small className="h6">{msg.message}</small>
        <small className="ms-4 text-muted">From: {msg.sender}</small>
      </div>
    ))}
  </>
) : (
  <p className="text-muted">You have no new messages.</p>
)}

 
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
  <p className="h4">Did you know that</p>
  <p>Marijuana has 500 different chemicals that can pass through the placenta and affect baby?</p>
  <p>The unborn baby can suck their thumb (you might even get to see this on screen during the 20-week anatomy scan). </p>
</div>
</div>
      </div>

      
    </div>
  );
};

export default Home;
