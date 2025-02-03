// import React, {useEffect,useState,useContext} from "react";
// import { UserContext } from "../contexts/userContext";
// import ContactItem from "./ContactItem";

// const Sidebar = ({ setActiveUser }) => {
//   const [conversations, setConversations] = useState([]);
//   const { authToken } = useContext(UserContext);

//   useEffect(() => {
//     const fetchConversations = async () => {
//       const response = await fetch("http://127.0.0.1:5000/conversations", {
//         headers: { Authorization: `Bearer ${authToken}` },
//       });
//       const data = await response.json();
//       setConversations(data);
//     };
  
//     fetchConversations();
//   }, [authToken]);
  
//   return (
//     <div className="w-full md:w-1/4 bg-gray-800 p-4">
//       <h1 className="text-white text-xl">Recent Chats</h1>
//       {conversations.map((conv) => (
//         <ContactItem
//           key={conv.id}
//           contact={{
//             expert_name: conv.expert?.expert_name || "Unknown Expert",
//             expert_id: conv.expert?.id || null,
//             conversationId: conv.id,
//             client_name: conv.client?.client_name || "Unknown Client",
//             client_id: conv.client?.id || null, 
//             message: conv.latest_message
//           }}
//           setActiveUser={setActiveUser}
//         />
//       ))}
//     </div>
//   );
// };

// export default Sidebar;


import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/userContext";
import ContactItem from "./ContactItem";
import { useSocket } from '../contexts/SocketContext';

const Sidebar = ({ setActiveUser }) => {
  const [conversations, setConversations] = useState([]);
  const { authToken } = useContext(UserContext);
  const { unreadCounts } = useSocket();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch("https://backendstudypage.onrender.com/conversations", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = await response.json();
        
        // Sort conversations by latest message timestamp (if you add timestamp to your backend)
        const sortedConversations = data.sort((a, b) => {
          return new Date(b.timestamp) - new Date(a.timestamp);
        });
        
        const updatedData = sortedConversations.map(conv => ({
          ...conv,
          unread_count: (conv.unread_count || 0) + (unreadCounts[conv.id] || 0)
        }));
        
        setConversations(updatedData);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setConversations([]);
      }
    };

    fetchConversations();
  }, [authToken, unreadCounts]);

  return (
    <div className="w-full md:w-1/4 bg-gray-800 p-4">
      <h1 className="text-white text-xl mb-4">Recent Chats</h1>
      <div className="space-y-2">
        {conversations.map((conv) => (
          <ContactItem
            key={conv.id}
            contact={{
              expert_name: conv.expert?.expert_name || "Unknown Expert",
              expert_id: conv.expert?.id,
              conversationId: conv.id,
              client_name: conv.client?.client_name || "Unknown Client",
              client_id: conv.client?.id,
              message: conv.latest_message,
              timestamp: conv.timestamp,
              condition: conv.is_file,
              unread_count: conv.unread_count
            }}
            setActiveUser={setActiveUser}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;