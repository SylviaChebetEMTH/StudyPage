// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contexts/userContext";
// import MessageInput from "./MessageInput";
// import MessageBubble from "./MessageBubble";
// import { IoMdChatbubbles } from "react-icons/io";

// const ChatWindow = ({activeUser,curreUser,auth,teacher }) => {
//   const [messages, setMessages] = useState([]);
//   // const [chatActiveUser, setChatActiveUser] = useState(initialActiveUser);
//   const [chatActiveUser, setChatActiveUser] = useState(activeUser || null);
//   const { authToken } = useContext(UserContext);
//   // console.log("client's auth token",authToken)

//   const sendMessage = async (conversationId, content, attachments) => {
//     if (conversationId === -1) {
//       try {
//         const formData = new FormData();
//         formData.append('expert_id', teacher.id);
//         formData.append('content', content);
//         attachments.forEach(file => formData.append('attachments', file));
  
//         const conversationResponse = await fetch(`http://127.0.0.1:5000/conversations/${conversationId}/messages`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${authToken}`
//           },
//           body: formData
//         });
  
//         if (!conversationResponse.ok) {
//           throw new Error("Failed to create conversation");
//         }
  
//         const conversationData = await conversationResponse.json();
//         conversationId = conversationData.id; // Use 'id' instead of 'conversation_id'
//       } catch (error) {
//         console.error('Error creating conversation:', error);
//         return null;
//       }
//     }
//     const formData = new FormData();
//     formData.append('content', content);
//     // formData.append('expert_id', activeUser.expert_id);
//     // formData.append('user_id',curreUser.id)
//     attachments.forEach(file => formData.append('attachments', file));
  
//     try {
//       const response = await fetch(`http://127.0.0.1:5000/conversations/${conversationId}/messages`, {
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
//       // console.log('Message sent successfully:', data);
//       // return data;
//       return { ...data, conversationId };
//     } catch (error) {
//       console.error('Error sending message:', error);
//       return null
//     }
//   };
  

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
//           console.log("Fetched messages for client:", data);
//           setMessages(data);
//         } catch (err) {
//           console.error("Error fetching messages:", err);
//         }
//       };
  
//       fetchMessages();
//     }
//     setChatActiveUser(activeUser);
//   }, [activeUser,chatActiveUser, authToken]);
//   console.log('activeusersersr',chatActiveUser)
  

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
//             <MessageBubble key={index} message={message} activeUser={{ ...chatActiveUser, isAdmin: false }} />
            
//           ))
//         ) : (
//           <div className="text-gray-400 text-center mt-4">
//             No messages yet. Start the conversation!
//           </div>
//         )}
//       </div>
//       <MessageInput
//         sendMessage={(content, attachments) =>
//           sendMessage(chatActiveUser.conversationId, content, attachments).then((data) => {
//             if (data) {
//               setMessages((prev) => [...prev, data]);
//             }
//           })
//         }
//       />
//     </div>
//   );
// };

// export default ChatWindow;


import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/userContext";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import { IoMdChatbubbles } from "react-icons/io";

const ChatWindow = ({ activeUser, curreUser, auth, teacher }) => {
  const [messages, setMessages] = useState([]);
  const [chatActiveUser, setChatActiveUser] = useState(activeUser || null);
  const { authToken } = useContext(UserContext);

  // Send message function
  const sendMessage = async (conversationId, content, attachments) => {
    if (conversationId === -1) {
      try {
        const formData = new FormData();
        formData.append("expert_id", teacher.id);
        formData.append("content", content);
        attachments.forEach((file) => formData.append("attachments", file));

        const conversationResponse = await fetch(
          `http://127.0.0.1:5000/conversations/${conversationId}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            body: formData,
          }
        );

        if (!conversationResponse.ok) {
          throw new Error("Failed to create conversation");
        }

        const conversationData = await conversationResponse.json();
        conversationId = conversationData.id; // Use 'id' as the new conversation ID

        // Update chatActiveUser with the new conversation ID
        setChatActiveUser((prev) => ({
          ...prev,
          conversationId,
        }));
      } catch (error) {
        console.error("Error creating conversation:", error);
        return null;
      }
    }

    const formData = new FormData();
    formData.append("content", content);
    attachments.forEach((file) => formData.append("attachments", file));

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      return { ...data, conversationId };
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  };

  // Fetch messages whenever chatActiveUser or conversationId changes
  useEffect(() => {
    if (chatActiveUser) {
      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:5000/conversations/${chatActiveUser.conversationId}/messages`,
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
    // Update chatActiveUser state when activeUser changes
    setChatActiveUser(activeUser);
  }, [activeUser, chatActiveUser, authToken]);

  if (!chatActiveUser) {
    return (
      <div className="flex-grow bg-gray-900 p-4 flex items-center justify-center">
        <IoMdChatbubbles className="text-white text-6xl mr-4" />
        <h2 className="text-white text-xl">Select a user to start chatting</h2>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-gray-600 p-4 flex flex-col justify-between">
      {chatActiveUser.conversationId !== -1 && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img
              src={chatActiveUser.profilePicture || "default-avatar.png"}
              alt={chatActiveUser.expert_name}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div>
              <p className="text-white">{chatActiveUser.expert_name}</p>
              <p className="text-gray-400 text-sm">Online</p>
            </div>
          </div>
        </div>
      )}
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              activeUser={{ ...chatActiveUser, isAdmin: false }}
            />
          ))
        ) : (
          <div className="text-gray-400 text-center mt-4">
            No messages yet. Start the conversation!
          </div>
        )}
      </div>
      <MessageInput
        sendMessage={(content, attachments) =>
          sendMessage(chatActiveUser.conversationId, content, attachments).then(
            (data) => {
              if (data) {
                setMessages((prev) => [...prev, data]);
              }
            }
          )
        }
      />
    </div>
  );
};

export default ChatWindow;
