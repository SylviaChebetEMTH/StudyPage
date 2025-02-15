import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useUserContext } from './userContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { currentUser } = useUserContext();
  const [unreadCounts, setUnreadCounts] = useState({});
  const [socket, setSocket] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const newSocket = io('https://studypage.onrender.com', { 
      transports: ["websocket"], 
      path: "/socket.io/" 
    });

    let keepAliveInterval;

    newSocket.on('connect', () => {
      console.log('✅ Connected to WebSocket server');

      // 🔄 Keep-alive ping every 30 seconds
      keepAliveInterval = setInterval(() => {
        if (newSocket.connected) {
          console.log("🔄 Sending keep-alive ping");
          newSocket.emit("ping");
        }
      }, 30000);

      // Associate the socket with the user
      newSocket.emit('user_connected', { user_id: currentUser.id });
    });

    newSocket.on("disconnect", (reason) => {
      console.warn("❌ Disconnected from WebSocket:", reason);
    });

    // Handle new message event
    newSocket.on('new_message', (data) => {
      if (data.receiver_id === currentUser?.id) {
        // Only increment unread count if the conversation is not currently active
        if (activeConversationId !== data.conversation_id) {
          setUnreadCounts(prev => ({
            ...prev,
            [data.conversation_id]: (prev[data.conversation_id] || 0) + 1
          }));

          // 🎵 Play notification sound
          const notificationSound = new Audio('./assets/mixkit-magic-notification-ring-2344.wav');
          notificationSound.play().catch(error => {
            console.error('⚠️ Error playing notification sound:', error);
          });

          // 🔔 Show browser notification
          if (Notification.permission === 'granted') {
            new Notification('New Message', {
              body: data.message.content || 'You have a new message',
              icon: './assets/icon.png', // Ensure this icon file exists
            });
          }
        }
      }
    });

    setSocket(newSocket);

    return () => {
      console.log("🔌 Cleaning up WebSocket connection...");
      newSocket.disconnect();
      clearInterval(keepAliveInterval); // ✅ Prevent memory leaks
    };
  }, [currentUser]);

  // Function to mark conversation as active
  const setActiveConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    setUnreadCounts(prev => ({
      ...prev,
      [conversationId]: 0
    }));
  };

  // Request browser notification permission on mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log("🔔 Notification permission:", permission);
      });
    }
  }, []);

  const value = {
    unreadCounts,
    setUnreadCounts,
    setActiveConversation,
    activeConversationId,
    socket
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

export default SocketContext;
