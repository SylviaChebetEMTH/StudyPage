// import React from "react";
// import { FileIcon, MessageSquare } from "lucide-react";

// const ContactItem = ({ contact, setActiveUser }) => {
//   return (
//     <div
//       className="flex p-4 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors duration-200"
//       onClick={() => {
//         setActiveUser(contact);
//         if (contact.unread_count > 0) {
//           fetch(`http://127.0.0.1:5000/conversations/${contact.conversationId}/mark-read`, {
//             method: 'POST',
//             headers: {
//               'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
//             },
//           });
//         }
//       }}
//     >
//       <div className="flex-shrink-0">
//         <p className="text-white">{contact.expert_name}</p>
//         {/* <p className="text-gray-400 text-sm">{contact.message}</p> */}
//         <div className="mt-2">
//           <div className="flex items-center gap-2 text-sm text-gray-400">
//             {contact.condition ? (
//               <FileIcon className="w-4 h-4" />
//             ) : (
//               <></>
//             )}
//             {/* <span>Latest Message</span> */}
//             <p className="text-gray-300 truncate text-sm">
//             {contact.message}
//           </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactItem;



import React from "react";
import { FileIcon, MessageCircle } from "lucide-react";

const ContactItem = ({ contact, setActiveUser }) => {
  const handleClick = async () => {
    setActiveUser(contact);
    if (contact.unread_count > 0) {
      try {
        await fetch(`http://127.0.0.1:5000/conversations/${contact.conversationId}/mark-read`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
  };

  return (
    <div
      className="flex p-4 bg-gray-700 rounded-lg hover:bg-gray-500 cursor-pointer transition-colors duration-200"
      onClick={handleClick}
    >
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white relative">
          {contact.expert_name?.charAt(0).toUpperCase()}
          {contact.unread_count > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {contact.unread_count}
            </span>
          )}
        </div>
      </div>

      <div className="ml-4 flex-grow overflow-hidden">
        <p className="text-white font-medium flex items-center">
          {contact.expert_name}
          {contact.unread_count > 0 && (
            <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"/>
          )}
        </p>
        
        <div className="flex items-center gap-2 text-sm text-gray-400">
          {contact.is_file ? (
            <FileIcon className="w-4 h-4" />
          ) : (
            <MessageCircle className="w-4 h-4" />
          )}
          <p className="text-gray-400 truncate text-sm">
            {contact.message || "No messages yet"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactItem;