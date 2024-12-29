import React, { useState, useEffect } from "react";
import MessageBubble from "../chatInterface/MessageBubble.jsx";
import MessageInput from "../chatInterface/MessageInput.jsx";

const AdminChatBox = ({ conversationId, conversationDetails, authToken }) => {
  const [messages, setMessages] = useState([]);
  console.log('conversation details admin',conversationDetails)

  useEffect(() => {
    if (conversationId) {
      const fetchMessages = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:5000/conversations/${conversationId}/messages`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
  
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error Response: ${response.status} - ${errorText}`);
            throw new Error(`Failed to fetch messages: ${response.status}`);
          }
  
          const data = await response.json();
          setMessages(data);
          console.log("Fetched messages for admin:", data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
  
      fetchMessages();
    }
  }, [conversationId, authToken]);  

  const sendMessage = async (conversationId, content, attachments) => {
    const formData = new FormData();
    formData.append('content', content);
    attachments.forEach(file => formData.append('attachments', file));
  
    try {
      const response = await fetch(`http://127.0.0.1:5000/conversationsadmin/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
  
      const data = await response.json();
      console.log('Message sent successfully:', data);
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!conversationId) {
    return (
      <div className="flex-grow bg-gray-900 p-4 flex items-center justify-center">
        <h2 className="text-white text-xl">Select a conversation to start chatting</h2>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-gray-900 p-4 flex flex-col justify-between">
      {/* Conversation Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white text-lg">
            Chat with: {conversationDetails.client} as {conversationDetails.expert}
          </p>
          {/* <p className="text-gray-400 text-sm">Conversation ID: {conversationId}</p> */}
        </div>
      </div>

      {/* Message Display */}
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageBubble key={index} message={message} activeUser={{ ...conversationDetails, isAdmin: true  }}/>
          ))
        ) : (
          <div className="text-gray-400 text-center mt-4">
            No messages yet. Start the conversation!
          </div>
        )}
      </div>
      <MessageInput
        sendMessage={(content, attachments) =>
          sendMessage(conversationId, content, attachments).then((data) => {
            if (data) {
              setMessages((prev) => [...prev, data]);
            }
          })
        }
      />
    </div>
  );
};

export default AdminChatBox;
