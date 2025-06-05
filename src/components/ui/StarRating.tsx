import React, { useState, useEffect, useCallback } from 'react';
import { Star } from 'lucide-react';
import { debugRatingButton } from '../../utils/troubleshoot';

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
  const [debugMode, setDebugMode] = useState(false);

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

  const handleClick = useCallback((index: number) => {
    if (readOnly) return;
    
    const newRating = index + 1;
    setRating(newRating);
    setHoverRating(0);
    
    if (onChange) {
      onChange(newRating);
    }

    if (debugMode) {
      const button = document.querySelector(`[data-star-index="${index}"]`);
      if (button instanceof HTMLElement) {
        const debugInfo = debugRatingButton(button);
        console.log('Star Rating Debug Info:', debugInfo);
      }
    }
  }, [readOnly, onChange, debugMode]);

  const handleMouseEnter = (index: number) => {
    if (readOnly) return;
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  // Enable debug mode with keyboard shortcut (Ctrl/Cmd + Shift + D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        setDebugMode(prev => !prev);
        console.log('Star Rating Debug Mode:', !debugMode);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [debugMode]);

  return (
    <div 
      className="flex items-center gap-2"
      onMouseLeave={handleMouseLeave}
      data-rating-context
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
              data-star-index={index}
              data-testid={`star-${index}`}
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
      {debugMode && (
        <span className="text-xs text-primary ml-2">Debug Mode Active</span>
      )}
    </div>
  );
};

export default StarRating;