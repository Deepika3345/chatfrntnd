// src/App.jsx
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "./features/chattools/chatServices";
import { sendMessage, receiveMessage } from "./features/chattools/chatSlice";

function App() {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [hasJoined, setHasJoined] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("receive_message", (message) => {
      dispatch(receiveMessage(message));
    });

    return () => {
      socket.off("receive_message");
    };
  }, [dispatch]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
      <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
        <div className="p-4 shadow-sm w-100" style={{ maxWidth: 400 }}>
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
              Join
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="d-flex flex-column"
      style={{ height: "100dvh", overflow: "hidden" }}
    >
      {/* Fixed Header */}
      <div
        className="bg-white border-bottom px-3 py-2"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "#fff",
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            className="bi bi-bluesky text-info"
            viewBox="0 0 16 16"
          >
            <path d="M3.468 1.948C5.303 3.325 7.276 6.118 8 7.616c.725-1.498 2.698-4.29 4.532-5.668C13.855.955 16 .186 16 2.632c0 .489-.28 4.105-.444 4.692-.572 2.04-2.653 2.561-4.504 2.246 3.236.551 4.06 2.375 2.281 4.2-3.376 3.464-4.852-.87-5.23-1.98-.07-.204-.103-.3-.103-.218 0-.081-.033.014-.102.218-.379 1.11-1.855 5.444-5.231 1.98-1.778-1.825-.955-3.65 2.28-4.2-1.85.315-3.932-.205-4.503-2.246C.28 6.737 0 3.12 0 2.632 0 .186 2.145.955 3.468 1.948" />
          </svg>
          <span className="fw-bold fs-4 text-info">Social Circle</span>
          <span className="badge bg-secondary ms-auto">You: {username}</span>
        </div>
      </div>

      {/* Chat Box */}
      <div className="d-flex flex-column flex-grow-1 bg-light">
        {/* Scrollable Message Area */}
        <div
          className="flex-grow-1 overflow-auto p-2"
          style={{ minHeight: 0 }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`d-flex mb-2 ${
                msg.sender === username
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              <div
                className={`p-2 rounded ${
                  msg.sender === username
                    ? "bg-primary text-white"
                    : "bg-white border"
                }`}
                style={{
                  maxWidth: "75%",
                  minWidth: "25%",
                  wordBreak: "break-word",
                  marginLeft: msg.sender === username ? "25%" : "0",
                  marginRight: msg.sender === username ? "0" : "25%",
                }}
              >
                <strong>{msg.sender === username ? "You" : msg.sender}</strong>
                : {msg.text}
                <div
                  className="text-muted mt-1 float-end"
                  style={{ fontSize: "0.75rem" }}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="input-group p-2 border-top bg-white">
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
              className="bi bi-send"
              viewBox="0 0 16 16"
            >
              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
