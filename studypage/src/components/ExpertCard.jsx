import React, { useState } from 'react';
import { Star } from 'lucide-react';
import ExpertDetailModal from './admin/ExpertDetailModal'
// studypage/src/components/admin/ExpertDetailModal.jsx
const ExpertCard = ({ expert, onHire, currentUser }) => {
  const [isHovered, setIsHovered] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // console.log('this current user s great',currentUser)

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={10}
            className={`md:w-4 md:h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={expert.profilePicture}
          alt={expert.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
          {/* {expert.isAiFree && (
          <div className="absolute top-0 right-0 transform translate-x-[30%] -translate-y-[10%] rotate-45">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-[8px] md:text-xs py-1 px-8 shadow-lg font-semibold">
              AI FREE
            </div>
          </div>
        )} */}

        {expert.isAiFree && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-lg">
            <span className="text-[8px] md:text-xs font-semibold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              AI FREE
            </span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h2 className="text-white text-xl font-semibold">{expert.name}</h2>
          <p className="text-white/90 text-sm">{expert.title}</p>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4">
        {/* Rating Section */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {renderStars(expert.rating || 4.5)}
            <span className="text-sm text-gray-600">
              ({expert.totalReviews || 24} reviews)
            </span>
          </div>
          <span className="text-sm font-medium text-green-600">
            {expert.successRate || "98%"} Success Rate
          </span>
        </div>

        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {expert.expertise?.split(',').slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full"
            >
              {skill.trim()}
            </span>
          ))}
        </div>

        {/* Education & Languages */}
        <div className="space-y-2 mb-4">
          {expert.education && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">📚</span>
              <p className="text-sm text-gray-700">{expert.education}</p>
            </div>
          )}
          {expert.languages && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">🌍</span>
              <p className="text-sm text-gray-700">
                {expert.languages.split(',').slice(0, 3).join(', ')}
              </p>
            </div>
          )}
            <button
              onClick={() => setShowDetailModal(true)}
              className="text-blue-600 text-xs hover:underline mt-2"
            >
              View Profile
            </button>
        </div>

        {/* Hire Button */}
        <button
          onClick={() => onHire(expert.id)}
          className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <span>Hire Expert</span>
          <span className="text-sm">→</span>
        </button>
      </div>
      <ExpertDetailModal
        expert={expert}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        currentUser={currentUser}
      />
    </div>
  );
};

export default ExpertCard;