import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { UserContext } from '../contexts/userContext';

const AdminChat = () => {
  const { authToken, currentUser } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);

  const socket = io('http://localhost:5000', {
    query: { token: authToken }
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:5000/adminmessages', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        if (Array.isArray(data.messages)) {
          setMessages(data.messages);
          setNotificationCount(data.messages.length);
        } else {
          console.error('Messages are not in the expected format.');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    if (currentUser && currentUser.is_admin) {
      socket.emit('join_admin_room', { adminId: currentUser.id });
    }

    socket.on('user_message', (data) => {
      if (data && data.user && data.message) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: data.user, message: data.message }
        ]);
        fetchMessages();
        setNotificationCount(prevCount => prevCount + 1);
      }
    });

    socket.on('user_response', (data) => {
      if (data && data.response) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: 'admin_user', message: data.response }
        ]);
      }
    });

    return () => {
      socket.off('user_message');
      socket.off('user_response');
    };
  }, [currentUser, authToken]);

  const handleReply = (user) => {
    if (reply.trim() !== '') {
      socket.emit('admin_reply', { reply, user });

      // Add the reply to the message list immediately for the selected user
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: 'admin_user', message: reply }
      ]);

      socket.on('reply_status', (status) => {
        if (status.success) {
          alert('Reply sent successfully!');
        } else {
          alert('Failed to send reply. Please try again.');
          // Optional: Remove the failed message from the list
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.message !== reply)
          );
        }
      });

      setReply('');
    }
  };

  return (
    <div className="admin-chat">
      <div className="notification bg-[#66B5B3] p-4 mb-6 rounded-lg shadow-lg">
        <h2 className="text-white text-xl">Admin Notifications</h2>
        <div className="text-white">You have {notificationCount} unread messages.</div>
      </div>

      <div className="messages flex">
        <div className="users-list w-1/4 bg-gray-100 p-4 rounded-lg shadow-lg mr-4">
          <h3 className="text-xl font-bold mb-4">Users</h3>
          {[...new Set(messages.map((msg) => msg.user))].map((user, index) => (
            <div
              key={index}
              className={`user-item mb-4 p-2 rounded-lg cursor-pointer ${selectedUser === user ? 'bg-blue-200' : 'bg-white'}`}
              onClick={() => setSelectedUser(user)}
            >
              <span className="user-name text-lg font-semibold">{user}</span>
            </div>
          ))}
        </div>

        {/* <div className="chat-box w-3/4 p-4 bg-white rounded-lg shadow-lg">
          {selectedUser ? (
            <div>
              <h3 className="text-xl font-bold mb-4">Conversation with {selectedUser}</h3>
              {messages
                .filter((msg) => msg.user === selectedUser || msg.user === 'admin_user')
                .map((msg, idx) => (
                  <div
                    key={idx}
                    className={`message-text mb-2 p-2 rounded-lg ${
                      msg.user === 'admin_user' ? 'bg-gray-300 text-black self-end' : 'bg-blue-500 text-white self-start'
                    }`}
                    style={{
                      display: 'inline-block',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      marginBottom: '8px',
                      alignSelf: msg.user === 'admin_user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <strong>{msg.user === 'admin_user' ? 'Admin' : msg.user}:</strong> {msg.message}
                  </div>
                ))}
              <div className="reply mt-3">
                <textarea
                  placeholder="Type your reply here"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="w-full border p-2 rounded-md"
                />
                <button
                  onClick={() => handleReply(selectedUser)}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Reply
                </button>
              </div>
            </div>
          ) : (
            <div>Please select a user to view and reply to their messages.</div>
          )}
        </div> */}
        <div className="chat-box w-3/4 p-4 bg-white rounded-lg shadow-lg">
  {selectedUser ? (
    <div className="flex flex-col">
      <h3 className="text-xl font-bold mb-4">Conversation with {selectedUser}</h3>
      {messages
        .filter((msg) => msg.user === selectedUser || msg.user === 'admin_user')
        .map((msg, idx) => (
          <div
            key={idx}
            className={`message-text mb-2 p-2 rounded-lg ${
              msg.user === 'admin_user' ? 'bg-gray-300 text-black self-end' : 'bg-blue-500 text-white self-start'
            }`}
            style={{
              borderRadius: '10px',
              padding: '12px',
              marginBottom: '8px',
              maxWidth: '70%',
              alignSelf: msg.user === 'admin_user' ? 'flex-end' : 'flex-start',
            }}
          >
            <strong>{msg.user === 'admin_user' ? 'Admin' : msg.user}:</strong> {msg.message}
          </div>
        ))}
      <div className="reply mt-3">
        <textarea
          placeholder="Type your reply here"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          className="w-full border p-2 rounded-md"
        />
        <button
          onClick={() => handleReply(selectedUser)}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Reply
        </button>
      </div>
    </div>
  ) : (
    <div>Please select a user to view and reply to their messages.</div>
  )}
</div>

      </div>
    </div>
  );
};

export default AdminChat;
