import React, { createContext, useContext, useEffect } from 'react';
import io from 'socket.io-client';

// Create a context for socket
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socket = io('http://localhost:5000');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    // Cleanup on unmount
    return () => {
      socket.off('connect');
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook to use socket in any component
export const useSocket = () => {
  return useContext(SocketContext);
};
