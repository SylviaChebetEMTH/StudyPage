import React, { useState } from 'react';
import { Star } from 'lucide-react';

const ExpertCard = ({ expert, onHire, currentUser }) => {
  const [isHovered, setIsHovered] = useState(null);

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
    <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
      {/* Image Container with AI-Free Banner */}
      <div className="relative h-24 md:h-40 overflow-hidden">
        <img
          src={expert.profilePicture}
          alt={expert.name}
          className="w-full h-full object-cover"
        />
        
        {/* AI-Free Banner */}
        {expert.isAiFree && (
          <div className="absolute top-0 right-0 transform translate-x-[30%] -translate-y-[10%] rotate-45">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-[8px] md:text-xs py-1 px-8 shadow-lg font-semibold">
              AI FREE
            </div>
          </div>
        )}

        {/* Alternative Banner Style (uncomment to use) */}
        {/*expert.isAiFree && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-lg">
            <span className="text-[8px] md:text-xs font-semibold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              AI FREE
            </span>
          </div>
        )*/}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1 md:p-2">
          <h2 className="text-white text-xs md:text-sm font-semibold truncate">{expert.name}</h2>
          <p className="text-white/90 text-[10px] md:text-xs truncate">{expert.title}</p>
        </div>
      </div>

      {/* Rest of the card content remains the same */}
      <div className="p-2 md:p-3">
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <div className="flex items-center gap-1">
            {renderStars(expert.rating || 4.5)}
            <span className="text-[10px] md:text-xs text-gray-600">
              ({expert.totalReviews || 24})
            </span>
          </div>
          <span className="text-[10px] md:text-xs font-medium text-green-600">
            {expert.successRate || "98%"}
          </span>
        </div>

        <div className="hidden md:flex flex-wrap gap-1 mb-2">
          {expert.expertise?.split(',').slice(0, 2).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full"
            >
              {skill.trim()}
            </span>
          ))}
        </div>

        <div className="hidden md:block space-y-1 mb-3">
          {expert.education && (
            <div className="flex items-center gap-1">
              <span className="text-gray-600 text-xs">📚</span>
              <p className="text-xs text-gray-700 truncate">{expert.education}</p>
            </div>
          )}
          {expert.languages && (
            <div className="flex items-center gap-1">
              <span className="text-gray-600 text-xs">🌍</span>
              <p className="text-xs text-gray-700 truncate">
                {expert.languages.split(',').slice(0, 2).join(', ')}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => onHire(expert.id)}
          className="w-full bg-[#85C4C2] text-white py-1 md:py-1.5 px-2 md:px-3 rounded text-[10px] md:text-sm hover:bg-[#6EA5A4] transition-colors duration-300 flex items-center justify-center gap-1"
        >
          <span>Hire</span>
          <span className="hidden md:inline">Expert</span>
          <span className="text-[10px] md:text-xs">→</span>
        </button>
      </div>
    </div>
  );
};

export default ExpertCard;