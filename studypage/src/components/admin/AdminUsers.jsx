import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/userContext";
import axios from "axios";

function AllUsers() {
  const { authToken } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the new user form
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://studypage.onrender.com/admin/users", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUsers(response.data.users); // Make sure response.data.users exists
      } catch (err) {
        setError(err.response ? err.response.data.message : "Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };


    fetchUsers();
  }, [authToken]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`https://studypage.onrender.com/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUsers(users.filter(user => user.id !== userId));
        alert("User deleted successfully");
      } catch (err) {
        alert(err.response ? err.response.data.message : "Failed to delete user.");
      }
    }
  };

  const handleUpdateUser = async (userId, isAdmin) => {
    const newIsAdmin = !isAdmin; // Toggle the is_admin status
    try {
      await axios.patch(`https://studypage.onrender.com/admin/users/${userId}`, { is_admin: newIsAdmin }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setUsers(users.map(user => (user.id === userId ? { ...user, is_admin: newIsAdmin } : user)));
      alert("User updated successfully");
    } catch (err) {
      alert(err.response ? err.response.data.message : "Failed to update user.");
    }
  };

  // New user handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://studypage.onrender.com/admin/users", newUser, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Log the full response for debugging
      console.log("Response from server:", response.data);

      // Check if the response contains the expected user_id
      if (response.data && response.data.user_id) {
        const newUserObj = {
          id: response.data.user_id,
          username: newUser.username,
          email: newUser.email,
          is_admin: false // Set default value for new users
        };
        setUsers([...users, newUserObj]); // Add the new user to the state
        alert("User added successfully");
        setNewUser({ username: "", email: "", password: "" }); // Reset form
      } else {
        alert("Failed to add user: User data is not returned");
      }
    } catch (err) {
      console.error(err); // Log the full error for debugging
      alert(err.response ? err.response.data.message : "Failed to add user.");
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full bg-aliceblue min-h-screen p-4">
      <h2 className="text-xl sm:text-2xl mb-4">User Management</h2>

      {/* Add User Form */}
      <form onSubmit={handleAddUser} className="mb-4">
        <h3 className="text-lg mb-2">Add New User</h3>
        <div className="flex flex-col mb-2">
        <input
          type="text"
          name="username"
          value={newUser.username}
          onChange={handleInputChange}
          placeholder="Username"
          required
          className="border border-gray-300 px-2 py-1 mr-2 mb-2 rounded-md"
        />
        <input
          type="email"
          name="email"
          value={newUser.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
          className="border border-gray-300 px-2 py-1 mr-2 mb-2 rounded-md"
        />
        <input
          type="password"
          name="password"
          value={newUser.password}
          onChange={handleInputChange}
          placeholder="Password"
          required
          className="border border-gray-300 px-2 py-1 mr-2 mb-2 rounded-md"
        />
        <button
          type="submit"
          className="bg-[#769594] text-white py-1 px-4 rounded-md"
        >
          Add User
        </button>

        </div>
        
      </form>

      {/* Users Table */}
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Username</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Admin</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border border-gray-300 px-4 py-2">{user.id}</td>
              <td className="border border-gray-300 px-4 py-2">{user.username}</td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleUpdateUser(user.id, user.is_admin)}
                  className={`py-1 px-2 rounded-md ${user.is_admin ? 'bg-[#769594] text-white' : 'bg-[#85C4C2] text-white'}`}
                >
                  {user.is_admin ? 'Revoke Admin' : 'Make Admin'}
                </button>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-[#769594] text-white py-1 px-2 rounded-md"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllUsers;
