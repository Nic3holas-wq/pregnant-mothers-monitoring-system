import React, { useState } from 'react';
import Navigation from '../../Components/Navigation/Navigation';
import { Modal, Button } from 'react-bootstrap';

const initialNotifications = [
  {
    id: 1,
    title: "Doctor's Appointment Reminder",
    message: "You have an appointment with Dr. Jane Doe on March 28, 2025, at 10:00 AM.",
    time: "2 hours ago",
  },
  {
    id: 2,
    title: "New Health Tip",
    message: "Stay hydrated and eat iron-rich foods to maintain energy during pregnancy.",
    time: "1 day ago",
  },
  {
    id: 3,
    title: "Upcoming Vaccination Schedule",
    message: "Your next prenatal vaccination is scheduled for April 5, 2025.",
    time: "3 days ago",
  },
  {
    id: 4,
    title: "Check Your Medical Records",
    message: "Your latest test results are now available in the medical records section.",
    time: "5 days ago",
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showModal, setShowModal] = useState(true);

  // Remove a notification
  const removeNotification = (id) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);

    // If all notifications are removed, close the modal
    if (updatedNotifications.length === 0) {
      setShowModal(false);
    }
  };

  return (
    <div>
      <Navigation />

      {/* Notification Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {notifications.length === 0 ? (
            <p className="text-muted text-center">No new notifications.</p>
          ) : (
            <div className="list-group">
              {notifications.map((notification) => (
                <div key={notification.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">{notification.title}</h5>
                    <p className="mb-1 text-muted">{notification.message}</p>
                    <small className="text-primary">{notification.time}</small>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeNotification(notification.id)}
                  >
                    Dismiss
                  </button>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Notifications;
