// import React, { useState } from "react";
// import ChatWindow from "../chatInterface/ChatWindow";
// import Sidebar from "../chatInterface/Sidebar";

// const Messaging = () => {
//   const [activeUser, setActiveUser] = useState(null); 
//   // console.log('activeuser in messaging section',activeUser)

//   return (
//     <div className="flex h-screen bg-gray-600">
//       {/* Sidebar */}
//       <Sidebar setActiveUser={setActiveUser} />

//       {activeUser ? (
//         <ChatWindow activeUser={activeUser} />
//       ) : (
//         <div className="flex-grow flex items-center justify-center text-white">
//           <p>Select a user to start chatting!</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Messaging;


// import React, { useState } from "react";
// import Sidebar from "../chatInterface/Sidebar";
// import ChatWindow from "../chatInterface/ChatWindow";


// const Messaging = () => {
//   const [activeUser, setActiveUser] = useState(null);

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800">
//       <Sidebar setActiveUser={setActiveUser} />
//       {activeUser ? (
//         <ChatWindow activeUser={activeUser} />
//       ) : (
//         <div className="flex-grow flex flex-col items-center justify-center text-gray-300">
//           <svg
//             className="w-24 h-24 mb-4 text-gray-500"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
//             />
//           </svg>
//           <p className="text-xl font-semibold">Select a conversation to begin</p>
//           <p className="text-gray-500 mt-2">Choose from your recent chats in the sidebar</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Messaging;



import React, { useState } from "react";
import Sidebar from "../chatInterface/Sidebar";
import ChatWindow from "../chatInterface/ChatWindow";
import { Menu, X } from "lucide-react";

const Messaging = () => {
  const [activeUser, setActiveUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // return (
  //   <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800 relative">
  //     {/* Mobile Menu Button */}
  //     <button 
  //       onClick={toggleSidebar}
  //       className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
  //     >
  //       {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
  //     </button>

  //     {/* Sidebar with mobile responsiveness */}
  //     <div className={`
  //       fixed lg:relative
  //       w-80 lg:w-80
  //       h-screen
  //       transform lg:transform-none
  //       ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  //       transition-transform duration-300 ease-in-out
  //       z-40 lg:z-auto
  //     `}>
  //       <Sidebar setActiveUser={(user) => {
  //         setActiveUser(user);
  //         setIsSidebarOpen(false); // Close sidebar on mobile after selection
  //       }} />
  //     </div>

  //     {/* Overlay for mobile */}
  //     {isSidebarOpen && (
  //       <div 
  //         className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
  //         onClick={() => setIsSidebarOpen(false)}
  //       />
  //     )}

  //     {/* Main Chat Area */}
  //     <div className="flex-grow relative">
  //       {activeUser ? (
  //         <ChatWindow activeUser={activeUser} />
  //       ) : (
  //         <div className="flex-grow flex flex-col items-center justify-center text-gray-300 p-4">
  //           <svg
  //             className="w-16 h-16 mb-4 text-gray-500 lg:w-24 lg:h-24"
  //             fill="none"
  //             stroke="currentColor"
  //             viewBox="0 0 24 24"
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               strokeWidth={2}
  //               d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
  //             />
  //           </svg>
  //           <p className="text-lg lg:text-xl font-semibold text-center">Select a conversation to begin</p>
  //           <p className="text-gray-500 mt-2 text-center text-sm lg:text-base">Choose from your recent chats in the sidebar</p>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
};

export default Messaging;