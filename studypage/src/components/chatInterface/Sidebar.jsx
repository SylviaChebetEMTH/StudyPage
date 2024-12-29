import React, {useEffect,useState,useContext} from "react";
import { UserContext } from "../contexts/userContext";
import ContactItem from "./ContactItem";

const Sidebar = ({ setActiveUser }) => {
  const [conversations, setConversations] = useState([]);
  const { authToken } = useContext(UserContext);

  useEffect(() => {
    const fetchConversations = async () => {
      const response = await fetch("http://127.0.0.1:5000/conversations", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await response.json();
      setConversations(data);
    };
  
    fetchConversations();
  }, [authToken]);
  
  return (
    <div className="w-full md:w-1/4 bg-gray-800 p-4">
      <h1 className="text-white text-xl">Recent Chats</h1>
      {conversations.map((conv) => (
        <ContactItem
          key={conv.id}
          contact={{
            expert_name: conv.expert?.expert_name || "Unknown Expert",
            expert_id: conv.expert?.id || null,
            conversationId: conv.id,
            client_name: conv.client?.client_name || "Unknown Client",
            client_id: conv.client?.id || null, 
            message: conv.latest_message
          }}
          setActiveUser={setActiveUser}
        />
      ))}
    </div>
  );
};

export default Sidebar;

