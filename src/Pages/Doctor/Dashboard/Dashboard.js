import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavPanel from '../../../Components/Doctor/NavPanel/NavPanel';
import io from "socket.io-client";
import { Modal, Button } from 'react-bootstrap';
import notificationSound from "../../../assests/alarm.mp3"; // Import MP3 file
import config from '../../../utils/config';

const socket = io(`${config.API_BASE_URL}`); // Connect to Flask backend
const Dashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [stats, setStats] = useState({ totalPatients: 0, totalAppointments: 0, pendingRequests: 0, totalMessages: 0 });
  const [recentPatients, setRecentPatients] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const audioRef = useRef(new Audio(notificationSound));


  useEffect(() => {
    const storedDoctor = localStorage.getItem("doctor");
    if (storedDoctor) {
      const parsedDoctor = JSON.parse(storedDoctor);
      setDoctor(parsedDoctor);
      fetchDashboardData(parsedDoctor.email);
    }
  }, []);

  useEffect(() => {
    audioRef.current.load();
    // Fetch existing alerts when the component mounts
    const fetchAlerts = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/emergency-alerts`);
        const data = await response.json();
        setAlerts(data);
      } catch (error) {
        console.error("Error fetching emergency alerts:", error);
      }
    };

    fetchAlerts();

    // Listen for real-time emergency alerts
    socket.on("new_alert", (alert) => {
      setAlerts((prevAlerts) => [alert, ...prevAlerts]); 
      setSelectedAlert(alert); 
      setShowModal(true); 
    
      audioRef.current.play().catch((error) => console.log("Audio playback failed:", error));
    });

    return () => {
      socket.off("new_alert"); // Clean up socket listener
    };
  }, []);

  const fetchDashboardData = async (doctorEmail) => {
    try {
      // Fetch statistics
      const statsResponse = await axios.get(`${config.API_BASE_URL}/api/doctor-dashboard-stats?doctor=${doctorEmail}`);
      setStats(statsResponse.data);

      // Fetch recent patients
      const patientsResponse = await axios.get(`${config.API_BASE_URL}/api/recent-patients?doctor=${doctorEmail}`);
      setRecentPatients(patientsResponse.data);

      // Fetch upcoming confirmed appointments
      const appointmentsResponse = await axios.get(`${config.API_BASE_URL}/api/getdocappointments?doctor=${doctorEmail}`);
      const confirmedAppointments = appointmentsResponse.data.filter(appt => appt.status === "Confirmed");
      setUpcomingAppointments(confirmedAppointments);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAlert(null);
  };

  return (
    <div>
      <NavPanel />
      <div className="container mt-2">
        {/* Dashboard Header */}
        <h2 className="my-4 text-primary">Doctor's Dashboard</h2>

        {/* Overview Cards */}
        {/* Overview Cards */}
<div className="row">
  <div className="col-md-3">
    <div className="card bg-info text-white text-center p-3">
      <h5>Total Patients</h5>
      <h3>{stats.totalPatients}</h3>
    </div>
  </div>
  <div className="col-md-3">
    <div className="card bg-success text-white text-center p-3">
      <h5>Total Appointments</h5>
      <h3>{stats.totalAppointments}</h3>
    </div>
  </div>
  <div className="col-md-3">
    <div className="card bg-warning text-white text-center p-3">
      <h5>Pending Requests</h5>
      <h3>{stats.pendingRequests}</h3>
    </div>
  </div>
  <div className="col-md-3">
    <div className="card bg-secondary text-white text-center p-3">
      <h5>Total Messages</h5>
      <h3>{stats.totalMessages}</h3>
    </div>
  </div>
</div>

{/* Emergency Alerts Section */}
<div className="row mt-4">
  <div className="col-12">
    <div className="card bg-danger text-white p-3">
      <h4>Emergency Alerts!!!</h4>
      <div className="d-flex flex-row flex-wrap gap-3">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <div
              key={index}
              className="alert alert-light p-3 text-dark"
              onClick={() => handleAlertClick(alert)}
              style={{ cursor: "pointer", minWidth: "250px" }}
            >
              <p>
                <strong>Emergency Alert!</strong>
              </p>
              <p>Email: {alert.email}</p>
              <p>Time: {new Date(alert.timestamp).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p>No emergency alerts.</p>
        )}
      </div>
    </div>
  </div>
</div>


        {/* Emergency Alert Modal */}
        <Modal show={showModal} onHide={handleCloseModal} style={{zIndex:1000000}}>
          <Modal.Header closeButton>
            <Modal.Title>Emergency Alert Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAlert && (
              <>
                <p><strong>Email:</strong> {selectedAlert.email}</p>
                <p><strong>Time:</strong> {new Date(selectedAlert.timestamp).toLocaleString()}</p>
                <p><strong>Message:</strong> {selectedAlert.message || "No additional details provided."}</p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Recent Patients & Upcoming Appointments */}
        <div className="row mt-4">
          {/* Recent Patients */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5>Recent Patients</h5>
              </div>
              <div className="card-body">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Condition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPatients.length > 0 ? (
                      recentPatients.map((patient) => (
                        <tr key={patient._id}>
                          <td>{patient.name}</td>
                          <td>{patient.age}</td>
                          <td>{patient.condition}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-muted">No recent patients found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-secondary text-white">
                <h5>Upcoming Appointments</h5>
              </div>
              <div className="card-body">
                {upcomingAppointments.length > 0 ? (
                  <ul className="list-group">
                    {upcomingAppointments.map((appt) => (
                      <li key={appt._id} className="list-group-item">
                        <strong>{appt.from}</strong> - <span>{appt.time}, {appt.date}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No confirmed upcoming appointments.</p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
