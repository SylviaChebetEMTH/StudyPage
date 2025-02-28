// import React, { useEffect, useState } from "react";

// const AdminSidebar = ({ onSelectConversation, authToken }) => {
//   const [conversations, setConversations] = useState([]);
//   console.log("authToken in AdminSidebar", authToken);

//   useEffect(() => {
//     const fetchConversations = async () => {
//       try {
//         const response = await fetch("http://127.0.0.1:5000/admin/conversations", {
//           headers: { Authorization: `Bearer ${authToken}` },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         setConversations(data);
//       } catch (error) {
//         console.error("Error fetching conversations:", error);
//         setConversations([]); // Optional: Clear conversations on error
//       }
//     };

//     fetchConversations();
//   }, [authToken]);

//   return (
//     <div className="w-1/4 bg-gray-800 text-white p-4 h-screen overflow-y-auto">
//       <h2 className="text-lg font-bold mb-6 border-b border-gray-600 pb-2">Conversations</h2>
//       <ul className="space-y-4">
//         {conversations.map((conv) => (
//           <li
//             key={conv.conversation_id}
//             className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors duration-200"
//             onClick={() =>
//               onSelectConversation({
//                 conversationId: conv.conversation_id,
//                 client: conv.client,
//                 expert: conv.expert,
//               })
//             }
//           >
//             {/* Profile Image */}
//             {/* <img
//               src={conv.image}
//               alt={conv.client_name}
//               className="w-full h-12 rounded-full mr-4 object-cover"
//             /> */}
//             {/* Conversation Details */}
//             <div className="flex-1">
//             <p className="text-white font-medium truncate">
//               Client <span className="font-bold text-yellow-400 text-lg">{conv.client}</span> to Expert <span className="font-bold text-blue-400 text-lg">{conv.expert}</span>
//             </p>
//               <p className="text-gray-400 text-sm truncate">{conv.message}</p>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default AdminSidebar;

import React, { useEffect, useState, useContext } from "react";
import { FileIcon } from "lucide-react";
import { UserContext } from "../contexts/userContext";
import { Link } from "react-router-dom"; // Added Link import

const AdminSidebar = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const { authToken } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);

      try {
        const response = await fetch("https://studypage.onrender.com/admin/conversations", {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Sort conversations by last message timestamp
        const sortedData = data.sort((a, b) => {
          const timeA = a.last_timestamp ? new Date(a.last_timestamp) : new Date(a.created_at);
          const timeB = b.last_timestamp ? new Date(b.last_timestamp) : new Date(b.created_at);
          return timeB - timeA;
        });
        setConversations(sortedData);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setConversations([]);
      }
      setLoading(false);
    };

    fetchConversations();
  }, [authToken]);

  // Format timestamp to a readable format
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full md:w-80 bg-gray-800 border-r border-gray-700 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-gray-100 text-xl font-semibold">Conversations</h1>
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
              <div
                key={conv.conversation_id}
                className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors duration-200"
                onClick={() =>
                  onSelectConversation({
                    conversationId: conv.conversation_id,
                    client: conv.client,
                    expert: conv.expert,
                  })
                }
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-gray-200 font-medium">
                      <span className="text-yellow-400">{conv.client}</span> → <span className="text-blue-400">{conv.expert}</span>
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatTime(conv.last_timestamp || conv.created_at)}
                  </span>
                </div>
                
                <div className="text-gray-300 text-sm truncate flex items-center gap-2">
                  {conv.is_file && <FileIcon className="w-4 h-4 flex-shrink-0 text-gray-400" />}
                  <p className="truncate">{conv.last_message || "No messages yet"}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
              <p className="text-center mb-2">No conversations yet</p>
              <p className="text-sm text-gray-500">
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

export default AdminSidebar;