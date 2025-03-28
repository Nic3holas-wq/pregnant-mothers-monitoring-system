import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavPanel from '../../../Components/Doctor/NavPanel/NavPanel';

const Dashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [stats, setStats] = useState({ totalPatients: 0, totalAppointments: 0, pendingRequests: 0, totalMessages: 0 });
  const [recentPatients, setRecentPatients] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedDoctor = localStorage.getItem("doctor");
    if (storedDoctor) {
      const parsedDoctor = JSON.parse(storedDoctor);
      setDoctor(parsedDoctor);
      fetchDashboardData(parsedDoctor.email);
    }
  }, []);

  const fetchDashboardData = async (doctorEmail) => {
    try {
      // Fetch statistics
      const statsResponse = await axios.get(`http://10.42.0.1:5000/api/doctor-dashboard-stats?doctor=${doctorEmail}`);
      setStats(statsResponse.data);

      // Fetch recent patients
      const patientsResponse = await axios.get(`http://10.42.0.1:5000/api/recent-patients?doctor=${doctorEmail}`);
      setRecentPatients(patientsResponse.data);

      // Fetch upcoming confirmed appointments
      const appointmentsResponse = await axios.get(`http://10.42.0.1:5000/api/getdocappointments?doctor=${doctorEmail}`);
      const confirmedAppointments = appointmentsResponse.data.filter(appt => appt.status === "Confirmed");
      setUpcomingAppointments(confirmedAppointments);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <div>
      <NavPanel />
      <div className="container mt-2">
        {/* Dashboard Header */}
        <h2 className="my-4 text-primary">Doctor's Dashboard</h2>

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
            <div className="card bg-danger text-white text-center p-3">
              <h5>Total Messages</h5>
              <h3>{stats.totalMessages}</h3>
            </div>
          </div>
        </div>

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
