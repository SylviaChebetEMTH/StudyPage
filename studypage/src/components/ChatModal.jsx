import React, { useState, useEffect, useContext } from 'react';
import { X } from 'lucide-react';
import ChatWindow from './chatInterface/ChatWindow';
import { UserContext } from './contexts/userContext';

const ChatModal = ({ auth, curUser, teacher, onClose, teach }) => {
  const { authToken } = useContext(UserContext);
  const [conversationId, setConversationId] = useState(-1);
  const [activeUser, setActiveUser] = useState({
    conversationId: -1,
    expert_id: teacher.id,
    expert_name: teacher.name,
    profilePicture: teacher.profilePicture
  });

  // Store teacher profile picture in localStorage
  useEffect(() => {
    localStorage.setItem('teacherpic', teacher.profilePicture);
  }, [teacher.profilePicture]);

  // Fetch conversation ID if it exists
  useEffect(() => {
    const fetchConversationId = async () => {
      try {
        const response = await fetch(
          `https://studypage.onrender.com/conversationsid/${teacher.id}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${authToken}` }
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch conversation ID");
        }

        const data = await response.json();
        if (data.length > 0) {
          setConversationId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching conversation ID:", error);
      }
    };

    fetchConversationId();
  }, [teacher.id, authToken]);

  return (  
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 w-full max-w-4xl h-[80vh] rounded-lg flex flex-col overflow-auto">
        {/* Fixed Header */}
        <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-700 bg-gray-900">
          <div className="flex items-center">
            <img 
              src={teacher.profilePicture} 
              alt={teacher.name} 
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="text-white">{teacher.name}</p>
              <p className="text-gray-400 text-sm">Online</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:bg-gray-700 p-2 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Chat Window Container - Takes remaining height */}
        <div className="flex-1 overflow-auto">
          <ChatWindow 
            activeUser={{ ...activeUser, conversationId }} 
            auth={authToken}
            pic={teach}
            teacher={teacher}
            curreUser={curUser}
            isInModal={true}
            converseId={conversationId}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
