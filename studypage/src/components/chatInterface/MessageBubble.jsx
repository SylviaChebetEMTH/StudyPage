

// {
//   "conversationId": 28,
//   "expert_id": 13960,
//   "expert_name": "Aurora Clark",
//   "profilePicture": "https://t4.ftcdn.net/jpg/05/50/81/29/240_F_550812955_gEsXs9EtB1CUxQD9Bnspgko8AHAwxp8f.jpg",
//   "isAdmin": false
// }

// {
//   "expert_name": "Aurora Clark",
//   "expert_id": 13960,
//   "conversationId": 28,
//   "client_name": "bett",
//   "client_id": 1,
//   "message": "nksd",
//   "timestamp": "2025-03-14T15:40:32.623830",
//   "condition": false,
//   "unread_count": 7,
//   "isAdmin": false
// }

// { 
//   "attachments": [],
//   "content": "nksd",
//   "conversation_id": 28,
//   "expert": null,
//   "id": 207,
//   "read": false,
//   "receiver": "bett",
//   "sender": "adminuser",
//   "timestamp": "2025-03-14 15:40:32"
// }

// {
//   "attachments": [],
//   "content": "nksd",
//   "conversation_id": 28,
//   "expert": null,
//   "id": 207,
//   "read": true,
//   "receiver": "bett",
//   "sender": "adminuser",
//   "timestamp": "2025-03-14 15:40:32"
// }

// import React from "react";
// import classNames from "classnames";

// const MessageBubble = ({ message, activeUser,iscurrentUser}) => {
//   console.log('message in mess bubble', message);
//   console.log('activeUser in mess bubble', activeUser);
  
//   // Parse the attachments properly
//   const parseAttachments = () => {
//     if (!message.attachments || !message.attachments.length) return [];
    
//     try {
//       // If it's a stringified JSON array
//       if (typeof message.attachments[0] === 'string' && message.attachments[0].startsWith('[')) {
//         return JSON.parse(message.attachments[0]);
//       }
//       // If it's already an array of attachment URLs
//       return message.attachments;
//     } catch (error) {
//       console.error("Error parsing attachments:", error);
//       return [];
//     }
//   };

//   const attachments = parseAttachments();

//   // Determine if the current message is from the active user (sender)
//   const isFromCurrentUser = () => {
//     // Check if we're dealing with admin
//     const isAdminUser = activeUser.isAdmin === true;
    
//     // Get the relevant user names from activeUser (handling both data structures)
//     const currentExpertName = activeUser.expert_name;
//     const currentClientName = activeUser.client_name;
    
//     // Check if the message is from admin
//     if (isAdminUser && message.sender === "adminuser") {
//       return true;
//     }
    
//     // Check if message is from the currently active client
//     if (currentClientName && message.sender === currentClientName) {
//       return true;
//     }
    
//     // Check if message is from the currently active expert
//     if (currentExpertName && message.sender === currentExpertName) {
//       return true;
//     }
    
//     // For the other chat section where sender might match the active user in different ways
//     if (message.sender === activeUser.expert_name) {
//       return true;
//     }

//     if (iscurrentUser) {
//       return true;
//     }
    
//     return false;
//   };
  
//   // The message is from the current user (should be displayed on right)
//   const isCurrentUserMessage = isFromCurrentUser();

//   const bubbleClass = classNames(
//     "p-4 mb-3 rounded-2xl max-w-lg break-words shadow-sm transition-all duration-200",
//     {
//       "bg-gradient-to-br from-blue-500 to-blue-600 text-white self-end rounded-br-sm": isCurrentUserMessage,
//       "bg-gradient-to-br from-gray-700 to-gray-800 text-white self-start rounded-bl-sm": !isCurrentUserMessage,
//     },
//     {
//       "ml-auto": isCurrentUserMessage, // Right side
//       "mr-auto": !isCurrentUserMessage, // Left side
//     }
//   );

//   const renderMessageContent = () => {
//     if (attachments && attachments.length > 0) {
//       return (
//         <div className="space-y-2">
//           {attachments.map((attachment, index) => (
//             attachment.endsWith(".png") || attachment.endsWith(".jpg") ? (
//               <div key={index} className="relative group">
//                 <img
//                   src={attachment}
//                   alt={`Attachment ${index + 1}`}
//                   className="w-48 h-48 object-cover rounded-lg transition-transform duration-200 hover:scale-105 cursor-pointer"
//                   onClick={() => window.open(attachment, "_blank")}
//                 />
//                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg" />
//               </div>
//             ) : (
//               <a
//                 key={index}
//                 href={attachment}
//                 target="_blank"
//                 download={!isCurrentUserMessage ? attachment.split("/").pop() : undefined}
//                 rel="noopener noreferrer"
//                 className={classNames(
//                   "flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200",
//                   {
//                     "hover:bg-blue-600": isCurrentUserMessage,
//                     "hover:bg-gray-600": !isCurrentUserMessage,
//                   }
//                 )}
//               >
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                   />
//                 </svg>
//                 <span className="underline">{attachment.split("/").pop()}</span>
//               </a>
//             )
//           ))}
//           <p className={classNames(
//             "whitespace-pre-wrap text-sm leading-relaxed",
//             { "text-white": isCurrentUserMessage, "text-gray-200": !isCurrentUserMessage }
//           )}>
//             {message.content}
//           </p>
//         </div>
//       );
//     }

//     return (
//       <p className={classNames(
//         "whitespace-pre-wrap text-sm leading-relaxed",
//         { "text-white": isCurrentUserMessage, "text-gray-200": !isCurrentUserMessage }
//       )}>
//         {message.content}
//       </p>
//     );
//   };

//   const renderMessageStatus = () => {
//     if (!isCurrentUserMessage) return null;
    
//     if (message.status === 'sending') {
//       return (
//         <span className="flex items-center text-xs text-gray-400 mt-1">
//           <svg className="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//           </svg>
//           Sending...
//         </span>
//       );
//     }
    
//     if (message.status === 'sent') {
//       return (
//         <span className="flex items-center text-xs text-gray-400 mt-1">
//           <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//           </svg>
//           Sent
//         </span>
//       );
//     }
    
//     if (message.status === 'read') {
//       return (
//         <span className="flex items-center text-xs text-blue-400 mt-1">
//           <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7M5 13l4 4L19 7"></path>
//           </svg>
//           Read
//         </span>
//       );
//     }
    
//     return null;
//   };
//   return (
//     <div className={bubbleClass}>
//       {renderMessageContent()}
//       <div className="flex justify-between items-center mt-2">
//         <p className="text-xs text-gray-400 opacity-75">
//           {new Date(message.timestamp).toLocaleString()}
//         </p>
//         {renderMessageStatus()}
//       </div>
//     </div>
//   );
// };

// export default MessageBubble;



import React from "react";
import classNames from "classnames";

const MessageBubble = ({ message, activeUser }) => {
  console.log('message', message)
  console.log('activeuser', activeUser)
  // Parse the attachments properly
  const parseAttachments = () => {
    if (!message.attachments || !message.attachments.length) return [];
    
    try {
      // If it's a stringified JSON array
      if (typeof message.attachments[0] === 'string' && message.attachments[0].startsWith('[')) {
        return JSON.parse(message.attachments[0]);
      }
      // If it's already an array of attachment URLs
      return message.attachments;
    } catch (error) {
      console.error("Error parsing attachments:", error);
      return [];
    }
  };

  const attachments = parseAttachments();

  // Determine if the current message is from the active user (sender)
  const isFromCurrentUser = () => {
    // Check if the message is from the currently logged-in user/expert
    // For messages sent via ChatModal, we need to check against "adminuser"
    if (message.sender === "adminuser") {
      return true;
    }
    
    // For normal messages, compare sender with the expert_name
    if (activeUser.expert_name && message.sender === activeUser.expert_name) {
      return true;
    }
    
    // Don't use iscurrentUser directly as it's always making messages appear as sent
    
    return false;
  };
  
  // Apply different logic based on sender
  const isCurrentUserMessage = activeUser.isAdmin
    ? isFromCurrentUser()
    : !isFromCurrentUser();
  

  const bubbleClass = classNames(
    "p-4 mb-3 rounded-2xl max-w-lg break-words shadow-sm transition-all duration-200",
    {
      "bg-gradient-to-br from-blue-500 to-blue-600 text-white self-end rounded-br-sm": isCurrentUserMessage,
      "bg-gradient-to-br from-gray-700 to-gray-800 text-white self-start rounded-bl-sm": !isCurrentUserMessage,
    },
    {
      "ml-auto": isCurrentUserMessage, // Right side
      "mr-auto": !isCurrentUserMessage, // Left side
    }
  );

  const renderMessageContent = () => {
    if (attachments && attachments.length > 0) {
      return (
        <div className="space-y-2">
          {attachments.map((attachment, index) => (
            attachment.endsWith(".png") || attachment.endsWith(".jpg") ? (
              <div key={index} className="relative group">
                <img
                  src={attachment}
                  alt={`Attachment ${index + 1}`}
                  className="w-48 h-48 object-cover rounded-lg transition-transform duration-200 hover:scale-105 cursor-pointer"
                  onClick={() => window.open(attachment, "_blank")}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg" />
              </div>
            ) : (
              <a
                key={index}
                href={attachment}
                target="_blank"
                download={!isCurrentUserMessage ? attachment.split("/").pop() : undefined}
                rel="noopener noreferrer"
                className={classNames(
                  "flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200",
                  {
                    "hover:bg-blue-600": isCurrentUserMessage,
                    "hover:bg-gray-600": !isCurrentUserMessage,
                  }
                )}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="underline">{attachment.split("/").pop()}</span>
              </a>
            )
          ))}
          <p className={classNames(
            "whitespace-pre-wrap text-sm leading-relaxed",
            { "text-white": isCurrentUserMessage, "text-gray-200": !isCurrentUserMessage }
          )}>
            {message.content}
          </p>
        </div>
      );
    }

    return (
      <p className={classNames(
        "whitespace-pre-wrap text-sm leading-relaxed",
        { "text-white": isCurrentUserMessage, "text-gray-200": !isCurrentUserMessage }
      )}>
        {message.content}
      </p>
    );
  };

  const renderMessageStatus = () => {
    if (!isCurrentUserMessage) return null;
    
    if (message.status === 'sending') {
      return (
        <span className="flex items-center text-xs text-gray-400 mt-1">
          <svg className="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Sending...
        </span>
      );
    }
    
    if (message.status === 'sent') {
      return (
        <span className="flex items-center text-xs text-gray-400 mt-1">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Sent
        </span>
      );
    }
    
    if (message.status === 'read') {
      return (
        <span className="flex items-center text-xs text-blue-400 mt-1">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7M5 13l4 4L19 7"></path>
          </svg>
          Read
        </span>
      );
    }
    
    return null;
  };

  return (
    <div className={bubbleClass}>
      {renderMessageContent()}
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-400 opacity-75">
          {new Date(message.timestamp).toLocaleString()}
        </p>
        {renderMessageStatus()}
      </div>
    </div>
  );
};

export default MessageBubble;