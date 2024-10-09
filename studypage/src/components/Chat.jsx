import React, { useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import { UserContext } from './contexts/userContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Chat = () => {
  const { currentUser, authToken } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  
  // Using useRef to hold the socket instance
  const socketRef = useRef(null);

  useEffect(() => {
    if (!currentUser || !authToken) return;

    // Initialize the socket connection and store it in socketRef
    socketRef.current = io('http://localhost:5000', {
      query: { token: authToken },
    });

    // Fetch messages from backend
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:5000/messages', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
          setNotificationCount(data.messages.filter(msg => msg.user !== currentUser.username).length);
        } else {
          console.error('Failed to fetch messages');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages(); // Call the function to fetch initial messages

    // Socket event listeners
    socketRef.current.on('user_message', (msg) => {
      console.log("Received user message: ", msg);
      if (msg.user !== currentUser.username) {
        setMessages(prevMessages => {
          const newMessages = [...prevMessages, msg];
          localStorage.setItem(currentUser.username, JSON.stringify(newMessages));
          setNotificationCount(prevCount => prevCount + 1);
          fetchMessages();
          return newMessages;
        });
      }
    });

    socketRef.current.on('admin_response', (data) => {
      console.log("Received admin response: ", data);
      setMessages(prevMessages => {
        const newMessages = [...prevMessages, { user: 'Admin', message: data.response }];
        localStorage.setItem(currentUser.username, JSON.stringify(newMessages));
        setNotificationCount(prevCount => prevCount + 1);
        fetchMessages();
        return newMessages;
      });
    });

    // Cleanup on component unmount
    return () => {
      socketRef.current.off('user_message');
      socketRef.current.off('admin_response');
    };
  }, [currentUser, authToken]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && currentUser && socketRef.current) {
      // Ensure socketRef.current is available
      socketRef.current.emit('user_message', { message, user: currentUser.username });
      setMessage(''); // Clear input field
    } else {
      console.error('User is not logged in or socket is not initialized');
    }
  };

  // If user is not logged in, return a message prompting them to log in
  if (!currentUser) {
    return <div>Please log in to chat.</div>;
  }

  return (
    <div>
      {/* Bell icon with notification count */}
      <div className="relative text-white">
        <Link to="/admin/adminreply">
          <FontAwesomeIcon icon={faBell} className="text-xl" />
        </Link>
        {notificationCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 rounded-full h-4 w-4 flex items-center justify-center text-xs">
            {notificationCount}
          </span>
        )}
      </div>

      {/* Chat container */}
      <div className="chat-container max-w-lg mx-auto mt-6 p-6 border rounded-lg bg-white shadow-lg">
        <div className="messages overflow-y-auto max-h-96 mb-4 p-2 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message p-3 rounded-lg ${msg.user === currentUser.username ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black self-start'}`}
            >
              <strong>{msg.user}: </strong>{msg.message}
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border p-3 w-full rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
