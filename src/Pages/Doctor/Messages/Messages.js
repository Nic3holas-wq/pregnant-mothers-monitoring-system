import React, { useState, useEffect } from "react";
import NavPanel from "../../../Components/Doctor/NavPanel/NavPanel";
import io from "socket.io-client";

// Backend server URL
const socket = io("http://10.42.0.1:5000", {
  autoConnect: false, // Connect only when user is set
});

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const [mothers, setMothers] = useState([]);
  const [selectedMother, setSelectedMother] = useState(null);

  // Load logged-in doctor from localStorage
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("doctor")); // Load logged-in doctor
    if (currentUser) {
      setUser(currentUser);
      try{
        socket.connect(); // Connect socket after setting user
        socket.emit("join_room", { email: currentUser.email }); // Join the room with the user's email
        console.log("Connected to socket and joined room", currentUser.email)
      }
      catch(err){
        console.log(err);
        
      }
    }

    return () => {
      socket.disconnect(); // Cleanup on unmounton unmount
    };
  }, []);

  // Scroll to the bottom of chat
  useEffect(() => {
    const chatBox = document.querySelector(".chat-box");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, [messages, selectedMother]);

  // Fetch messages and update the mothers list
  useEffect(() => {
    if (!user) return;

    fetch("http://10.42.0.1:5000/messages")
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);

        // Extract unique mothers with their latest messages
        const motherMessages = data.reduce((acc, msg) => {
          if (msg.sender_role === "mother") {
            if (!acc[msg.sender] || new Date(msg.timestamp) > new Date(acc[msg.sender].timestamp)) {
              acc[msg.sender] = msg;
            }
          }
          return acc;
        }, {});

        setMothers(Object.values(motherMessages)); // Convert object to array
      });

    // Listen for real-time messages
    socket.on("message", (msg) => {
      console.log("New message received:", msg); // Debugging log

      // Update the messages state immutably
      setMessages((prev) => [...prev, msg]);

      // Update the mothers list immutably
      setMothers((prev) => {
        const existingMother = prev.find((m) => m.sender === msg.sender);
        if (!existingMother || new Date(msg.timestamp) > new Date(existingMother.timestamp)) {
          return [...prev.filter((m) => m.sender !== msg.sender), { ...msg }];
        }
        return prev;
      });
    });

    // Listen for "messages_seen" updates
    socket.on("messages_seen", ({ sender, receiver }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.sender === sender && msg.receiver === receiver ? { ...msg, seen: true } : msg
        )
      );
    });

    return () => {
      socket.off("message");
      socket.off("messages_seen");
    };
  }, [user]);

  // Mark messages as seen when selecting a mother
  useEffect(() => {
    if (selectedMother && user) {
      fetch("http://10.42.0.1:5000/messages/seen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: selectedMother, receiver: user.email }),
      }).then((res) => res.json())
        .then(() => {
          socket.emit("mark_as_seen", { sender: selectedMother, receiver: user.email });
        });
    }
  }, [selectedMother, user]);

  // Function to send a message
  const sendMessage = () => {
    if (input.trim() === "" || !user || !selectedMother) return;

    const messageData = {
      sender: user.email, // Doctor's email
      receiver: selectedMother, // Selected mother's email
      message: input,
      timestamp: new Date().toISOString(),
    };

    socket.emit("message", messageData); // Emit the message to the backend
    setMessages((prev) => [...prev, messageData]); // Update the messages state immediately
    setInput(""); // Clear input after sending
  };

  return (
    <div>
      <NavPanel />
      <div className="container mt-5 d-flex">
        
        {/* Left Panel: List of Mothers */}
        <div className="mothers-list mt-5 w-50">
          <h4>Chats</h4>
          <ul className="list-group">
            {mothers.map((mother, index) => (
              <li
                key={index}
                className={`list-group-item d-flex align-items-center justify-content-between ${selectedMother === mother.sender ? "active" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedMother(mother.sender)}
              >
                <div className="d-flex align-items-center flex-grow-1 pe-5">
                  <img src="/user.jpg" alt="user" className="rounded-circle me-2" width={40} height={40} />
                  <div className="d-flex flex-column">
                    <strong>{mother.sender}</strong>
                    <small className="text-muted text-truncate fs-5" style={{ maxWidth: "180px" }}>
                      {mother.message ? 
                        (mother.message.length > 25 ? mother.message.substring(0, 25) + "..." : mother.message) 
                        : "No messages yet"}
                    </small>
                    <small className="text-muted">
                  {mother.timestamp}
                </small>
                  </div>
                </div>
                
              </li>
            ))}
          </ul>
        </div>

        {/* Right Panel: Chat Box */}
        <div className="chat-box border mt-5 w-75 ms-3" style={{ height: "75vh", overflowY: "scroll" }}>
          
          {/* Chat Header */}
          <div className="bg-primary w-100 p-2 text-white d-flex align-items-center position-sticky" style={{ top: 0, zIndex: 1000 }}>
            <img src="/user.jpg" alt="user" className="rounded-circle me-2" width={40} height={40} />
            <strong>{selectedMother ? selectedMother : "Select a mother"}</strong>
          </div>

          {/* Chat Messages */}
          <div className="px-2">
            {selectedMother && messages
              .filter((msg) => 
                (msg.sender === selectedMother && msg.receiver === user.email) || 
                (msg.sender === user.email && msg.receiver === selectedMother)
              )
              .map((msg, index) => (
                <div key={index} className={`d-flex ${msg.sender === user.email ? "justify-content-end" : "justify-content-start"}`}>
                  <div className={`card message-container mt-1 ${msg.sender === user.email ? "text-white bg-primary" : "bg-light"} w-50`}>
                    <div className="card-body">
                      <strong>{msg.sender}: </strong>
                      <p>{msg.message}</p>
                      <div className="d-flex flex-row justify-content-between">
                        <small className="text-muted d-block">
                          {msg.timestamp}
                        </small>
                        {msg.sender === user.email && msg.seen && <small className="text-success">✔ Seen</small>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {!selectedMother && (
            <div className="text-center text-muted mt-5">
              <p>Select a mother to start chatting.</p>
            </div>
          )}

          {selectedMother && user && (
            <div className="container mt-3 d-flex w-75 position-sticky" style={{ bottom: 0, zIndex: 1000 }}>
              <input
                type="text"
                className="form-control"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className="btn btn-primary ms-2" onClick={sendMessage} disabled={!input.trim()}>
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
