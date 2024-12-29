import React from "react";
import classNames from "classnames";

const MessageBubble = ({ message, activeUser }) => {
  // console.log('this the active user in bubbles',activeUser)
  // Determine the sender
  // const isSender = message.sender === activeUser.client || message.receiver === activeUser ;
  const isSender = 
  activeUser &&
  message &&
  (
    (activeUser.client_name && activeUser.client_name !== message.sender) || 
    (activeUser.isAdmin && activeUser.client && message.sender === activeUser.client)
  );


  const bubbleClass = classNames(
    "p-3 mb-2 rounded-lg max-w-lg break-words",
    {
      "bg-blue-500 text-white self-end": !isSender, // Blue bubble on the right
      "bg-gray-700 text-white self-start": isSender, // Grey bubble on the left
    },
    {
      "ml-auto": !isSender, // Align right
      "mr-auto": isSender, // Align left
    }
  );

  const renderMessageContent = () => {
    if (message.attachments && message.attachments.length > 0) {
      return (
        <div>
          {message.attachments.map((attachment, index) => (
            attachment.endsWith(".png") || attachment.endsWith(".jpg") ? (
              <img
                key={index}
                src={attachment} // Ensure this is a valid public URL
                alt={`Attachment ${index + 1}`}
                className="w-24 h-24 rounded mb-2 cursor-pointer"
                onClick={() => window.open(attachment, "_blank")}
              />
            ) : (
              <a
                key={index}
                href={attachment}
                target={!isSender ? "_blank" : undefined}
                download={isSender ? attachment.split("/").pop() : undefined} 
                rel={!isSender ? "noopener noreferrer" : undefined}
                className={classNames(
                  "mb-2 block underline",
                  { "text-white": !isSender, "text-blue-500": isSender } // Adjust link color
                )}
              >
                {attachment.split("/").pop()}
              </a>
            )
          ))}
          <p className={classNames(
            "whitespace-pre-wrap",
            { "text-white": !isSender, "text-gray-200": isSender } // Adjust text color
          )}>
            {message.content}
          </p>
        </div>
      );
    }

    return (
      <p className={classNames(
        "whitespace-pre-wrap",
        { "text-white": !isSender, "text-gray-200": isSender } // Adjust text color
      )}>
        {message.content}
      </p>
    );
  };

  return (
    <div className={bubbleClass}>
      {renderMessageContent()}
      <p className="text-xs text-gray-400 mt-1">
        {new Date(message.timestamp).toLocaleString()}
      </p>
    </div>
  );
};

export default MessageBubble;