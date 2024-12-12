import React, { useState, useEffect } from "react";
import MessageBubble from "../chat-interface/src/components/MessageBubble";

const AdminChatBox = ({ conversationId,authToken }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (conversationId) {
      fetch(`/admin/conversations/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
        .then((res) => res.json())
        .then(setMessages)
        .catch(console.error);
    }
  }, [conversationId,authToken]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    fetch(`/admin/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ content: newMessage }),
    })
      .then((res) => res.json())
      .then((message) => setMessages((prev) => [...prev, message]))
      .catch(console.error);

    setNewMessage("");
  };

  return (
    <div className="w-3/4 bg-gray-100 p-4">
      <div className="flex flex-col space-y-4 h-96 overflow-y-auto">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
      <div className="flex mt-4">
        <textarea
          className="flex-1 p-2 border border-gray-400 rounded"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="ml-2 p-2 bg-blue-500 text-white rounded"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AdminChatBox;
