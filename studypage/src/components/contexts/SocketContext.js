import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useUserContext } from './userContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useUserContext();
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    if (!user) return; // Don't connect if no user

    const socket = io('http://127.0.0.1:5000');

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('new_message', (data) => {
      if (data.receiver_id === user?.id) {
        setUnreadCounts(prev => ({
          ...prev,
          [data.conversation_id]: (prev[data.conversation_id] || 0) + 1
        }));

        // Show browser notification
        if (Notification.permission === 'granted') {
          new Notification('New Message', {
            body: data.message.content || 'You have a new message'
          });
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const value = {
    unreadCounts,
    setUnreadCounts
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

export default SocketContext;