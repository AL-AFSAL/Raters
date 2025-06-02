import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  initialRating?: number;
  totalStars?: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  showPercentage?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  initialRating = 0,
  totalStars = 5,
  onChange,
  size = 'md',
  readOnly = false,
  showPercentage = false,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const starSize = sizeMap[size];
  const displayRating = hoverRating || rating;
  const percentage = Math.round((displayRating / totalStars) * 100);

  const handleClick = (index: number) => {
    if (readOnly) return;
    
    const newRating = index + 1;
    setRating(newRating);
    setHoverRating(0);
    if (onChange) {
      onChange(newRating);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (readOnly) return;
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  return (
    <div 
      className="flex items-center gap-2"
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center">
        {[...Array(totalStars)].map((_, index) => {
          const filled = index < displayRating;
          
          return (
            <button
              key={index}
              type="button"
              className={`relative ${
                readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
              } transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-opacity-50`}
              onClick={() => handleClick(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              disabled={readOnly}
              aria-label={`Rate ${index + 1} of ${totalStars} stars`}
            >
              <Star 
                className={`${starSize} ${
                  filled ? 'fill-[#FFD700] stroke-[#FFD700]' : 'stroke-[#FFD700]'
                } transition-colors duration-200`}
              />
            </button>
          );
        })}
      </div>
      
      {!readOnly && (
        <span className="text-text-secondary text-sm">
          {displayRating}/{totalStars}
        </span>
      )}
      {readOnly && showPercentage && (
        <span className="text-text-secondary text-sm">
          {percentage}%
        </span>
      )}
    </div>
  );
};

export default StarRating;