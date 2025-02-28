// import React, { useState } from "react";
// import AdminSidebar from "./AdminSidebar";
// import AdminChatBox from "./AdminChatbox";
// import { useLocation } from "react-router-dom";

// const AdminPanel = () => {
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const location = useLocation();
//   const { authToken } = location.state || {};
//   console.log("AuthToken in AdminPanel:", authToken);

//   return (
//     <div className="w-full md:w-80 bg-gray-800 border-r border-gray-700 flex h-screen">
//       {/* Sidebar for selecting conversations */}
//       <AdminSidebar
//         onSelectConversation={setSelectedConversation}
//         authToken={authToken}
//       />
//       {/* Chatbox for the selected conversation */}
//       {selectedConversation ? (
//         <AdminChatBox
//           conversationId={selectedConversation.conversationId}
//           conversationDetails={{
//             client: selectedConversation.client,
//             expert: selectedConversation.expert,
//           }}
//           authToken={authToken}
//         />
//       ) : (
//         <div className="w-3/4 flex items-center justify-center bg-gray-900">
//           <p className="text-gray-400">Select a conversation to view messages</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminPanel;



import React, { useState, useContext } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminChatBox from "./AdminChatbox";
import { UserContext } from "../contexts/userContext";

const AdminPanel = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const { authToken } = useContext(UserContext);

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      {/* Sidebar for conversations - fixed width on larger screens, hidden by default on mobile */}
      <div className="hidden md:block md:w-80 h-full flex-shrink-0">
        <AdminSidebar onSelectConversation={setSelectedConversation} />
      </div>

      {/* Mobile sidebar - shown when menu is opened */}
      <div className="md:hidden">
        {/* You could add a mobile navigation toggle here */}
      </div>

      {/* Main chat area - takes remaining width */}
      <div className="flex-1 flex flex-col h-full">
        {selectedConversation ? (
          <AdminChatBox
            conversationId={selectedConversation.conversationId}
            conversationDetails={{
              client: selectedConversation.client,
              expert: selectedConversation.expert,
              expert_id: selectedConversation.expert_id
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-900">
            <div className="text-center p-8 max-w-md">
              <svg 
                className="w-20 h-20 mx-auto mb-6 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                />
              </svg>
              <h2 className="text-xl font-medium text-white mb-2">Welcome to Admin Chat</h2>
              <p className="text-gray-400 mb-6">
                Select a conversation from the sidebar to view and respond to messages.
              </p>
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping mr-2"></div>
                <p className="text-sm text-gray-500">
                  Waiting for selection...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;