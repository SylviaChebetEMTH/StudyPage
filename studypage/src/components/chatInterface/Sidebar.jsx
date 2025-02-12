import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/userContext";
import ContactItem from "./ContactItem";
import { useSocket } from '../contexts/SocketContext';

const Sidebar = ({ setActiveUser }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true); // New state for loading
  const { authToken } = useContext(UserContext);
  const { unreadCounts } = useSocket();

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch("https://studypage.onrender.com/conversations", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = await response.json();

        const uniqueConversations = Array.from(
          new Set(data.map(conv => conv.id))
        ).map(id => data.find(conv => conv.id === id));

        const updatedData = uniqueConversations.map(conv => ({
          ...conv,
          unread_count: (conv.unread_count || 0) + (unreadCounts[conv.id] || 0)
        })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setConversations(updatedData);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setConversations([]);
      }
      setLoading(false); // Stop loading
    };

    fetchConversations();
  }, [authToken, unreadCounts]);

  return (
    <div className="w-full md:w-1/4 bg-gray-800 p-4 h-screen flex flex-col">
      <h1 className="text-white text-xl mb-4">Recent Chats</h1>
      <div className="overflow-y-auto flex-grow space-y-2 pr-2">
        {loading ? (
          <div className="text-white text-center py-4">
            <span className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full inline-block"></span>
            <p className="mt-2">Loading chats...</p>
          </div>
        ) : (
          conversations.length > 0 ? (
            conversations.map((conv) => (
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
            ))
          ) : (
            <p className="text-gray-400 text-center">No conversations found.</p>
          )
        )}
      </div>
    </div>
  );
};

export default Sidebar;
