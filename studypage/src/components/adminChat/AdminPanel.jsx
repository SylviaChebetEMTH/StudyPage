import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminChatBox from "./AdminChatbox";
import { useLocation } from "react-router-dom";

const AdminPanel = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const location = useLocation();
  const { authToken } = location.state || {};
  console.log('AuthToken in AdminPanel:',authToken)

  return (
    <div className="flex h-screen">
      <AdminSidebar onSelectConversation={setSelectedConversation} authToken={authToken} />
      {selectedConversation ? (
        <AdminChatBox conversationId={selectedConversation} authToken={authToken} />
      ) : (
        <div className="w-3/4 flex items-center justify-center">
          <p className="text-gray-500">Select a conversation to view messages</p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
