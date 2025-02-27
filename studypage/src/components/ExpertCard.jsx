// import React, { useState,useContext } from 'react';
// import { IoMdChatbubbles } from 'react-icons/io';
// import { Star } from 'lucide-react';
// import ChatModal from './ChatModal';
// import ExpertDetailModal from './admin/ExpertDetailModal'
// import { UserContext } from './contexts/userContext';
// import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // studypage/src/components/admin/ExpertDetailModal.jsx
// const ExpertCard = ({ expert, onHire, currentUser }) => {
//   const [isHovered, setIsHovered] = useState(null);
//   const { authToken } = useContext(UserContext);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [showChatModal, setShowChatModal] = useState(false);

//   // console.log('this current user s great',currentUser)

//   const renderStars = (rating) => {
//     return (
//       <div className="flex items-center gap-1">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <Star
//             key={star}
//             size={10}
//             className={`md:w-4 md:h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
//           />
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div
//       className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Image Container */}
//       <div className="relative h-64 overflow-hidden">
//         <img
//           src={expert.profile_picture}
//           alt={expert.name}
//           className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
//         />

//         {expert.isAiFree && (
//           <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-lg">
//             <span className="text-[8px] md:text-xs font-semibold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
//               AI FREE
//             </span>
//           </div>
//         )}
//         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
//           <h2 className="text-white text-xl font-semibold">{expert.name}</h2>
//           <p className="text-white/90 text-sm">{expert.title}</p>
//         </div>
//       </div>

//       {/* Content Container */}
//       <div className="p-4">
//         {/* Rating Section */}
//         <div className="flex items-center justify-between mb-3">
//           <div className="flex items-center gap-2">
//             {renderStars(expert.rating || 4.5)}
//             <span className="text-sm text-gray-600">
//               ({expert.totalReviews || 24} reviews)
//             </span>
//           </div>
//           <span className="text-sm font-medium text-green-600">
//             {expert.successRate || "98%"} Success Rate
//           </span>
//         </div>

//         {/* Expertise Tags */}
//         <div className="flex flex-wrap gap-2 mb-3">
//           {expert.expertise?.split(',').slice(0, 3).map((skill, index) => (
//             <span
//               key={index}
//               className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full"
//             >
//               {skill.trim()}
//             </span>
//           ))}
//         </div>

//         {/* Education & Languages */}
//         <div className="space-y-2 mb-4">
//           {expert.education && (
//             <div className="flex items-center gap-2">
//               <span className="text-gray-600 text-sm">📚</span>
//               <p className="text-sm text-gray-700">{expert.education}</p>
//             </div>
//           )}
//           {expert.languages && (
//             <div className="flex items-center gap-2">
//               <span className="text-gray-600 text-sm">🌍</span>
//               <p className="text-sm text-gray-700">
//                 {expert.languages.split(',').slice(0, 3).join(', ')}
//               </p>
//             </div>
//           )}
//             <button
//               onClick={() => setShowDetailModal(true)}
//               className="text-blue-600 text-xs hover:underline mt-2"
//             >
//               View Profile
//             </button>
//         </div>

//         {/* Hire Button */}
//         <button
//           onClick={() => onHire(expert.id)}
//           className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors duration-300 flex items-center justify-center gap-2"
//         >
//           <span>Request Service</span>
//           <FontAwesomeIcon icon={faArrowRight} />
//         </button>
//         {currentUser && (
//           <button
//             onClick={() => setShowChatModal(true)}
//             className="w-full bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors duration-300 flex items-center justify-center gap-2 mt-2"
//           >
//             <span>Chat</span>
//             <IoMdChatbubbles />
//           </button>
//         )}
//       </div>
//       <ExpertDetailModal
//         expert={expert}
//         isOpen={showDetailModal}
//         onClose={() => setShowDetailModal(false)}
//         currentUser={currentUser}
//       />
//       {showChatModal && (
//         <ChatModal 
//           teacher={expert} 
//           curUser={currentUser}
//           auth={authToken}
//           onClose={() => setShowChatModal(false)} 
//           teach={expert}
//         />
//       )}
//     </div>
//   );
// };

// export default ExpertCard;






import React, { useState, useContext } from 'react';
import { IoMdChatbubbles } from 'react-icons/io';
import { Star, ArrowRight, Briefcase, GraduationCap, Globe } from 'lucide-react';
import ChatModal from './ChatModal';
import ExpertDetailModal from './admin/ExpertDetailModal';
import { UserContext } from './contexts/userContext';

const ExpertCard = ({ expert, onHire, currentUser }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const { authToken } = useContext(UserContext);

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={`md:w-4 md:h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const expertiseArray = expert.expertise?.split(',').slice(0, 3) || [];

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100">
      {/* Image Container with Gradient Overlay */}
      <div className="relative h-48 md:h-52 overflow-hidden">
        <img
          src={expert.profile_picture}
          alt={expert.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {expert.isAiFree && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg">
            <span className="text-xs font-semibold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
              AI FREE
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4">
          <h2 className="text-white text-xl font-bold">{expert.name}</h2>
          <p className="text-white/90 text-sm font-medium">{expert.title}</p>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 flex-grow flex flex-col justify-between gap-3">
        {/* Rating Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {renderStars(expert.rating || 4.5)}
            <span className="text-xs text-gray-500">
              ({expert.totalReviews || 24})
            </span>
          </div>
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {expert.successRate || "98%"} Success
          </span>
        </div>

        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          {expertiseArray.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full"
            >
              {skill.trim()}
            </span>
          ))}
        </div>

        {/* Education & Languages */}
        <div className="space-y-2 text-gray-600">
          {expert.education && (
            <div className="flex items-start gap-2">
              <GraduationCap size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
              <p className="text-xs leading-tight">{expert.education}</p>
            </div>
          )}
          {expert.languages && (
            <div className="flex items-start gap-2">
              <Globe size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
              <p className="text-xs leading-tight">
                {expert.languages.split(',').slice(0, 3).join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* View Profile Link */}
        <button
          onClick={() => setShowDetailModal(true)}
          className="text-blue-600 text-sm hover:underline flex items-center gap-1 mt-1 font-medium"
        >
          View Full Profile
        </button>

        {/* Action Buttons */}
        <div className="space-y-2 mt-2">
          <button
            onClick={() => onHire(expert.id)}
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center gap-2 font-medium"
          >
            <span>Request Service</span>
            <ArrowRight size={16} />
          </button>
          
          {currentUser && (
            <button
              onClick={() => setShowChatModal(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors duration-300 flex items-center justify-center gap-2 font-medium"
            >
              <span>Message Expert</span>
              <IoMdChatbubbles size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDetailModal && (
        <ExpertDetailModal
          expert={expert}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          currentUser={currentUser}
        />
      )}
      
      {showChatModal && (
        <ChatModal 
          teacher={expert} 
          curUser={currentUser}
          auth={authToken}
          onClose={() => setShowChatModal(false)} 
          teach={expert}
        />
      )}
    </div>
  );
};

export default ExpertCard;