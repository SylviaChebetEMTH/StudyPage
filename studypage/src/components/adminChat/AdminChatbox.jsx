// import React, { useState, useEffect,useContext } from "react";
// import MessageBubble from "../chatInterface/MessageBubble.jsx";
// import MessageInput from "../chatInterface/MessageInput.jsx";
// import { UserContext } from "../contexts/userContext";

// const AdminChatBox = ({ conversationId, conversationDetails }) => {
//   const [messages, setMessages] = useState([]);
//   const { authToken } = useContext(UserContext);
//   const [loading, setLoading] = useState(false);
//   console.log('conversation details admin',conversationDetails)

//   useEffect(() => {
//     if (conversationId) {
//       setLoading(true);
//       const fetchMessages = async () => {
//         try {
//           const response = await fetch(`https://studypage.onrender.com/conversations/${conversationId}/messages`, {
//             headers: { Authorization: `Bearer ${authToken}` },
//           });
  
//           if (!response.ok) {
//             const errorText = await response.text();
//             console.error(`Error Response: ${response.status} - ${errorText}`);
//             throw new Error(`Failed to fetch messages: ${response.status}`);
//           }
  
//           const data = await response.json();
//           setMessages(data);
//           console.log("Fetched messages for admin:", data);
//         } catch (error) {
//           console.error("Error fetching messages:", error);
//         }
//       };
//       setLoading(false);
//       fetchMessages();
//     }
//   }, [conversationId, authToken]);  

//   const sendMessage = async (conversationId, content, attachments) => {
//     const formData = new FormData();
//     formData.append('content', content);
//     formData.append('experts_id', content);
//     // formData.append('sender_type', 'admin');
//     attachments.forEach(file => formData.append('attachments', file));
  
//     try {
//       const response = await fetch(`https://studypage.onrender.com/conversationsadmin/${conversationId}/messages`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${authToken}`,
//         },
//         body: formData,
//       });
  
//       if (!response.ok) {
//         throw new Error("Failed to send message");
//       }
  
//       const data = await response.json();
//       console.log('Message sent successfully:', data);
//       return data;
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   if (!conversationId) {
//     return (
//       <div className="flex-grow bg-gray-900 p-4 flex items-center justify-center">
//         <h2 className="text-white text-xl">Select a conversation to start chatting</h2>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-grow bg-gray-900 p-4 flex flex-col justify-between">
//       {/* Conversation Header */}
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <p className="text-white text-lg">
//             Chat with: {conversationDetails.client} as {conversationDetails.expert}
//           </p>
//           {/* <p className="text-gray-400 text-sm">Conversation ID: {conversationId}</p> */}
//         </div>
//       </div>

//       {/* Message Display */}
//       <div className="flex-grow overflow-y-auto mb-4">
//         {messages.length > 0 ? (
//           messages.map((message, index) => (
//             <MessageBubble key={index} message={message} activeUser={{ ...conversationDetails, isAdmin: true  }}/>
//           ))
//         ) : (
//           <div className="text-gray-400 text-center mt-4">
//             No messages yet. Start the conversation!
//           </div>
//         )}
//       </div>
//       <MessageInput
//         sendMessage={(content, attachments) =>
//           sendMessage(conversationId, content, attachments).then((data) => {
//             if (data) {
//               setMessages((prev) => [...prev, data]);
//             }
//           })
//         }
//       />
//     </div>
//   );
// };

// export default AdminChatBox;



import React, { useState, useEffect, useContext, useRef } from "react";
import MessageBubble from "../chatInterface/MessageBubble.jsx";
import MessageInput from "../chatInterface/MessageInput.jsx";
import { UserContext } from "../contexts/userContext";

const AdminChatBox = ({ conversationId, conversationDetails, isInModal = false }) => {
  const [messages, setMessages] = useState([]);
  const { authToken } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  
  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    if (conversationId) {
      setLoading(true);
      const fetchMessages = async () => {
        try {
          const response = await fetch(`https://studypage.onrender.com/conversations/${conversationId}/messages`, {
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
        } finally {
          setLoading(false);
        }
      };
      
      fetchMessages();
    }
  }, [conversationId, authToken]);
  
  const sendMessage = async (content, attachments) => {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('experts_id', conversationDetails.expert_id || '');
    attachments.forEach(file => formData.append('attachments', file));
    
    try {
      const response = await fetch(`https://studypage.onrender.com/conversationsadmin/${conversationId}/messages`, {
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
      setMessages((prev) => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  if (!conversationId) {
    return (
      <div className="flex-grow bg-gray-900 p-4 flex flex-col items-center justify-center">
        <svg className="w-16 h-16 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h2 className="text-white text-xl font-medium">Select a conversation</h2>
        <p className="text-gray-400 text-sm mt-2">Choose a chat from the sidebar to get started</p>
      </div>
    );
  }
  
  // Extract first initials for avatar
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };
  
  const expertInitial = getInitials(conversationDetails.expert);
  const clientInitial = getInitials(conversationDetails.client);
  
  return (
    <div className={`${isInModal ? "h-full" : "h-screen"} flex flex-col bg-gray-900 
                    ${window.innerWidth < 768 && !isInModal ? "fixed inset-0" : ""}`}>
      {/* Conversation Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {clientInitial}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {expertInitial}
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <p className="text-gray-200 font-medium">{conversationDetails.client}</p>
              <span className="mx-2 text-gray-500">•</span>
              <p className="text-gray-400 text-sm">As: {conversationDetails.expert}</p>
            </div>
            <p className="text-sm text-gray-400">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              Active conversation
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-700 text-gray-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-700 text-gray-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Message Display */}
      <div ref={messagesContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
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
                activeUser={{ ...conversationDetails, isAdmin: true }}
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
      <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-3">
        <MessageInput
          sendMessage={(content, attachments) => sendMessage(content, attachments)}
          placeholder="Message as admin..."
        />
      </div>
    </div>
  );
};

export default AdminChatBox;