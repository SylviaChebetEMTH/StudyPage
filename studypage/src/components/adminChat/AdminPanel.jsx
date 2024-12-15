import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminChatBox from "./AdminChatbox";
import { useLocation } from "react-router-dom";

const AdminPanel = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const location = useLocation();
  const { authToken } = location.state || {};
  console.log("AuthToken in AdminPanel:", authToken);

  return (
    <div className="flex h-screen">
      {/* Sidebar for selecting conversations */}
      <AdminSidebar
        onSelectConversation={setSelectedConversation}
        authToken={authToken}
      />
      {/* Chatbox for the selected conversation */}
      {selectedConversation ? (
        <AdminChatBox
          conversationId={selectedConversation.conversationId}
          conversationDetails={{
            client: selectedConversation.client,
            expert: selectedConversation.expert,
          }}
          authToken={authToken}
        />
      ) : (
        <div className="w-3/4 flex items-center justify-center bg-gray-900">
          <p className="text-gray-400">Select a conversation to view messages</p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
