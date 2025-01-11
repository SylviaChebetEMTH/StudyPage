import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ExpertComments = ({ expert, comments, authToken, onCommentUpdate, onCommentDelete }) => {
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  const handleEditComment = async (commentId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ content: editedContent })
      });

      if (!response.ok) {
        throw new Error('Failed to update comment');
      }

      const updatedComment = await response.json();
      onCommentUpdate(updatedComment);
      setEditingCommentId(null);
      toast.success('Comment updated successfully!', {
        position: 'top-right',
        autoClose: 3000
      });
    } catch (error) {
      toast.error('Error updating comment', {
        position: 'top-right',
        autoClose: 3000
      });
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      onCommentDelete(commentId);
      toast.success('Comment deleted successfully!', {
        position: 'top-right',
        autoClose: 3000
      });
    } catch (error) {
      toast.error('Error deleting comment', {
        position: 'top-right',
        autoClose: 3000
      });
    }
  };

  return (
    <div className="mt-4">
      <h3 className="font-semibold text-lg mb-2">Comments</h3>
      <div className="space-y-2">
        {comments?.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border rounded-lg p-3 bg-gray-50">
              {editingCommentId === comment.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows="3"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditComment(comment.id)}
                      className="px-3 py-1 bg-[#85C4C2] text-white rounded-md text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCommentId(null)}
                      className="px-3 py-1 bg-gray-400 text-white rounded-md text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start">
                    <p className="text-sm">{comment.content}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditedContent(comment.content);
                        }}
                        className="px-2 py-1 text-[#85C4C2] hover:text-[#769594] text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="px-2 py-1 text-red-500 hover:text-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    <span>By: {comment.user_name}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No comments yet</p>
        )}
      </div>
    </div>
  );
};

export default ExpertComments;