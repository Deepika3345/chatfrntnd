// src/App.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "./features/chattools/chatServices";
import { sendMessage, receiveMessage } from "./features/chattools/chatSlice";


function App() {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    socket.on("receive_message", (message) => {
      dispatch(receiveMessage(message));
    });

    return () => {
      socket.off("receive_message");
    };
  }, [dispatch]);

  const handleSend = () => {
    if (!input.trim()) return;

    const message = {
      sender: username,
      text: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    dispatch(sendMessage(message));
    socket.emit("send_message", message);
    setInput("");
  };

  const handleJoin = () => {
    if (username.trim()) setHasJoined(true);
  };

  if (!hasJoined) {
    return (
      <div className="container mt-5">
      <div className="p-4 shadow-sm">
        <h3 className="mb-4 text-center">SocialNation</h3>
    
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleJoin}>
            Join Chat
          </button>
        </div>
      </div>
    </div>
    
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Live Chat</h3>
      <div className="mb-2">
        <span className="badge bg-secondary">You: {username}</span>
      </div>

      <div
        className="border rounded p-3 mb-3 bg-light"
        style={{ height: "300px", overflowY: "scroll" }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-2 rounded ${
              msg.sender === username
                ? "bg-primary text-white text-end"
                : "bg-white border"
            }`}
          >
            <div>
              <strong>{msg.sender === username ? "You" : msg.sender}</strong>:{" "}
              {msg.text}
            </div>
            <div className="text-muted" style={{ fontSize: "0.8rem" }}>
              {msg.timestamp}
            </div>
          </div>
        ))}
      </div>

      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="btn btn-success" onClick={handleSend}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-send"
            viewBox="0 0 16 16"
          >
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default App;
