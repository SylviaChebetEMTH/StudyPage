import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/userContext";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import { IoMdChatbubbles } from "react-icons/io";

const ChatWindow = ({ activeUser }) => {
  const [messages, setMessages] = useState([]);
  const { authToken } = useContext(UserContext);
  // console.log("client's auth token",authToken)

  const sendMessage = async (conversationId, content, attachments) => {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('expert_id', activeUser.expert_id);
    attachments.forEach(file => formData.append('attachments', file));
  
    try {
      const response = await fetch(`http://127.0.0.1:5000/conversations/${conversationId}/messages`, {
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
      // console.log('Message sent successfully:', data);
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  

  useEffect(() => {
    if (activeUser) {
      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:5000/conversations/${activeUser.conversationId}/messages`,
            {
              headers: { Authorization: `Bearer ${authToken}` }, 
            }
          );
  
          if (!response.ok) {
            console.error("Failed to fetch messages");
            return;
          }
  
          const data = await response.json();
          console.log("Fetched messages for client:", data);
          setMessages(data);
        } catch (err) {
          console.error("Error fetching messages:", err);
        }
      };
  
      fetchMessages();
    }
  }, [activeUser, authToken]);
  console.log('activeusersersr',activeUser)
  

  if (!activeUser) {
    return (
      <div className="flex-grow bg-gray-900 p-4 flex items-center justify-center">
        <IoMdChatbubbles className="text-white text-6xl mr-4" />
        <h2 className="text-white text-xl">Select a user to start chatting</h2>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-gray-600 p-4 flex flex-col justify-between">
      {activeUser.conversationId === -1 && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img
              src={activeUser.profilePicture || "default-avatar.png"}
              alt={activeUser.expert_name}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div>
              <p className="text-white">{activeUser.expert_name}</p>
              <p className="text-gray-400 text-sm">Online</p>
            </div>
          </div>
        </div>
      )}
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageBubble key={index} message={message} activeUser={{ ...activeUser, isAdmin: false }} />
            
          ))
        ) : (
          <div className="text-gray-400 text-center mt-4">
            No messages yet. Start the conversation!
          </div>
        )}
      </div>
      <MessageInput
        sendMessage={(content, attachments) =>
          sendMessage(activeUser.conversationId, content, attachments).then((data) => {
            if (data) {
              setMessages((prev) => [...prev, data]);
            }
          })
        }
      />
    </div>
  );
};

export default ChatWindow;