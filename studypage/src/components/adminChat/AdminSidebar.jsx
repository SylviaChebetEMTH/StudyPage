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


import React, { useEffect, useState } from "react";
import { FileIcon, MessageSquare } from "lucide-react";

const AdminSidebar = ({ onSelectConversation, authToken }) => {
  const [conversations, setConversations] = useState([]);

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
    };

    fetchConversations();
  }, [authToken]);

  return (
    <div className="w-1/4 bg-gray-800 text-white p-4 h-screen overflow-y-auto">
      <h2 className="text-lg font-bold mb-6 border-b border-gray-600 pb-2">
        Conversations
      </h2>
      <div className="space-y-4">
        {conversations.map((conv) => (
          <div
            key={conv.conversation_id}
            className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors duration-200"
            onClick={() =>
              onSelectConversation({
                conversationId: conv.conversation_id,
                client: conv.client,
                expert: conv.expert,
              })
            }
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex-1">
              <p className="text-white font-medium truncate">
              Client <span className="font-bold text-yellow-400 text-md">{conv.client}</span> to Expert <span className="font-bold text-blue-400 text-md">{conv.expert}</span>
            </p>
                {/* <p className="text-sm text-gray-400">Client</p>
                <p className="font-medium text-yellow-400">{conv.client}</p> */}
              </div> 
              {/* <div className="flex-1 text-right">
                <p className="text-sm text-gray-400">Expert</p>
                <p className="font-medium text-blue-400">{conv.expert}</p>
              </div> */}
            </div>

            <div className="mt-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                {conv.is_file ? (
                  <FileIcon className="w-4 h-4" />
                ) : (
                  <></>
                )}
                {/* <span>Latest Message</span> */}
              </div>
              <p className="text-white truncate flex items-center gap-2">
                {conv.last_message}
              </p>
            </div>
            
            {/* <div className="mt-2 text-xs text-gray-400">
              {conv.last_timestamp ? (
                <p>Last active: {new Date(conv.last_timestamp).toLocaleString()}</p>
              ) : (
                <p>Created: {new Date(conv.created_at).toLocaleString()}</p>
              )}
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;