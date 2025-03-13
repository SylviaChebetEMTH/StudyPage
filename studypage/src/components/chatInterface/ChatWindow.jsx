// import React, { useState, useEffect, useContext, useRef } from "react";
// import { UserContext } from "../contexts/userContext";
// import MessageInput from "./MessageInput";
// import MessageBubble from "./MessageBubble";
// import { IoMdChatbubbles } from "react-icons/io";

// // Custom hook for managing conversations
// const useConversation = (conversationId) => {
//   const [messages, setMessages] = useState([]);
//   const { authToken } = useContext(UserContext);
//   console.log('fetched auth', authToken)
//   console.log('fetched id', conversationId)
 
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchMessages = async () => {
//     if (!conversationId || conversationId === -1) return;

//     setLoading(true);
//     try {
//       const response = await fetch(
//         `https://studypage.onrender.com/conversations/${conversationId}/messages`,
//         {
//           headers: { Authorization: `Bearer ${authToken}` },  
//         }
//       );

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error(`🚨 Error fetching messages: ${response.status} - ${errorText}`);
//         throw new Error(`Failed to fetch messages: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log('fetched data',data)
//       setMessages(data);
//       setError(null);
//     } catch (err) {
//       console.error("❌ Error fetching messages:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMessages();
//   }, [conversationId, authToken]);

//   return { messages, setMessages, error, loading, fetchMessages };
// };

// const ChatWindow = ({ activeUser,teacher, pic, isInModal, teach }) => {
//   const [chatActiveUser, setChatActiveUser] = useState(activeUser || null);
//   const { authToken } = useContext(UserContext);
//   console.log('teacher dot id',teacher)
  
//   // THIS IS THE FIXED LINE - Only pass the conversation ID to useConversation
//   const { messages, setMessages, loading, fetchMessages } = useConversation(
//     chatActiveUser?.conversationId
//   );

//   // Add refs for scrolling
//   const messagesEndRef = useRef(null);
//   const messagesContainerRef = useRef(null);

//   // Auto-scroll when new messages arrive
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Sync `activeUser` changes with `chatActiveUser`
//   useEffect(() => {
//     setChatActiveUser(activeUser);
//   }, [activeUser]);

//   const sendMessage = async (conversationId, content, attachments) => {
//     console.log('fetched conversationid',conversationId)
//     try {
//       if (!conversationId) {
//         console.warn("⚠️ Cannot send message: No conversation ID.");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("content", content);
//       formData.append("expert_id", activeUser.id || activeUser.expert_id );
//       console.log('this form data before sending', formData)
//       // formData.append("sender_type", "user");
//       attachments.forEach((file) => formData.append("attachments", file));

//       const response = await fetch(
//         `https://studypage.onrender.com/conversations/${conversationId}/messages`,
//         {
//           method: "POST",
//           headers: { Authorization: `Bearer ${authToken}` },
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to send message");
//       }

//       const data = await response.json();
//       console.log("✅ Message sent:", data);

//       // Add new message to state and re-fetch latest messages
//       setMessages((prev) => [...prev, data]);
//       fetchMessages(); // ✅ Re-fetch messages after sending

//       return data;
//     } catch (error) {
//       console.error("❌ Error sending message:", error);
//     }
//   };

//   // Ensure `conversationId` exists before rendering
//   if (!chatActiveUser?.conversationId) {
//     return (
//       <div className={`${isInModal ? "h-full" : "flex-grow"} bg-gray-900 p-4 flex items-center justify-center`}>
//         <IoMdChatbubbles className="text-white text-6xl mr-4" />
//         <h2 className="text-white text-xl">Select a user to start chatting</h2>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`${isInModal ? "h-full" : "h-screen"} flex flex-col bg-gray-900 
//                   ${window.innerWidth < 768 && !isInModal ? "fixed inset-0" : ""}`}
//     >
//       {!isInModal && (
//         <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white font-semibold">
//               {chatActiveUser.expert_name?.charAt(0).toUpperCase()}
//             </div>
//             <div>
//               <p className="text-gray-200 font-medium">{chatActiveUser.expert_name}</p>
//               <p className="text-sm text-gray-400">
//                 <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
//                 Online
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       <div
//         ref={messagesContainerRef}
//         className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
//       >
//         {loading ? (
//           <div className="flex items-center justify-center h-full">
//             <div className="w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
//           </div>
//         ) : messages.length > 0 ? (
//           <>
//             {messages.map((message, index) => (
//               <MessageBubble
//                 key={message.id || index}
//                 message={message}
//                 activeUser={{ ...chatActiveUser, isAdmin: false }}
//               />
//             ))}
//             <div ref={messagesEndRef} />
//           </>
//         ) : (
//           <div className="flex flex-col items-center justify-center h-full text-gray-400">
//             <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//             </svg>
//             <p className="text-lg font-medium">No messages yet</p>
//             <p className="text-sm text-gray-500 mt-2">Start the conversation!</p>
//           </div>
//         )}
//       </div>

//       {/* Message Input */}
//       <div className="sticky bottom-0 bg-gray-800 p-3">
//         <MessageInput
//           sendMessage={(content, attachments) =>
//             sendMessage(chatActiveUser.conversationId, content, attachments)
//           }
//         />
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;




import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../contexts/userContext";
import { useSocket } from "../contexts/SocketContext";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import { IoMdChatbubbles } from "react-icons/io";
import { FiRefreshCw } from "react-icons/fi";

const ChatWindow = ({ activeUser, teacher, pic, isInModal, teach }) => {
  const [chatActiveUser, setChatActiveUser] = useState(activeUser || null);
  const { authToken } = useContext(UserContext);
  const { socket, joinConversation, typingUsers, sendTypingStatus } = useSocket();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Add refs for scrolling
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Fetch messages function
  const fetchMessages = async (pageNum = 1, append = false) => {
    if (!chatActiveUser?.conversationId) return;

    const fetchingMore = pageNum > 1;
    if (fetchingMore) {
      setIsFetchingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch(
        `https://studypage.onrender.com/conversations/${chatActiveUser.conversationId}/messages?page=${pageNum}&limit=20`,
        {
          headers: { Authorization: `Bearer ${authToken}` },  
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`🚨 Error fetching messages: ${response.status} - ${errorText}`);
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.length < 20) {
        setHasMore(false);
      }

      if (append && pageNum > 1) {
        // When loading more, prepend to existing messages
        setMessages(prevMessages => [...data, ...prevMessages]);
      } else {
        setMessages(data);
      }
      
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching messages:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  
  // Initial data load
  useEffect(() => {
    if (chatActiveUser?.conversationId) {
      fetchMessages();
      // Join socket room for this conversation
      joinConversation(chatActiveUser.conversationId);
    }
  }, [chatActiveUser?.conversationId, authToken]);

  // Socket event for real-time messages
  useEffect(() => {
    if (!socket || !chatActiveUser?.conversationId) return;

    const handleNewMessage = (data) => {
      // If the message is from the current conversation
      if (data.conversation_id === chatActiveUser.conversationId) {
        // Check if message already exists to prevent duplicates
        setMessages(prevMessages => {
          const messageExists = prevMessages.some(msg => msg.id === data.id);
          if (messageExists) return prevMessages;
          return [...prevMessages, data];
        });
      }
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, chatActiveUser?.conversationId]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    // Only auto-scroll if we're not fetching older messages
    if (!isFetchingMore && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isFetchingMore]);

  // Sync `activeUser` changes with `chatActiveUser`
  useEffect(() => {
    setChatActiveUser(activeUser);
  }, [activeUser]);

  // Handle typing indicator
  const handleTyping = () => {
    if (!chatActiveUser?.conversationId) return;
    
    // Only send typing status if not already marked as typing
    if (!isTyping) {
      setIsTyping(true);
      // Send typing status through socket
      sendTypingStatus(
        chatActiveUser.conversationId, 
        chatActiveUser.expert_name || chatActiveUser.name || 'user'
      );
    }
    
    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set a new timeout to reset typing status after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 3000);
  };

  // Clean up the typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Handle scroll to load more messages
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop } = messagesContainerRef.current;
      
      // If user has scrolled to the top and we have more messages to fetch
      if (scrollTop < 100 && !isFetchingMore && hasMore) {
        setPage(prevPage => {
          const newPage = prevPage + 1;
          fetchMessages(newPage, true);
          return newPage;
        });
      }
    }
  };

  const sendMessage = async (conversationId, content, attachments) => {
    try {
      if (!conversationId) {
        console.warn("⚠️ Cannot send message: No conversation ID.");
        return;
      }

      setSendingMessage(true);

      const formData = new FormData();
      formData.append("content", content);
      formData.append("expert_id", activeUser.id || activeUser.expert_id);
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
      
      // Optimistically add the message to the UI
      setMessages(prev => [...prev, data]);
      
      // Emit socket event for real-time update
      if (socket) {
        socket.emit('message_sent', {
          conversation_id: conversationId,
          message: data
        });
      }

      // Reset typing status
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      return data;
    } catch (error) {
      console.error("❌ Error sending message:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
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

  // Get typing users for the current conversation
  const currentTypingUsers = typingUsers[chatActiveUser.conversationId] || {};
  const typingPeople = Object.keys(currentTypingUsers)
    .filter(name => name !== chatActiveUser.expert_name && name !== chatActiveUser.name);

  return (
    <div
      className={`${isInModal ? "h-full" : "h-screen"} flex flex-col bg-gray-900 
                  ${window.innerWidth < 768 && !isInModal ? "fixed inset-0" : ""}`}
    >
      {!isInModal && (
        <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white font-semibold">
              {chatActiveUser.expert_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-gray-200 font-medium">{chatActiveUser.expert_name}</p>
              <p className="text-sm text-gray-400">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Online
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => fetchMessages()} 
            className="p-2 rounded-full hover:bg-gray-700 text-gray-400 transition-colors"
            aria-label="Refresh messages"
          >
            <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      )}

      <div
        ref={messagesContainerRef}
        className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
        onScroll={handleScroll}
      >
        {loading && !isFetchingMore ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {isFetchingMore && (
              <div className="flex justify-center py-2">
                <div className="w-6 h-6 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
              </div>
            )}
            
            {messages.length > 0 ? (
              <>
                {messages.map((message, index) => (
                  <MessageBubble
                    key={message.id || index}
                    message={message}
                    activeUser={{ ...chatActiveUser, isAdmin: false }}
                  />
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm text-gray-500 mt-2">Start the conversation!</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-100 p-3 rounded-md">
                <p>{error}</p>
                <button 
                  onClick={() => fetchMessages()} 
                  className="mt-2 text-sm underline hover:text-red-200"
                >
                  Try again
                </button>
              </div>
            )}
            
            {/* Typing indicator */}
            {typingPeople.length > 0 && (
              <div className="flex items-center text-gray-400 text-sm">
                <div className="flex space-x-1 mr-2">
                  <span className="animate-bounce">•</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>•</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>•</span>
                </div>
                {typingPeople.length === 1 ? (
                  <span>{typingPeople[0]} is typing...</span>
                ) : (
                  <span>{typingPeople.join(', ')} are typing...</span>
                )}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-gray-800 p-3">
        <MessageInput
          sendMessage={(content, attachments) =>
            sendMessage(chatActiveUser.conversationId, content, attachments)
          }
          isSending={sendingMessage}
          onTyping={handleTyping}
        />
      </div>
    </div>
  );
};

export default ChatWindow;