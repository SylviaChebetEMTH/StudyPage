import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../contexts/userContext";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import { IoMdChatbubbles } from "react-icons/io";

// Custom hook for managing conversations
const useConversation = (authToken, conversationId) => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    if (!conversationId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://studypage.onrender.com/conversations/${conversationId}/messages`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      const data = await response.json();
      setMessages(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // const pic = localStorage.getItem('teacherpic')

  useEffect(() => {
    fetchMessages();
  }, [conversationId, authToken]);

  return { messages, setMessages, error, loading, fetchMessages };
};

const ChatWindow = ({ activeUser, currentUser, auth, teacher, pic, isInModal, teach }) => {
  console.log('chatgagactiveuseractiveuser', activeUser)
  const [chatActiveUser, setChatActiveUser] = useState(activeUser || null);
  const { authToken } = useContext(UserContext);
  const { messages, setMessages,loading } = useConversation(
    authToken,
    chatActiveUser?.conversationId
  );
  const [load, setLoading] = useState(true);
  
  // Add ref for the messages container
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle initial scroll position when messages load
  useEffect(() => {
    if (!loading && messages.length > 0) {
      scrollToBottom();
    }
  }, [loading, messages]);

  useEffect(() => {
    setChatActiveUser(activeUser);
  }, [activeUser]);

  const sendMessage = async (conversationId, content, attachments) => {
    try {

      const formData = new FormData();
      
      if (conversationId === -1) {
        formData.append("expert_id", teacher.id);
        formData.append("content", content);
        attachments.forEach((file) => formData.append("attachments", file));

        const conversationResponse = await fetch(
          `https://studypage.onrender.com/conversations/${conversationId}/messages`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${authToken}` },
            body: formData,
          }
        );

        if (!conversationResponse.ok) {
          throw new Error("Failed to create conversation");
        }

        const { conversation_id } = await conversationResponse.json();
        setChatActiveUser((prev) => ({
          ...prev,
          conversationId: conversation_id,
        }));
        
        return sendMessage(conversation_id, content, attachments);
      }

      formData.append("content", content);
      attachments.forEach((file) => formData.append("attachments", file));

      const response = await fetch(
        `https://studypage.onrender.com/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${authToken}` },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      return { ...data, conversationId };
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  };

  useEffect(() => {
    if (!activeUser || !activeUser.conversationId) return;
  
    const fetchMessages = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(
          `https://backendstudypage.onrender.com/conversations/${activeUser.conversationId}/messages`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
  
        if (!response.ok) {
          console.error("Failed to fetch messages");
          return;
        }
  
        const data = await response.json();
        console.log("Fetched messages:", data);
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false); // Stop loading
      }
    };
  
    fetchMessages();
  }, [activeUser?.conversationId, authToken]);
  

  if (!activeUser) {
    if (!chatActiveUser) {
      return (
        <div className={`${isInModal ? 'h-full' : 'flex-grow'} bg-gray-900 p-4 flex items-center justify-center`}>
          <IoMdChatbubbles className="text-white text-6xl mr-4" />
          <h2 className="text-white text-xl">Select a user to start chatting</h2>
        </div>
      );
    }

    return (
      <div className={`${isInModal ? 'h-full' : 'flex-grow h-screen'} flex flex-col bg-white`}>
        { !isInModal && (
          <div className="flex items-center justify-between mb-6 bg-gray-400">
            <div className="flex items-center ml-4">
              <img
                src={pic }
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

        <div 
          ref={messagesContainerRef}
          className="flex-grow overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-700"
        >
          {load ? (
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

        <MessageInput
          sendMessage={(content, attachments) =>
            sendMessage(chatActiveUser.conversationId, content, attachments)
              .then((data) => {
                if (data) {
                  setMessages((prev) => [...prev, data]);
                }
              })
              .catch((error) => {
                console.error("Error sending message:", error);
              })
          }
        />
      </div>
    );
  }

  return null;
};

export default ChatWindow;
