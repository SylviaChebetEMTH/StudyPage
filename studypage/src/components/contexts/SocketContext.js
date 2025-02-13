// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { io } from 'socket.io-client';
// import { useUserContext } from './userContext';

// const SocketContext = createContext();

// export const SocketProvider = ({ children }) => {
//   const { currentUser } = useUserContext();
//   const [unreadCounts, setUnreadCounts] = useState({});
//   const [socket, setSocket] = useState(null);
//   const [activeConversationId, setActiveConversationId] = useState(null);

//   // Initialize notification sound
//   const notificationSound = new Audio('./assets/mixkit-magic-notification-ring-2344.wav'); // Add your sound file
//   useEffect(() => {
//     if (!currentUser) return;

//     const newSocket = io('https://studypage.onrender.com', { transports: ["websocket"] });

//     newSocket.on('connect', () => {
//       console.log('Connected to WebSocket server');
//       // Emit an event to associate the socket with the user
//       newSocket.emit('user_connected', { user_id: currentUser.id });
//     });

//     newSocket.on('new_message', (data) => {
//       if (data.receiver_id === currentUser?.id) {
//         // Only increment unread count if the conversation is not currently active
//         if (activeConversationId !== data.conversation_id) {
//           setUnreadCounts(prev => ({
//             ...prev,
//             [data.conversation_id]: (prev[data.conversation_id] || 0) + 1
//           }));

//           // Play notification sound if the conversation is not active
//           notificationSound.play().catch(error => {
//             console.error('Error playing notification sound:', error);
//             console.log('played')
//           });

//           // Show browser notification
//           if (Notification.permission === 'granted') {
//             new Notification('New Message', {
//               body: data.message.content || 'You have a new message',
//               icon: './assets/mixkit-magic-notification-ring-2344.wav', // Add your icon
//             });
//           }
//         }
//       }
//     });

//     setSocket(newSocket);

//     return () => {
//       newSocket.disconnect();
//     };
//   }, [currentUser ]);

//   // Function to mark conversation as active
//   const setActiveConversation = (conversationId) => {
//     setActiveConversationId(conversationId);
//     // Reset unread count for this conversation
//     setUnreadCounts(prev => ({
//       ...prev,
//       [conversationId]: 0
//     }));
//   };

//   // Request notification permissions on mount
//   useEffect(() => {
//     if (Notification.permission === 'default') {
//       Notification.requestPermission();
//     }
//   }, []);

//   const value = {
//     unreadCounts,
//     setUnreadCounts,
//     setActiveConversation,
//     activeConversationId,
//     socket
//   };

//   return (
//     <SocketContext.Provider value={value}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => useContext(SocketContext);

// export default SocketContext;


import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useUserContext } from './userContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { currentUser } = useUserContext();
  const [unreadCounts, setUnreadCounts] = useState({});
  const [socket, setSocket] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize notification sound - using URL constructor for better path handling
  const notificationSound = new Audio('/assets/mixkit-magic-notification-ring-2344.wav');

  useEffect(() => {
    if (!currentUser) return;

    // Initialize socket with proper configuration
    const newSocket = io('https://studypage.onrender.com', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      withCredentials: true,
      auth: {
        userId: currentUser.id
      }
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      // Emit user connected event after successful connection
      newSocket.emit('user_connected', { user_id: currentUser.id });
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });

    // Message handling
    newSocket.on('new_message', (data) => {
      if (data.receiver_id === currentUser?.id) {
        // Only handle notifications if the conversation isn't active
        if (activeConversationId !== data.conversation_id) {
          // Update unread counts
          setUnreadCounts(prev => ({
            ...prev,
            [data.conversation_id]: (prev[data.conversation_id] || 0) + 1
          }));

          // Play notification sound
          try {
            notificationSound.play();
          } catch (error) {
            console.warn('Error playing notification:', error);
          }

          // Show browser notification if permitted
          if (Notification.permission === 'granted') {
            try {
              new Notification('New Message', {
                body: data.message?.content || 'You have a new message',
                icon: '/favicon.ico', // Use a static favicon instead of audio file
                silent: true // Prevent default notification sound
              });
            } catch (error) {
              console.warn('Error showing notification:', error);
            }
          }
        }
      }
    });

    setSocket(newSocket);

    // Cleanup function
    return () => {
      if (newSocket) {
        newSocket.off('connect');
        newSocket.off('disconnect');
        newSocket.off('new_message');
        newSocket.off('connect_error');
        newSocket.disconnect();
      }
    };
  }, [currentUser]);

  // Request notification permissions
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        try {
          await Notification.requestPermission();
        } catch (error) {
          console.warn('Error requesting notification permission:', error);
        }
      }
    };

    requestNotificationPermission();
  }, []);

  const setActiveConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    setUnreadCounts(prev => ({
      ...prev,
      [conversationId]: 0
    }));
  };

  const value = {
    unreadCounts,
    setUnreadCounts,
    setActiveConversation,
    activeConversationId,
    socket,
    isConnected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext;