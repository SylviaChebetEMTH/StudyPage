import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../contexts/userContext";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import { IoMdChatbubbles } from "react-icons/io";

// Custom hook for managing conversations
const useConversation = (authToken, conversationId,auth,converseId) => {
  console.log('authauthauth',converseId);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    if (!conversationId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://studypage.onrender.com/conversations/${conversationId || converseId }/messages`,
        {
          headers: { Authorization: `Bearer ${authToken || auth}` },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`🚨 Error fetching messages: ${response.status} - ${errorText}`);
        throw new Error(`Failed to fetch messages: ${response.status}`);  
      }

      const data = await response.json();
      setMessages(data);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching messages:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [conversationId, authToken]);

  return { messages, setMessages, error, loading, fetchMessages };
};

const ChatWindow = ({ activeUser, currentUser, auth, teacher, pic, isInModal, teach }) => {
  // console.log("chatgagactiveuseractiveuser", activeUser);

  const [chatActiveUser, setChatActiveUser] = useState(activeUser || null);
  const { authToken } = useContext(UserContext);
  const { messages, setMessages, loading, fetchMessages } = useConversation(
    authToken || auth,
    chatActiveUser?.conversationId
  );

  // Add refs for scrolling
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sync `activeUser` changes with `chatActiveUser`
  useEffect(() => {
    setChatActiveUser(activeUser);
  }, [activeUser]);

  const sendMessage = async (conversationId, content, attachments) => {
    try {
      if (!conversationId) {
        console.warn("⚠️ Cannot send message: No conversation ID.");
        return;
      }

      const formData = new FormData();
      formData.append("content", content);
      attachments.forEach((file) => formData.append("attachments", file));

      const response = await fetch(
        `https://studypage.onrender.com/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${authToken || auth}` },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      console.log("✅ Message sent:", data);

      // Add new message to state and re-fetch latest messages
      setMessages((prev) => [...prev, data]);
      fetchMessages(); // ✅ Re-fetch messages after sending

      return data;
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  // Ensure `conversationId` exists before rendering
  if (!chatActiveUser?.conversationId) {
    return (
      <div className={`${isInModal ? "h-full" : "flex-grow"} bg-gray-900 p-4 flex items-center justify-center`}>
        <IoMdChatbubbles className="text-white text-6xl mr-4" />
        <h2 className="text-white text-xl">Select a user to start chatting</h2>
      </div>
    );
  }

  return (
    <div className={`${isInModal ? "h-full" : "flex-grow h-screen"} flex flex-col bg-white`}>
      {/* Chat Header */}
      {!isInModal && (
        <div className="flex items-center justify-between mb-6 bg-gray-400">
          <div className="flex items-center ml-4">
            <img
              src={pic}
              alt={chatActiveUser.expert_name}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="text-white">{chatActiveUser.expert_name}</p>
              <p className="text-gray-700 text-sm">Online</p>
            </div>
          </div>
        </div>
      )}

      {/* Message List */}
      <div 
        ref={messagesContainerRef}
        className="flex-grow overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-700"
      >
        {loading ? (
          <div className="text-white text-center">Loading messages...</div>
        ) : messages.length > 0 ? (
          <>
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id || index}
                message={message}
                activeUser={{ ...chatActiveUser, isAdmin: false }}
              />
            ))}
            <div ref={messagesEndRef} /> {/* Scroll anchor */}
          </>
        ) : (
          <div className="text-gray-400 text-center mt-4">
            No messages yet. Start the conversation!
          </div>
        )}
      </div>

      {/* Message Input */}
      <MessageInput
        sendMessage={(content, attachments) =>
          sendMessage(chatActiveUser.conversationId, content, attachments)
        }
      />
    </div>
  );
};

export default ChatWindow;
