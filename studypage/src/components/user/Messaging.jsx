import React, { useState } from "react";
<<<<<<< HEAD
import Sidebar from "../chat-interface/Sidebar";
import ChatWindow from "../chat-interface/ChatWindow";
=======
import ChatWindow from "../chatInterface/ChatWindow";
import Sidebar from "../chatInterface/Sidebar";
>>>>>>> 7cd388f (fixed import bugs)

const Messaging = () => {
  const [activeUser, setActiveUser] = useState(null); 
  // console.log('activeuser in messaging section',activeUser)

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar setActiveUser={setActiveUser} />

      {activeUser ? (
        <ChatWindow activeUser={activeUser} />
      ) : (
        <div className="flex-grow flex items-center justify-center text-white">
          <p>Select a user to start chatting!</p>
        </div>
      )}
    </div>
  );
};

export default Messaging;