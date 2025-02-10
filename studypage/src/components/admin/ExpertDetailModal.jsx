import React, { useState, useEffect, useContext } from 'react';
import { X, Send, Star } from 'lucide-react';
import { UserContext } from "../contexts/userContext";
// import { UserContext } from '../contexts/userContext';

const ExpertDetailModal = ({ expert, isOpen, onClose, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { authToken } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    if (isOpen && expert) {
      fetchComments();
    }
  }, [isOpen, expert]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`https://studypage.onrender.com/experts/${expert.id}/comments`);
      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please log in to leave a comment');
      return;
    }
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`https://studypage.onrender.com/experts/${expert.id}/comments/${currentUser.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ content: newComment }),
      });
      const data = await response.json();
      setComments([data.comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !expert) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Left Column - Image and Basic Info */}
          <div className="md:w-1/3 bg-gray-50 p-6">
            <div className="relative w-full pt-[100%] rounded-lg overflow-hidden mb-4">
              <img
                src={expert.profilePicture}
                alt={expert.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {expert.isAiFree && (
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-sm font-semibold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    AI FREE
                  </span>
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-bold mb-2">{expert.name}</h2>
            <p className="text-gray-600 mb-4">{expert.title}</p>
            
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={`${
                    star <= (expert.rating || 4.5)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600">
                ({expert.totalReviews || 0} reviews)
              </span>
            </div>

            <div className="text-sm text-gray-600">
              <p className="mb-2">Success Rate: {expert.successRate}</p>
              <p className="mb-2">Languages: {expert.languages}</p>
            </div>
          </div>

          {/* Right Column - Tabs and Content */}
          <div className="md:w-2/3 p-6 overflow-y-auto">
            {/* Tabs */}
            <div className="flex border-b mb-6">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'about'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('about')}
              >
                About
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'comments'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('comments')}
              >
                Comments
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'about' ? (
              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold mb-2">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {expert.expertise?.split(',').map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-2">Education</h3>
                  <p className="text-gray-700">{expert.education}</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-2">Biography</h3>
                  <p className="text-gray-700">{expert.biography}</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{expert.description}</p>
                </section>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Comment Form */}
                <form onSubmit={handleSubmitComment} className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                {comments.map((comment) => (
                  <div 
                    key={comment.id} 
                    className="border rounded-lg p-4 mb-4 shadow-sm bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="font-semibold text-blue-800 text-lg">
                          User {comment.user_id}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertDetailModal;