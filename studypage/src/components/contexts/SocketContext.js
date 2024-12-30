import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useUserContext } from './userContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { currentUser } = useUserContext();
  const [unreadCounts, setUnreadCounts] = useState({});
  const [socket, setSocket] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState(null);

  // Initialize notification sound
  const notificationSound = new Audio('/path/to/your/notification-sound.mp3'); // Add your sound file

  useEffect(() => {
    if (!currentUser) return;

    const newSocket = io('http://127.0.0.1:5000');

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      // Emit an event to associate the socket with the user
      newSocket.emit('user_connected', { user_id: currentUser.id });
    });

    newSocket.on('new_message', (data) => {
      if (data.receiver_id === currentUser?.id) {
        // Only increment unread count if the conversation is not currently active
        if (activeConversationId !== data.conversation_id) {
          setUnreadCounts(prev => ({
            ...prev,
            [data.conversation_id]: (prev[data.conversation_id] || 0) + 1
          }));

          // Play notification sound if the conversation is not active
          notificationSound.play().catch(error => {
            console.error('Error playing notification sound:', error);
          });

          // Show browser notification
          if (Notification.permission === 'granted') {
            new Notification('New Message', {
              body: data.message.content || 'You have a new message',
              icon: '/path/to/your/notification-icon.png', // Add your icon
            });
          }
        }
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser, activeConversationId,notificationSound ]);

  // Function to mark conversation as active
  const setActiveConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    // Reset unread count for this conversation
    setUnreadCounts(prev => ({
      ...prev,
      [conversationId]: 0
    }));
  };

  // Request notification permissions on mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
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