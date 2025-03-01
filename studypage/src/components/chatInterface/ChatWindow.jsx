// import React, { useState, useEffect, useContext, useRef } from "react";
// import { UserContext } from "../contexts/userContext";
// import MessageInput from "./MessageInput";
// import MessageBubble from "./MessageBubble";
// import { IoMdChatbubbles } from "react-icons/io";

// // Custom hook for managing conversations
// const useConversation = (authToken, conversationId,auth,converseId) => {
//   console.log('authauthauth',converseId);
//   const [messages, setMessages] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchMessages = async () => {
//     if (!conversationId) return;

//     setLoading(true);
//     try {
//       const response = await fetch(
//         `https://studypage.onrender.com/conversations/${conversationId || converseId }/messages`,
//         {
//           headers: { Authorization: `Bearer ${authToken || auth}` },
//         }
//       );

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error(`🚨 Error fetching messages: ${response.status} - ${errorText}`);
//         throw new Error(`Failed to fetch messages: ${response.status}`);  
//       }

//       const data = await response.json();
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

// const ChatWindow = ({ activeUser, currentUser, auth, teacher, pic, isInModal, teach }) => {
//   // console.log("chatgagactiveuseractiveuser", activeUser);

//   const [chatActiveUser, setChatActiveUser] = useState(activeUser || null);
//   const { authToken } = useContext(UserContext);
//   const { messages, setMessages, loading, fetchMessages } = useConversation(
//     authToken || auth,
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
//     try {
//       if (!conversationId) {
//         console.warn("⚠️ Cannot send message: No conversation ID.");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("content", content);
//       attachments.forEach((file) => formData.append("attachments", file));

//       const response = await fetch(
//         `https://studypage.onrender.com/conversations/${conversationId}/messages`,
//         {
//           method: "POST",
//           headers: { Authorization: `Bearer ${authToken || auth}` },
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
//     <div className={`${isInModal ? "h-full" : "flex-grow h-screen"} flex flex-col bg-gray-900`}>
//       {/* Security Banner */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 shadow-md">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//             </svg>
//             <span className="text-sm font-medium">Your conversations are secure and encrypted end-to-end</span>
//           </div>
//           <span className="text-xs text-blue-200">Learn more</span>
//         </div>
//       </div>

//       {/* Chat Header */}
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

//       {/* Messages Container */}
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
//       <MessageInput
//         sendMessage={(content, attachments) =>
//           sendMessage(chatActiveUser.conversationId, content, attachments)
//         }
//       />
//     </div>
//   );
// };

// export default ChatWindow;



// import React, { useState, useEffect, useContext, useRef } from "react";
// import { UserContext } from "../contexts/userContext";
// import MessageInput from "./MessageInput";
// import MessageBubble from "./MessageBubble";
// import { IoMdChatbubbles } from "react-icons/io";

// // Custom hook for managing conversations
// const useConversation = (authToken, conversationId, auth, converseId) => {
//   const [messages, setMessages] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchMessages = async () => {
//     if (!conversationId) return;

//     setLoading(true);
//     try {
//       const response = await fetch(
//         `https://studypage.onrender.com/conversations/${conversationId || converseId}/messages`,
//         {
//           headers: { Authorization: `Bearer ${authToken || auth}` },
//         }
//       );

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error(`🚨 Error fetching messages: ${response.status} - ${errorText}`);
//         throw new Error(`Failed to fetch messages: ${response.status}`);
//       }

//       const data = await response.json();
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

// const ChatWindow = ({ activeUser, currentUser, auth, teacher, pic, isInModal, teach }) => {
//   const [chatActiveUser, setChatActiveUser] = useState(activeUser || null);
//   const { authToken } = useContext(UserContext);
//   const { messages, setMessages, loading, fetchMessages } = useConversation(
//     authToken || auth,
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
//     try {
//       if (!conversationId) {
//         console.warn("⚠️ Cannot send message: No conversation ID.");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("content", content);
//       attachments.forEach((file) => formData.append("attachments", file));

//       const response = await fetch(
//         `https://studypage.onrender.com/conversations/${conversationId}/messages`,
//         {
//           method: "POST",
//           headers: { Authorization: `Bearer ${authToken || auth}` },
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
//     <div className={`${isInModal ? "h-full" : "flex-grow h-screen"} flex flex-col bg-gray-900`}>
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
//       <MessageInput
//         sendMessage={(content, attachments) =>
//           sendMessage(chatActiveUser.conversationId, content, attachments)
//         }
//       />
//     </div>
//   );
// };

// export default ChatWindow;




import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../contexts/userContext";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import { IoMdChatbubbles } from "react-icons/io";

// Custom hook for managing conversations
const useConversation = (conversationId) => {
  const [messages, setMessages] = useState([]);
  const { authToken } = useContext(UserContext);
  console.log('fetched auth', authToken)
  console.log('fetched id', conversationId)
 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    if (!conversationId || conversationId === -1) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://studypage.onrender.com/conversations/${conversationId}/messages`,
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
      console.log('fetched data',data)
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

const ChatWindow = ({ activeUser,teacher, pic, isInModal, teach }) => {
  const [chatActiveUser, setChatActiveUser] = useState(activeUser || null);
  const { authToken } = useContext(UserContext);
  console.log('teacher dot id',teacher)
  
  // THIS IS THE FIXED LINE - Only pass the conversation ID to useConversation
  const { messages, setMessages, loading, fetchMessages } = useConversation(
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
    console.log('fetched conversationid',conversationId)
    try {
      if (!conversationId) {
        console.warn("⚠️ Cannot send message: No conversation ID.");
        return;
      }

      const formData = new FormData();
      formData.append("content", content);
      formData.append("expert_id", activeUser.id || activeUser.expert_id );
      console.log('this form data before sending', formData)
      // formData.append("sender_type", "user");
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
        </div>
      )}

      <div
        ref={messagesContainerRef}
        className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
          </div>
        ) : messages.length > 0 ? (
          <>
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id || index}
                message={message}
                activeUser={{ ...chatActiveUser, isAdmin: false }}
              />
            ))}
            <div ref={messagesEndRef} />
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
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-gray-800 p-3">
        <MessageInput
          sendMessage={(content, attachments) =>
            sendMessage(chatActiveUser.conversationId, content, attachments)
          }
        />
      </div>
    </div>
  );
};

export default ChatWindow;