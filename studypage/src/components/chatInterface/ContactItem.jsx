import React from "react";
import { FileIcon, MessageCircle } from "lucide-react";
import { useSocket } from '../contexts/SocketContext.js';
import { useUserContext } from '../contexts/userContext'
const ContactItem = ({ contact, setActiveUser }) => {
  const { setUnreadCounts,setActiveConversation } = useSocket();
  const { authToken } = useUserContext();
  const handleClick = async () => {
    setActiveUser(contact);
    setActiveConversation(contact.conversationId);

    if (contact.unread_count > 0) {
      try {
        const response = await fetch(`https://studypage.onrender.com/conversations/${contact.conversationId}/mark-read`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,  // Use the token from context
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setUnreadCounts(prev => ({
            ...prev,
            [contact.conversationId]: 0
          }));
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
  };

  return (
    <div
      className="group flex items-center p-2 lg:p-3 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-all duration-200"
      onClick={handleClick}
    >
      <div className="flex-shrink-0">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white font-semibold relative shadow-md">
          {contact.expert_name?.charAt(0).toUpperCase()}
          {contact.unread_count > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center shadow-lg">
              {contact.unread_count}
            </span>
          )}
        </div>
      </div>

      <div className="ml-3 lg:ml-4 flex-grow min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-gray-200 font-medium truncate group-hover:text-white transition-colors text-sm lg:text-base">
            {contact.expert_name}
          </p>
          <span className="text-xs text-gray-500 ml-2">
            {new Date(contact.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          {contact.condition ? (
            <FileIcon className="w-3 h-3 text-gray-400" />
          ) : (
            <MessageCircle className="w-3 h-3 text-gray-400" />
          )}
          <p className="text-gray-400 text-xs lg:text-sm truncate">
            {contact.message || "No messages yet"}
          </p>
        </div>
      </div>
    </div>
  );
};

//   return (
//     <div
//       className="flex p-4 bg-gray-700 rounded-lg hover:bg-gray-500 cursor-pointer transition-colors duration-200"
//       onClick={handleClick}
//     >
//       <div className="flex-shrink-0">
//         <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white relative">
//           {contact.expert_name?.charAt(0).toUpperCase()}
//           {contact.unread_count > 0 && (
//             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//               {contact.unread_count}
//             </span>
//           )}
//         </div>
//       </div>

//       <div className="ml-4 flex-grow overflow-hidden">
//         <p className="text-white font-medium flex items-center">
//           {contact.expert_name}
//           {contact.unread_count > 0 && (
//             <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"/>
//           )}
//         </p>
        
//         <div className="flex items-center gap-2 text-sm text-gray-400">
//           {contact.is_file ? (
//             <FileIcon className="w-4 h-4" />
//           ) : (
//             <MessageCircle className="w-4 h-4" />
//           )}
//           <p className="text-gray-400 truncate text-sm">
//             {contact.message || "No messages yet"}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

export default ContactItem;