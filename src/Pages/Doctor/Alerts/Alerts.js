import React, { useState, useEffect } from "react";
import NavPanel from "../../../Components/Doctor/NavPanel/NavPanel";

const Alerts = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, message: "New appointment scheduled by John Doe", type: "appointment", time: "Just now", read: false },
    { id: 2, message: "Your 2 PM appointment was cancelled", type: "cancelled", time: "10 mins ago", read: false },
    { id: 3, message: "Mark Wilson sent you a message", type: "message", time: "1 hour ago", read: true },
  ]);

  // Function to mark an alert as read
  const markAsRead = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  // Function to clear all alerts
  const clearAllAlerts = () => {
    setAlerts([]);
  };

  // Function to get icon and color based on alert type
  const getAlertStyle = (type) => {
    switch (type) {
      case "appointment":
        return { icon: "event_available", color: "success" };
      case "cancelled":
        return { icon: "event_busy", color: "danger" };
      case "message":
        return { icon: "chat", color: "info" };
      default:
        return { icon: "notifications", color: "primary" };
    }
  };

  return (
    <div>
      <NavPanel />
      <div className="container mt-5 pt-4">
        <h2 className="text-center my-3">🔔 Alerts & Notifications</h2>

        {alerts.length === 0 ? (
          <p className="text-center text-muted">No new alerts.</p>
        ) : (
          <div className="list-group">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`list-group-item list-group-item-${getAlertStyle(alert.type).color} d-flex justify-content-between align-items-center`}
                style={{ cursor: "pointer" }}
                onClick={() => markAsRead(alert.id)}
              >
                <div>
                  <span className="material-icons me-2">{getAlertStyle(alert.type).icon}</span>
                  {alert.message}
                </div>
                <small className="text-muted">{alert.time}</small>
              </div>
            ))}
          </div>
        )}

        {alerts.length > 0 && (
          <div className="text-center mt-3">
            <button className="btn btn-danger" onClick={clearAllAlerts}>
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
