import React, {useEffect,useState,useContext} from "react";
import { UserContext } from "../contexts/userContext";
import ContactItem from "./ContactItem";

const Sidebar = ({ setActiveUser }) => {
  const [conversations, setConversations] = useState([]);
  const { authToken } = useContext(UserContext);

  useEffect(() => {
    const fetchConversations = async () => {
      const response = await fetch("https://studypage-76hu.onrender.com/conversations", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await response.json();
      setConversations(data);
      // console.log("Fetched conversations in sidebar:", data);
  
      // Avoid duplication: Map conversations by expert ID
    //   const uniqueConversations = Object.values(
    //     data.reduce((acc, conv) => {
    //       acc[conv.expert.id] = conv;
    //       return acc;
    //     }, {})
    //   );
  
    //   setConversations(uniqueConversations);
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
          }}
          setActiveUser={setActiveUser}
        />
      ))}
    </div>
  );
};

export default Sidebar;

