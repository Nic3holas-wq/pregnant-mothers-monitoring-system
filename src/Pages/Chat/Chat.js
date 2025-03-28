import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { FaArrowLeft } from "react-icons/fa"; // Import back arrow icon
import Navigation from "../../Components/Navigation/Navigation";
import theme from "../../utils/theme";
import config from "../../utils/config";

const socket = io(`${config.API_BASE_URL}`);

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableDoctors, setAvailableDoctors] = useState([]);

  // Scroll to the bottom of chat
  useEffect(() => {
    const chatBox = document.querySelector(".chat-box");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, [messages, selectedDoctor]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser) {
      setUser(currentUser);
      socket.connect();
      socket.emit("join_room", { email: currentUser.email });
      console.log("Connected to socket and joined room", currentUser.email);
    }

    fetch(`${config.API_BASE_URL}/messages`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        const doctorMessages = data.reduce((acc, msg) => {
          if (
            msg.sender_role === "doctor" &&
            (msg.receiver === currentUser.email || msg.sender === currentUser.email)
          ) {
            const doctorKey = msg.sender === currentUser.email ? msg.receiver : msg.sender;
            if (!acc[doctorKey] || new Date(msg.timestamp) > new Date(acc[doctorKey].timestamp)) {
              acc[doctorKey] = { ...msg, sender: doctorKey };
            }
          }
          return acc;
        }, {});
        setDoctors(Object.values(doctorMessages));
      });

    fetch(`${config.API_BASE_URL}/api/doctors`)
      .then((res) => res.json())
      .then((data) => setAvailableDoctors(data));

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      setDoctors((prev) => {
        if (
          msg.sender_role === "doctor" &&
          (msg.receiver === currentUser.email || msg.sender === currentUser.email)
        ) {
          const doctorKey = msg.sender === currentUser.email ? msg.receiver : msg.sender;
          const existingDoctor = prev.find((d) => d.sender === doctorKey);
          if (!existingDoctor || new Date(msg.timestamp) > new Date(existingDoctor.timestamp)) {
            return [...prev.filter((d) => d.sender !== doctorKey), { ...msg, sender: doctorKey }];
          }
        }
        return prev;
      });
    });

    return () => {
      socket.off("message"); // Cleanup listener
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      fetch(`${config.API_BASE_URL}/messages/seen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: selectedDoctor, receiver: user.email }),
      });
    }
  }, [selectedDoctor, user]);

  const sendMessage = () => {
    if (input.trim() !== "" && user && selectedDoctor) {
      const messageData = {
        sender: user.email,
        receiver: selectedDoctor,
        message: input,
        timestamp: new Date().toISOString(),
      };

      socket.emit("message", messageData);
      setMessages((prev) => [...prev, messageData]);
      setInput("");
    }
  };

  return (
    <div>
      <Navigation />
      <div className="container" style={{ marginTop: "60px" }}>
        <div className="row">
          {/* Doctors List Panel */}
          <div className={`col-md-4 ${selectedDoctor ? "d-none d-md-block" : "d-block"}`}>
            <div className="doctors-list mt-5">
              <h4 className="text-secondary">Chats</h4>
              <ul className="list-group">
                {doctors.length > 0
                  ? doctors.map((doctor, index) => (
                      <>
                        <li
                          key={index}
                          className={`list-group-item ${selectedDoctor === doctor.sender ? "active" : ""}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => setSelectedDoctor(doctor.sender)}
                        >
                          <div className="d-flex align-items-center">
                            <img
                              src="/doctor.jpg"
                              alt="doctor"
                              className="rounded-circle me-2"
                              width={40}
                              height={40}
                            />
                            
                            <div className="d-flex flex-column">
                              <strong>{doctor.sender}</strong>
                              <small className="text-muted fs-6">
                                {doctor.message?.length > 25
                                  ? doctor.message.substring(0, 25) + "..."
                                  : doctor.message || "No messages yet"}
                              </small>
                            </div>
                          </div>
                          <small className="text-muted">{doctor.timestamp}</small>
                        </li>
                        <p className="text-secondary mt-3">More doctors</p>
                        {availableDoctors.map((doctor, index) => (
                          <li
                            key={index}
                            className={`list-group-item ${selectedDoctor === doctor.email ? "active" : ""}`}
                            style={{ cursor: "pointer" }}
                            onClick={() => setSelectedDoctor(doctor.email)}
                          >
                            <div className="d-flex align-items-center">
                              <div className="position-relative">
                                <img
                                  src="/doctor.jpg"
                                  alt="doctor"
                                  className="rounded-circle me-2"
                                  width={40}
                                  height={40}
                                />
                                
                                <span
                                  className={`rounded-circle d-inline-block position-absolute ${doctor.status === "online" ? "bg-success" : "bg-secondary"}`}
                                  style={{ width: "15px", height: "15px", top: "0", right: "0" }}
                                ></span>
                              </div>

                              <div className="d-flex flex-column ms-3">
                                <strong>{doctor.username}</strong>
                                <small className="text-muted">{doctor.phone}</small>
                                <small className="text-muted">{doctor.email}</small>
                                <small className="text-secondary">Start a conversation</small>
                              </div>
                            </div>
                          </li>
                        ))}
                      </>
                    ))
                  : availableDoctors.map((doctor, index) => (
                      <li
                        key={index}
                        className={`list-group-item ${selectedDoctor === doctor.email ? "active" : ""}`}
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedDoctor(doctor.email)}
                      >
                        <div className="d-flex align-items-center">
                          <img
                            src="/doctor.jpg"
                            alt="doctor"
                            className="rounded-circle me-2"
                            width={40}
                            height={40}
                          />
                          <div className="d-flex flex-column">
                                <strong>{doctor.username}</strong>
                                <small className="text-muted">{doctor.phone}</small>
                                <small className="text-muted">{doctor.email}</small>
                                <small className="text-secondary">Start a conversation</small>
                          </div>
                        </div>
                      </li>
                    ))}
              </ul>
            </div>
          </div>

          {/* Chat Box */}
          <div className={`col-md-8 ${selectedDoctor ? "d-block" : "d-none d-md-block"}`}>
            <div className="chat-box border mt-5 rounded" style={{ height: "80vh", overflowY: "scroll" }}>
              <div
                className="w-100 p-2 text-white d-flex align-items-center position-sticky"
                style={{ top: 0, zIndex: 1000, background: theme.primary }}
              >
                {selectedDoctor && (
                  <FaArrowLeft
                    className="me-2 d-md-none"
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedDoctor(null)}
                  />
                )}
                <img src="/doctor.jpg" alt="doctor" className="rounded-circle me-2" width={40} height={40} />
                <strong>{selectedDoctor || "Select a doctor"}</strong>
              </div>

              {selectedDoctor &&
                messages
                  .filter(
                    (msg) =>
                      (msg.sender === selectedDoctor && msg.receiver === user.email) ||
                      (msg.sender === user.email && msg.receiver === selectedDoctor)
                  )
                  .map((msg, index) => (
                    <div
                      key={index}
                      className={`d-flex ${msg.sender === user.email ? "justify-content-end" : "justify-content-start"}`}
                    >
                      <div
                        className={`card mt-1 ${
                          msg.sender === user.email ? "text-white bg-primary" : "bg-light"
                        } w-50`}
                      >
                        <div className="card-body">
                          <strong>{msg.sender}: </strong>
                          <p>{msg.message}</p>
                          <small className="text-muted d-block">{msg.timestamp}</small>
                          {msg.sender === user.email && msg.seen && <small className="text-success">✔ Seen</small>}
                        </div>
                      </div>
                    </div>
                  ))}

              {!selectedDoctor && (
                <div className="text-center text-muted mt-5">
                  <p>Select a doctor to start chatting.</p>
                </div>
              )}

              {selectedDoctor && (
                <div className="container mt-3 d-flex w-100 position-sticky" style={{ bottom: 30, zIndex: 1000 }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendMessage();
                    }}
                  />
                  <button className="btn btn-primary ms-2" onClick={sendMessage} disabled={!input.trim()}>
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
