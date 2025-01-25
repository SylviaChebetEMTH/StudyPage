import React, { useState, useContext } from 'react';
import { X } from 'lucide-react';
import ChatWindow from './chatInterface/ChatWindow';
// import ChatWindow from './ChatWindow';
// import { UserContext } from '../contexts/userContext';
import { UserContext } from './contexts/userContext';

const ChatModal = ({ expert, onClose }) => {
  const { currentUser, authToken } = useContext(UserContext);
  const [activeUser, setActiveUser] = useState({
    conversationId: -1,  // Signal for new conversation
    expert_id: expert.id,
    expert_name: expert.name,
    image: expert.profilePicture
  });

  const initiateConversation = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          expert_id: expert.id,
          project_id: null  // You might want to add project context later
        })
      });

      if (!response.ok) {
        throw new Error('Failed to initiate conversation');
      }

      const data = await response.json();
      setActiveUser(prev => ({
        ...prev,
        conversationId: data.conversation_id
      }));
    } catch (error) {
      console.error('Conversation initiation error:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 w-full max-w-4xl h-[80vh] rounded-lg flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div className="flex items-center">
            <img 
              src={expert.profilePicture} 
              alt={expert.name} 
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
                <p className="text-white">{expert.name}</p>
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
        <ChatWindow 
          activeUser={activeUser} 
          initiateConversation={initiateConversation}
        />
      </div>
    </div>
  );
};

export default ChatModal;