import React from "react";
import { FileIcon, MessageSquare } from "lucide-react";

const ContactItem = ({ contact, setActiveUser }) => {
  return (
    <div
      className="flex p-4 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors duration-200"
      onClick={() => setActiveUser(contact)}
    >
      <img
        src={contact.image}
        alt={contact.expert_name}
        className="w-12 h-12 rounded-full mr-3"
      />
      <div>
        <p className="text-white">{contact.expert_name}</p>
        {/* <p className="text-gray-400 text-sm">{contact.message}</p> */}
        <div className="mt-2">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            {contact.condition ? (
              <FileIcon className="w-4 h-4" />
            ) : (
              <></>
            )}
            {/* <span>Latest Message</span> */}
            <p className="text-gray-300 truncate text-sm">
            {contact.message}
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactItem;


