import React, { useEffect, useState } from "react";

const AdminSidebar = ({ onSelectConversation, authToken }) => {
  const [conversations, setConversations] = useState([]);
  console.log("authToken in AdminSidebar", authToken);

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
    <div className="w-1/4 bg-gray-800 text-white p-4 h-screen overflow-y-auto">
      <h2 className="text-lg font-bold mb-6 border-b border-gray-600 pb-2">Conversations</h2>
      <ul className="space-y-4">
        {conversations.map((conv) => (
          <li
            key={conv.conversation_id}
            className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors duration-200"
            onClick={() =>
              onSelectConversation({
                conversationId: conv.conversation_id,
                client: conv.client,
                expert: conv.expert,
              })
            }
          >
            {/* Profile Image */}
            {/* <img
              src={conv.image}
              alt={conv.client_name}
              className="w-full h-12 rounded-full mr-4 object-cover"
            /> */}
            {/* Conversation Details */}
            <div className="flex-1">
            <p className="text-white font-medium truncate">
              Client <span className="font-bold text-yellow-400 text-lg">{conv.client}</span> to Expert <span className="font-bold text-blue-400 text-lg">{conv.expert}</span>
            </p>
              <p className="text-gray-400 text-sm truncate">{conv.message}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
