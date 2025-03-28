import React, { useEffect, useState } from "react";
import axios from "axios";
import NavPanel from "../../../Components/Doctor/NavPanel/NavPanel";
import { toast, ToastContainer } from "react-toastify";

const PatientsAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState(null);

  // Fetch appointments from the backend
  useEffect(() => {
    const storedDoctor = localStorage.getItem("doctor");
    if (storedDoctor) {
      const parsedDoctor = JSON.parse(storedDoctor);
      setDoctor(parsedDoctor);

      axios
        .get(`http://10.42.0.1:5000/api/getdocappointments?doctor=${parsedDoctor.email}`)
        .then((response) => {
          setAppointments(response.data);
        })
        .catch((error) => {
          console.error("Error fetching appointments:", error);
          toast.error("Failed to load appointments");
        });
    }
  }, []);

  // Function to update the status of an appointment
  const updateStatus = (id, newStatus) => {
    axios
      .post("http://10.42.0.1:5000/api/updateappointment", { id: id, status: newStatus }) // Send "id" instead of "_id"
      .then(() => {
        setAppointments((prevAppointments) =>
          prevAppointments.map((app) =>
            app._id === id ? { ...app, status: newStatus } : app
          )
        );
        toast.success("Appointment status updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        toast.error("Failed to update appointment status");
      });
};


  return (
    <div>
      <ToastContainer />
      <NavPanel />
      <div className="container mt-5 pt-5">
        <h2 className="my-4 text-primary">Patients' Appointments</h2>
        <div className="card">
          <div className="card-body">
            <table className="table table-striped">
              <thead className="bg-primary text-white">
                <tr>
                  <th>Patient Email</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{appointment.from}</td>
                      <td>{appointment.date}</td>
                      <td>{appointment.time}</td>
                      <td>{appointment.reason}</td>
                      <td>
                        <span
                          className={`badge ${
                            appointment.status === "Pending"
                              ? "bg-warning"
                              : appointment.status === "Confirmed"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td>
                        {appointment.status === "Pending" && (
                          <>
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => updateStatus(appointment._id, "Confirmed")}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-secondary btn-sm me-2"
                              onClick={() => updateStatus(appointment._id, "Rescheduled")}
                            >
                              Reschedule
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => updateStatus(appointment._id, "Cancelled")}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {appointment.status === "Rescheduled" && (
                          <span className="text-muted">Reschedule Pending</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientsAppointment;
