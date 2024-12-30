import React, { createContext, useContext, useEffect }, useState from 'react';
import { io } from 'socket.io-client';
import { useContext as useAuthContext } from '../contexts/userContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    const socket = io('http://127.0.0.1:5000');

    socket.on('new_message', (data) => {
      if (data.receiver_id === user?.id) {
        // Update unread count for the conversation
        setUnreadCounts(prev => ({
          ...prev,
          [data.conversation_id]: (prev[data.conversation_id] || 0) + 1
        }));

        // Show browser notification
        if (Notification.permission === 'granted') {
          new Notification('New Message', {
            body: data.message.content || 'You have a new message',
            icon: '/path/to/your/icon.png'
          });
        }
      }
    });

    return () => socket.disconnect();
  }, [user]);

  return (
    <SocketContext.Provider value={{ unreadCounts, setUnreadCounts }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);