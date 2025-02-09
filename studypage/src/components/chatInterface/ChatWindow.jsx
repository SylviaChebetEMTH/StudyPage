// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contexts/userContext";
// import MessageInput from "./MessageInput";
// import MessageBubble from "./MessageBubble";
// import { IoMdChatbubbles } from "react-icons/io";

// const ChatWindow = ({ activeUser, curreUser, auth, teacher }) => {
//   const [messages, setMessages] = useState([]);
//   const [chatActiveUser, setChatActiveUser] = useState(activeUser || null);
//   const { authToken } = useContext(UserContext);

//   // Send message function
//   const sendMessage = async (conversationId, content, attachments) => {
//     if (conversationId === -1) {
//       try {
//         const formData = new FormData();
//         formData.append("expert_id", teacher.id);
//         formData.append("content", content);
//         attachments.forEach((file) => formData.append("attachments", file));

//         const conversationResponse = await fetch(
//           `http://127.0.0.1:5000/conversations/${conversationId}/messages`,
//           {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${authToken}`,
//             },
//             body: formData,
//           }
//         );

//         if (!conversationResponse.ok) {
//           throw new Error("Failed to create conversation");
//         }

//         const conversationData = await conversationResponse.json();
//         conversationId = conversationData.conversation_id; // Use 'id' as the new conversation ID
//         localStorage.setItem('convId','conversationId')

//         // Update chatActiveUser with the new conversation ID
//         setChatActiveUser((prev) => ({
//           ...prev,
//           conversationId,
//         }));
//       } catch (error) {
//         console.error("Error creating conversation:", error);
//         return null;
//       }
//     }

//     const formData = new FormData();
//     formData.append("content", content);
//     attachments.forEach((file) => formData.append("attachments", file));

//     try {
//       const response = await fetch(
//         `http://127.0.0.1:5000/conversations/${conversationId}/messages`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to send message");
//       }

//       const data = await response.json();
//       return { ...data, conversationId };
//     } catch (error) {
//       console.error("Error sending message:", error);
//       return null;
//     }
//   };
//   const value = localStorage.getItem('convId')
//   console.log('valueasfhj',value)
//     // Fetch messages whenever chatActiveUser or conversationId changes
//     useEffect(() => {
//       if (value) {
//         const fetchMessages = async () => {
//           try {
//             const response = await fetch(
//               `http://127.0.0.1:5000/conversations/${value}/messages`,
//               {
//                 headers: { Authorization: `Bearer ${authToken}` },
//               }
//             );
  
//             if (!response.ok) {
//               console.error("Failed to fetch messages");
//               return;
//             }
  
//             const data = await response.json();
//             setMessages(data);
//           } catch (err) {
//             console.error("Error fetching messages:", err);
//           }
//         };
  
//         fetchMessages();
//       }
//       // Update chatActiveUser state when activeUser changes
//       setChatActiveUser(activeUser);
//     }, [activeUser, chatActiveUser, authToken,value]);
//   // Fetch messages whenever chatActiveUser or conversationId changes
//   useEffect(() => {
//     if (chatActiveUser) {
//       const fetchMessages = async () => {
//         try {
//           const response = await fetch(
//             `http://127.0.0.1:5000/conversations/${chatActiveUser.conversationId}/messages`,
//             {
//               headers: { Authorization: `Bearer ${authToken}` },
//             }
//           );

//           if (!response.ok) {
//             console.error("Failed to fetch messages");
//             return;
//           }

//           const data = await response.json();
//           setMessages(data);
//         } catch (err) {
//           console.error("Error fetching messages:", err);
//         }
//       };

//       fetchMessages();
//     }
//     // Update chatActiveUser state when activeUser changes
//     setChatActiveUser(activeUser);
//   }, [activeUser, chatActiveUser, authToken]);

//   if (!chatActiveUser) {
//     return (
//       <div className="flex-grow bg-gray-900 p-4 flex items-center justify-center">
//         <IoMdChatbubbles className="text-white text-6xl mr-4" />
//         <h2 className="text-white text-xl">Select a user to start chatting</h2>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-grow bg-gray-600 p-4 flex flex-col justify-between">
//       {chatActiveUser.conversationId !== -1 && (
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center">
//             <img
//               src={chatActiveUser.profilePicture || "default-avatar.png"}
//               alt={chatActiveUser.expert_name}
//               className="w-12 h-12 rounded-full mr-3"
//             />
//             <div>
//               <p className="text-white">{chatActiveUser.expert_name}</p>
//               <p className="text-gray-400 text-sm">Online</p>
//             </div>
//           </div>
//         </div>
//       )}
//       <div className="flex-grow overflow-y-auto mb-4">
//         {messages.length > 0 ? (
//           messages.map((message, index) => (
//             <MessageBubble
//               key={index}
//               message={message}
//               activeUser={{ ...chatActiveUser, isAdmin: false }}
//             />
//           ))
//         ) : (
//           <div className="text-gray-400 text-center mt-4">
//             No messages yet. Start the conversation!
//           </div>
//         )}
//       </div>
//       <MessageInput
//         sendMessage={(content, attachments) =>
//           sendMessage(chatActiveUser.conversationId, content, attachments).then(
//             (data) => {
//               if (data) {
//                 setMessages((prev) => [...prev, data]);
//               }
//             }
//           )
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
// const useConversation = (authToken, conversationId) => {
//   const [messages, setMessages] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchMessages = async () => {
//     if (!conversationId) return;
    
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `https://backendstudypage.onrender.com/conversations/${conversationId}/messages`,
//         {
//           headers: { Authorization: `Bearer ${authToken}` },
//         }
//       );

//       const data = await response.json();
//       setMessages(data);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const pic = localStorage.getItem('teacherpic')

//   useEffect(() => {
//     fetchMessages();
//   }, [conversationId, authToken]);

//   return { messages, setMessages, error, loading, fetchMessages };
// };

// const ChatWindow = ({ activeUser, currentUser, auth, teacher,pic, isInModal,teach }) => {
//   console.log('chatgagactiveuserteach',teacher)
//   const [chatActiveUser, setChatActiveUser] = useState(activeUser || null);
//   const { authToken } = useContext(UserContext);
//   const { messages, setMessages, error, loading } = useConversation(
//     authToken,
//     chatActiveUser?.conversationId
//   );
  
//   // Add ref for the messages container
//   const messagesEndRef = useRef(null);
//   const messagesContainerRef = useRef(null);

//   // Scroll to bottom function
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   // Auto scroll when new messages arrive
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Handle initial scroll position when messages load
//   useEffect(() => {
//     if (!loading && messages.length > 0) {
//       scrollToBottom();
//     }
//   }, [loading, messages]);

//   useEffect(() => {
//     setChatActiveUser(activeUser);
//   }, [activeUser]);

//   const sendMessage = async (conversationId, content, attachments) => {
//     try {

//       // const response = await fetch(`https://backendstudypage.onrender.com/conversations/${conversationId}/messages`, {
//       //   method: 'POST',
//       //   headers: {
//       //     'Authorization': `Bearer ${authToken}`,
//       //   },
//       //   body: formData,
//       // });

//       const formData = new FormData();
      
//       if (conversationId === -1) {
//         formData.append("expert_id", teacher.id);
//         formData.append("content", content);
//         attachments.forEach((file) => formData.append("attachments", file));

//         const conversationResponse = await fetch(
//           `https://backendstudypage.onrender.com/conversations/${conversationId}/messages`,
//           {
//             method: "POST",
//             headers: { Authorization: `Bearer ${authToken}` },
//             body: formData,
//           }
//         );

//         if (!conversationResponse.ok) {
//           throw new Error("Failed to create conversation");
//         }

//         const { conversation_id } = await conversationResponse.json();
//         setChatActiveUser((prev) => ({
//           ...prev,
//           conversationId: conversation_id,
//         }));
//         console.log('chatactivenoewnow',chatActiveUser)
        
//         return sendMessage(conversation_id, content, attachments);
//       }

//       formData.append("content", content);
//       attachments.forEach((file) => formData.append("attachments", file));

//       const response = await fetch(
//         `https://backendstudypage.onrender.com/conversations/${conversationId}/messages`,
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
//       console.log('chatactivenoewnow',data)
//       return { ...data, conversationId };
//     } catch (error) {
//       throw new Error(`Failed to send message: ${error.message}`);
//     }
//   };

//   useEffect(() => {
//     if (activeUser) {
//       const fetchMessages = async () => {
//         try {
//           const response = await fetch(
//             `https://backendstudypage.onrender.com/conversations/${activeUser.conversationId}/messages`,
//             {
//               headers: { Authorization: `Bearer ${authToken}` }, 
//             }
//           );
  
//           if (!response.ok) {
//             console.error("Failed to fetch messages");
//             return;
//           }
  
//           const data = await response.json();
//           console.log("Fetched messages for client:", data);
//           setMessages(data);
//         } catch (err) {
//           console.error("Error fetching messages:", err);
//         }
//       };
  
//       fetchMessages();
//     }
//   }, [activeUser, authToken]);
  

//   if (!activeUser) {

//   if (!chatActiveUser) {

//     return (
//       <div className={`${isInModal ? 'h-full' : 'flex-grow'} bg-gray-900 p-4 flex items-center justify-center`}>
//         <IoMdChatbubbles className="text-white text-6xl mr-4" />
//         <h2 className="text-white text-xl">Select a user to start chatting</h2>
//       </div>
//     );
//   }

//   return (
//     <div className={`${isInModal ? 'h-full' : 'flex-grow h-screen'} flex flex-col bg-gray-600`}>
//       { !isInModal && (
//         <div className="flex items-center justify-between mb-6 bg-gray-400">
//           <div className="flex items-center ml-4">
//             <img
//               src={pic }
//               alt={chatActiveUser.expert_name}
//               className="w-10 h-10 rounded-full mr-3"
//             />
//             <div>
//               <p className="text-white">{chatActiveUser.expert_name}</p>
//               <p className="text-gray-700 text-sm">Online</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <div 
//         ref={messagesContainerRef}
//         className="flex-grow overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-700"
//       >
//         {loading ? (
//           <div className="text-white text-center">Loading messages...</div>
//         ) : messages.length > 0 ? (
//           <>
//             {messages.map((message, index) => (
//               <MessageBubble
//                 key={message.id || index}
//                 message={message}
//                 activeUser={{ ...chatActiveUser, isAdmin: false }}
//               />
//             ))}
//             <div ref={messagesEndRef} /> {/* Scroll anchor */}
//           </>
//         ) : (
//           <div className="text-gray-400 text-center mt-4">
//             No messages yet. Start the conversation!
//           </div>
//         )}
//       </div>

//       <MessageInput
//         sendMessage={(content, attachments) =>
//           sendMessage(chatActiveUser.conversationId, content, attachments)
//             .then((data) => {
//               if (data) {
//                 setMessages((prev) => [...prev, data]);
//               }
//             })
//             .catch((error) => {
//               console.error("Error sending message:", error);
//             })
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
  const pic = localStorage.getItem('teacherpic')

  useEffect(() => {
    fetchMessages();
  }, [conversationId, authToken]);

  return { messages, setMessages, error, loading, fetchMessages };
};

const ChatWindow = ({ activeUser, currentUser, auth, teacher, pic, isInModal, teach }) => {
  console.log('chatgagactiveuserteach', teacher)
  const [chatActiveUser, setChatActiveUser] = useState(activeUser || null);
  const { authToken } = useContext(UserContext);
  const { messages, setMessages, error, loading } = useConversation(
    authToken,
    chatActiveUser?.conversationId
  );
  
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
    if (activeUser) {
      const fetchMessages = async () => {
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
          setMessages(data);
        } catch (err) {
          console.error("Error fetching messages:", err);
        }
      };
  
      fetchMessages();
    }
  }, [activeUser, authToken]);

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
      <div className={`${isInModal ? 'h-full' : 'flex-grow h-screen'} flex flex-col bg-gray-600`}>
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
