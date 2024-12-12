import React, { useEffect, useState } from "react";

const AdminSidebar = ({ onSelectConversation, authToken }) => {
  const [conversations, setConversations] = useState([]);
  console.log('authToken in AdminSidebar',authToken)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/admin/conversations", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setConversations([]); // Optional: Clear conversations on error
      }
    };
  
    fetchConversations();
  }, [authToken]);
  

  return (
    <div className="w-1/4 bg-gray-800 text-white p-4">
      <h2 className="text-lg font-bold mb-4">Conversations</h2>
      <ul>
        {conversations.map((conv) => (
          <li
            key={conv.conversation_id}
            className="p-2 hover:bg-gray-700 cursor-pointer"
            onClick={() => onSelectConversation(conv.conversation_id)}
          >
            {conv.client} to {conv.expert}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
