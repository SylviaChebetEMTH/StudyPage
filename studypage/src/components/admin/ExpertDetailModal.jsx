// import React, { useState, useEffect, useContext } from 'react';
// import { X, Send, Star, Award, Book, Globe, MessageCircle, Calendar, User, ChevronDown, ChevronUp } from 'lucide-react';
// import { UserContext } from "../contexts/userContext";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const ExpertDetailModal = ({ expert, isOpen, onClose, currentUser }) => {
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('about');
//   const [loadingComments, setLoadingComments] = useState(true);
//   const [expandedSections, setExpandedSections] = useState({
//     expertise: true,
//     education: true,
//     biography: true,
//     description: true
//   });
//   const { authToken } = useContext(UserContext);

//   useEffect(() => {
//     if (isOpen && expert) {
//       fetchComments();
//     }
//   }, [isOpen, expert]);

//   const fetchComments = async () => {
//     setLoadingComments(true);
//     try {
//       const response = await fetch(`https://studypage.onrender.com/experts/${expert.id}/comments`);
//       const data = await response.json();
//       setComments(data.comments || []);
//     } catch (error) {
//       console.error('Error fetching comments:', error);
//       toast.error('Failed to load comments');
//     } finally {
//       setLoadingComments(false);
//     }
//   };

//   const handleSubmitComment = async (e) => {
//     e.preventDefault();
//     if (!currentUser) {
//       toast.error('Please log in to leave a comment');
//       return;
//     }
//     if (!newComment.trim()) return;

//     setLoading(true);
//     try {
//       const response = await fetch(`https://studypage.onrender.com/experts/${expert.id}/comments/${currentUser.id}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${authToken}`
//         },
//         body: JSON.stringify({ content: newComment }),
//       });
//       const data = await response.json();
//       if (data.comment) {
//         setComments([data.comment, ...comments]);
//         setNewComment('');
//         toast.success('Comment posted successfully');
//       } else {
//         toast.error('Failed to post comment');
//       }
//     } catch (error) {
//       console.error('Error posting comment:', error);
//       toast.error('Error posting comment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleSection = (section) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   const renderStars = (rating) => {
//     return (
//       <div className="flex items-center gap-1">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <Star
//             key={star}
//             size={16}
//             className={`${
//               star <= (expert.rating || 4.5)
//                 ? 'fill-yellow-400 text-yellow-400'
//                 : 'text-gray-300'
//             }`}
//           />
//         ))}
//       </div>
//     );
//   };

//   if (!isOpen || !expert) return null;

//   return (
//     <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
//       <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden relative shadow-2xl flex flex-col">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50 bg-white/80 rounded-full p-1"
//           aria-label="Close modal"
//         >
//           <X size={20} />
//         </button>

//         <div className="flex flex-col md:flex-row h-full overflow-hidden">
//           {/* Left Column - Image and Basic Info */}
//           <div className="md:w-1/3 lg:w-1/4 bg-gradient-to-b from-gray-50 to-white p-4 md:p-6 flex flex-col">
//             <div className="relative w-full pt-[100%] rounded-lg overflow-hidden mb-4 shadow-md">
//               <img
//                 src={expert.profile_picture || expert.profilePicture }
//                 alt={expert.name}
//                 className="absolute inset-0 w-full h-full object-cover"
//               />
//               {expert.isAiFree && (
//                 <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
//                   <span className="text-sm font-semibold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
//                     AI FREE
//                   </span>
//                 </div>
//               )}
//             </div>
            
//             <h2 className="text-xl font-bold mb-1">{expert.name}</h2>
//             <p className="text-gray-600 mb-4 text-sm">{expert.title}</p>
            
//             <div className="flex items-center gap-2 mb-3">
//               {renderStars(expert.rating || 4.5)}
//               <span className="text-sm text-gray-600">
//                 ({expert.totalReviews || 0})
//               </span>
//             </div>

//             <div className="space-y-3 text-sm">
//               <div className="flex items-center gap-2">
//                 <Award size={16} className="text-green-500" />
//                 <p className="text-gray-700">Success Rate: <span className="font-medium text-xs text-green-600">{expert.successRate}  %  </span></p>
//               </div>
              
//               <div className="flex items-start gap-2">
//                 <Globe size={16} className="text-blue-500 flex-shrink-0 mt-1" />
//                 <p className="text-gray-700">Languages: <span className="font-medium">{expert.languages}</span></p>
//               </div>
              
//               <div className="flex items-start gap-2">
//                 <Book size={16} className="text-purple-500 flex-shrink-0 mt-1" />
//                 <p className="text-gray-700 line-clamp-2">Education: <span className="font-medium">{expert.education}</span></p>
//               </div>
//             </div>
            
//             <div className="flex flex-wrap gap-1 mt-4">
//               {expert.expertise?.split(',').slice(0, 3).map((skill, index) => (
//                 <span
//                   key={index}
//                   className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
//                 >
//                   {skill.trim()}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Right Column - Tabs and Content */}
//           <div className="md:w-2/3 lg:w-3/4 overflow-y-auto p-4 md:p-6 flex flex-col">
//             {/* Tabs */}
//             <div className="flex border-b mb-4 -mx-2">
//               <button
//                 className={`px-4 py-2 font-medium text-sm ${
//                   activeTab === 'about'
//                     ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
//                     : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
//                 } rounded-t-lg`}
//                 onClick={() => setActiveTab('about')}
//               >
//                 About
//               </button>
//               <button
//                 className={`px-4 py-2 font-medium text-sm ${
//                   activeTab === 'comments'
//                     ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
//                     : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
//                 } rounded-t-lg`}
//                 onClick={() => setActiveTab('comments')}
//               >
//                 Reviews
//               </button>
//             </div>

//             {/* Tab Content */}
//             {activeTab === 'about' ? (
//               <div className="space-y-4 flex-grow">
//                 {/* Expertise Section */}
//                 <section className="border rounded-lg bg-white shadow-sm overflow-hidden">
//                   <div 
//                     className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
//                     onClick={() => toggleSection('expertise')}
//                   >
//                     <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                       <Award size={18} className="text-blue-600" />
//                       Expertise
//                     </h3>
//                     {expandedSections.expertise ? 
//                       <ChevronUp size={18} className="text-gray-500" /> : 
//                       <ChevronDown size={18} className="text-gray-500" />
//                     }
//                   </div>
                  
//                   {expandedSections.expertise && (
//                     <div className="p-4">
//                       <div className="flex flex-wrap gap-2 mb-2">
//                         {expert.expertise?.split(',').map((skill, index) => (
//                           <span
//                             key={index}
//                             className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
//                           >
//                             {skill.trim()}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </section>

//                 {/* Education Section */}
//                 <section className="border rounded-lg bg-white shadow-sm overflow-hidden">
//                   <div 
//                     className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
//                     onClick={() => toggleSection('education')}
//                   >
//                     <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                       <Book size={18} className="text-purple-600" />
//                       Education
//                     </h3>
//                     {expandedSections.education ? 
//                       <ChevronUp size={18} className="text-gray-500" /> : 
//                       <ChevronDown size={18} className="text-gray-500" />
//                     }
//                   </div>
                  
//                   {expandedSections.education && (
//                     <div className="p-4">
//                       <p className="text-gray-700">{expert.education}</p>
//                     </div>
//                   )}
//                 </section>

//                 {/* Biography Section */}
//                 <section className="border rounded-lg bg-white shadow-sm overflow-hidden">
//                   <div 
//                     className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
//                     onClick={() => toggleSection('biography')}
//                   >
//                     <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                       <User size={18} className="text-green-600" />
//                       Biography
//                     </h3>
//                     {expandedSections.biography ? 
//                       <ChevronUp size={18} className="text-gray-500" /> : 
//                       <ChevronDown size={18} className="text-gray-500" />
//                     }
//                   </div>
                  
//                   {expandedSections.biography && (
//                     <div className="p-4">
//                       <p className="text-gray-700 whitespace-pre-line">{expert.biography}</p>
//                     </div>
//                   )}
//                 </section>

//                 {/* Description Section */}
//                 <section className="border rounded-lg bg-white shadow-sm overflow-hidden">
//                   <div 
//                     className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
//                     onClick={() => toggleSection('description')}
//                   >
//                     <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                       <MessageCircle size={18} className="text-amber-600" />
//                       Description
//                     </h3>
//                     {expandedSections.description ? 
//                       <ChevronUp size={18} className="text-gray-500" /> : 
//                       <ChevronDown size={18} className="text-gray-500" />
//                     }
//                   </div>
                  
//                   {expandedSections.description && (
//                     <div className="p-4">
//                       <p className="text-gray-700">{expert.description}</p>
//                     </div>
//                   )}
//                 </section>
//               </div>
//             ) : (
//               <div className="space-y-4 flex-grow">
//                 {/* Comment Form */}
//                 <form onSubmit={handleSubmitComment} className="mb-4">
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={newComment}
//                       onChange={(e) => setNewComment(e.target.value)}
//                       placeholder={currentUser ? "Write a comment..." : "Please log in to comment"}
//                       className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
//                       disabled={loading || !currentUser}
//                     />
//                     <button
//                       type="submit"
//                       disabled={loading || !currentUser || !newComment.trim()}
//                       className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-400 transition-colors"
//                     >
//                       {loading ? "Sending..." : <Send size={18} />}
//                     </button>
//                   </div>
//                 </form>

//                 {/* Comments List */}
//                 <div className="space-y-4">
//                   {loadingComments ? (
//                     <div className="text-center py-8">
//                       <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
//                       <p className="mt-2 text-gray-600">Loading comments...</p>
//                     </div>
//                   ) : comments.length > 0 ? (
//                     comments.map((comment) => (
//                       <div 
//                         key={comment.id} 
//                         className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow"
//                       >
//                         <div className="flex justify-between items-center mb-3">
//                           <div className="flex items-center gap-2">
//                             <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">
//                               {comment.user_id.toString().charAt(0).toUpperCase()}
//                             </div>
//                             <div>
//                               <p className="font-semibold text-gray-800">
//                                 User {comment.user_id}
//                               </p>
//                               <div className="flex items-center gap-1 text-xs text-gray-500">
//                                 <Calendar size={12} />
//                                 {new Date(comment.created_at).toLocaleDateString('en-US', {
//                                   year: 'numeric',
//                                   month: 'short',
//                                   day: 'numeric'
//                                 })}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <p className="text-gray-700 leading-relaxed pl-10">
//                           {comment.content}
//                         </p>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-center py-8 bg-gray-50 rounded-lg">
//                       <MessageCircle size={36} className="mx-auto text-gray-400 mb-2" />
//                       <p className="text-gray-600">No comments yet. Be the first to leave a review!</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExpertDetailModal;




import React, { useState, useEffect, useContext } from 'react';
import { X, Send, Star, Award, Book, Globe, MessageCircle, Calendar, User, ChevronDown, ChevronUp } from 'lucide-react';
import { UserContext } from "../contexts/userContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExpertDetailModal = ({ expert, isOpen, onClose, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [loadingComments, setLoadingComments] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    expertise: true,
    education: true,
    biography: true,
    description: true
  });
  const { authToken } = useContext(UserContext);

  useEffect(() => {
    if (isOpen && expert) {
      fetchComments();
    }
  }, [isOpen, expert]);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const response = await fetch(`https://studypage-h2eu.onrender.com/experts/${expert.id}/comments`);
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please log in to leave a comment');
      return;
    }
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`https://studypage-h2eu.onrender.com/experts/${expert.id}/comments/${currentUser.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ content: newComment }),
      });
      const data = await response.json();
      if (data.comment) {
        setComments([data.comment, ...comments]);
        setNewComment('');
        toast.success('Comment posted successfully');
      } else {
        toast.error('Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Error posting comment');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
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
      </div>
    );
  };

  if (!isOpen || !expert) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden relative shadow-2xl flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-500 hover:text-gray-700 z-50 bg-white/80 rounded-full p-1"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Mobile View - Top Profile Info */}
        <div className="md:hidden p-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-md flex-shrink-0">
              <img
                src={expert.profile_picture || expert.profilePicture}
                alt={expert.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold mb-1">{expert.name}</h2>
              <p className="text-gray-600 text-sm">{expert.title}</p>
              <div className="flex items-center gap-2 mt-1">
                {renderStars(expert.rating || 4.5)}
                <span className="text-xs text-gray-600">
                  ({expert.totalReviews || 0})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs - Mobile & Desktop */}
        <div className="flex border-b sticky top-0 bg-white z-10">
          <button
            className={`flex-1 px-4 py-3 font-medium text-sm ${
              activeTab === 'about'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button
            className={`flex-1 px-4 py-3 font-medium text-sm ${
              activeTab === 'comments'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('comments')}
          >
            Reviews
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          {/* Left Column - Desktop Only Image and Basic Info */}
          <div className="hidden md:block md:w-1/3 lg:w-1/4 bg-gradient-to-b from-gray-50 to-white p-4 md:p-6 flex-col overflow-y-auto">
            <div className="relative w-full pt-[100%] rounded-lg overflow-hidden mb-4 shadow-md">
              <img
                src={expert.profile_picture || expert.profilePicture}
                alt={expert.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {expert.isAiFree && (
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
                  <span className="text-sm font-semibold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
                    AI FREE
                  </span>
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-bold mb-1">{expert.name}</h2>
            <p className="text-gray-600 mb-4 text-sm">{expert.title}</p>
            
            <div className="flex items-center gap-2 mb-3">
              {renderStars(expert.rating || 4.5)}
              <span className="text-sm text-gray-600">
                ({expert.totalReviews || 0})
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-green-500" />
                <p className="text-gray-700">Success Rate: <span className="font-medium text-xs text-green-600">{expert.successRate}%</span></p>
              </div>
              
              <div className="flex items-start gap-2">
                <Globe size={16} className="text-blue-500 flex-shrink-0 mt-1" />
                <p className="text-gray-700">Languages: <span className="font-medium">{expert.languages}</span></p>
              </div>
              
              <div className="flex items-start gap-2">
                <Book size={16} className="text-purple-500 flex-shrink-0 mt-1" />
                <p className="text-gray-700 line-clamp-2">Education: <span className="font-medium">{expert.education}</span></p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-4">
              {expert.expertise?.split(',').slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column - Content Area with Scrolling */}
          <div className="flex-1 overflow-y-auto md:w-2/3 lg:w-3/4 p-4">
            {/* Tab Content */}
            {activeTab === 'about' ? (
              <div className="space-y-4">
                {/* Mobile Only - Brief Stats */}
                <div className="md:hidden grid grid-cols-2 gap-3 mb-4">
                  <div className="border rounded-lg p-3 bg-white shadow-sm">
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-green-500" />
                      <p className="text-gray-700 text-sm">Success Rate</p>
                    </div>
                    <p className="font-semibold text-green-600 mt-1">{expert.successRate}%</p>
                  </div>
                  
                  <div className="border rounded-lg p-3 bg-white shadow-sm">
                    <div className="flex items-center gap-2">
                      <Globe size={16} className="text-blue-500" />
                      <p className="text-gray-700 text-sm">Languages</p>
                    </div>
                    <p className="font-semibold text-gray-800 mt-1 truncate">{expert.languages}</p>
                  </div>
                </div>

                {/* Expertise Section */}
                <section className="border rounded-lg bg-white shadow-sm overflow-hidden">
                  <div 
                    className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                    onClick={() => toggleSection('expertise')}
                  >
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Award size={18} className="text-blue-600" />
                      Expertise
                    </h3>
                    {expandedSections.expertise ? 
                      <ChevronUp size={18} className="text-gray-500" /> : 
                      <ChevronDown size={18} className="text-gray-500" />
                    }
                  </div>
                  
                  {expandedSections.expertise && (
                    <div className="p-4">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {expert.expertise?.split(',').map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* Education Section */}
                <section className="border rounded-lg bg-white shadow-sm overflow-hidden">
                  <div 
                    className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                    onClick={() => toggleSection('education')}
                  >
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Book size={18} className="text-purple-600" />
                      Education
                    </h3>
                    {expandedSections.education ? 
                      <ChevronUp size={18} className="text-gray-500" /> : 
                      <ChevronDown size={18} className="text-gray-500" />
                    }
                  </div>
                  
                  {expandedSections.education && (
                    <div className="p-4">
                      <p className="text-gray-700">{expert.education}</p>
                    </div>
                  )}
                </section>

                {/* Biography Section */}
                <section className="border rounded-lg bg-white shadow-sm overflow-hidden">
                  <div 
                    className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                    onClick={() => toggleSection('biography')}
                  >
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <User size={18} className="text-green-600" />
                      Biography
                    </h3>
                    {expandedSections.biography ? 
                      <ChevronUp size={18} className="text-gray-500" /> : 
                      <ChevronDown size={18} className="text-gray-500" />
                    }
                  </div>
                  
                  {expandedSections.biography && (
                    <div className="p-4">
                      <p className="text-gray-700 whitespace-pre-line">{expert.biography}</p>
                    </div>
                  )}
                </section>

                {/* Description Section */}
                <section className="border rounded-lg bg-white shadow-sm overflow-hidden">
                  <div 
                    className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                    onClick={() => toggleSection('description')}
                  >
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <MessageCircle size={18} className="text-amber-600" />
                      Description
                    </h3>
                    {expandedSections.description ? 
                      <ChevronUp size={18} className="text-gray-500" /> : 
                      <ChevronDown size={18} className="text-gray-500" />
                    }
                  </div>
                  
                  {expandedSections.description && (
                    <div className="p-4">
                      <p className="text-gray-700">{expert.description}</p>
                    </div>
                  )}
                </section>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Comment Form */}
                <form onSubmit={handleSubmitComment} className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={currentUser ? "Write a comment..." : "Please log in to comment"}
                      className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                      disabled={loading || !currentUser}
                    />
                    <button
                      type="submit"
                      disabled={loading || !currentUser || !newComment.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-400 transition-colors"
                    >
                      {loading ? "Sending..." : <Send size={18} />}
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {loadingComments ? (
                    <div className="text-center py-8">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                      <p className="mt-2 text-gray-600">Loading comments...</p>
                    </div>
                  ) : comments.length > 0 ? (
                    comments.map((comment) => (
                      <div 
                        key={comment.id} 
                        className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                              {comment.user_id.toString().charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                User {comment.user_id}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Calendar size={12} />
                                {new Date(comment.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed pl-10">
                          {comment.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <MessageCircle size={36} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">No comments yet. Be the first to leave a review!</p>
                    </div>
                  )}
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