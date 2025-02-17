import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/userContext";
import ContactItem from "./ContactItem";
import { useSocket } from '../contexts/SocketContext';
import { Link } from "react-router-dom";

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
        console.log('sidebardata',data)

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
    <div className="w-full md:w-80 bg-gray-800 border-r border-gray-700 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-gray-100 text-xl font-semibold">Recent Chats</h1>
      </div>
      <div className="overflow-y-auto flex-grow space-y-2 p-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
            <p>Loading conversations...</p>
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
            <div className="flex flex-col items-center h-full text-gray-400">
              {/* <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg> */}
              <p className="text-center">No conversations yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Start a new chat at the{" "}
                <Link to="/expertspage" className="text-blue-400 hover:underline">
                  expert's page
                </Link>
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

//   return (
//     <div className="w-full md:w-1/4 bg-gray-800 p-4 h-screen flex flex-col">
//       <h1 className="text-white text-xl mb-4">Recent Chats</h1>
//       <div className="overflow-y-auto flex-grow space-y-2 pr-2">
//         {loading ? (
//           <div className="text-white text-center py-4">
//             <span className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full inline-block"></span>
//             <p className="mt-2">Loading chats...</p>
//           </div>
//         ) : (
//           conversations.length > 0 ? (
//             conversations.map((conv) => (
//               <ContactItem
//                 key={conv.id}
//                 contact={{
//                   expert_name: conv.expert?.name || "Unknown Expert",
//                   expert_id: conv.expert?.id,
//                   conversationId: conv.id,
//                   client_name: conv.client?.client_name || "Unknown Client",
//                   client_id: conv.client?.id,
//                   message: conv.latest_message,
//                   timestamp: conv.timestamp,
//                   condition: conv.is_file,
//                   unread_count: conv.unread_count
//                 }}
//                 setActiveUser={setActiveUser}
//               />
//             ))
//           ) : (
//             <p className="text-gray-400 text-center">No conversations found.</p>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

export default Sidebar;
