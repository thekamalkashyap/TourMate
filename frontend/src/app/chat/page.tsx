"use client";

import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("chat message", (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  const sendMessage = () => {
    socket.emit("chat message", "Hello from the client!");
  };

  return (
    <div className="form-container">
      <h1>Chat</h1>
      <ul id="messages">
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export default Chat;
