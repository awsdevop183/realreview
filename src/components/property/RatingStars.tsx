import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  initialRating?: number;
  totalStars?: number;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  initialRating = 0,
  totalStars = 5,
  onRate,
  size = 'md',
  readOnly = false,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const starSizeClass = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const containerClass = {
    sm: 'space-x-1',
    md: 'space-x-2',
    lg: 'space-x-3',
  };

  const handleRating = (value: number) => {
    if (readOnly) return;
    setRating(value);
    if (onRate) {
      onRate(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (readOnly) return;
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  return (
    <div className={`flex ${containerClass[size]}`}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= (hoverRating || rating);
        
        return (
          <button
            key={index}
            type="button"
            className={`focus:outline-none transition-colors ${
              readOnly ? 'cursor-default' : 'cursor-pointer'
            }`}
            onClick={() => handleRating(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            disabled={readOnly}
            aria-label={`Rate ${starValue} out of ${totalStars} stars`}
          >
            <Star
              className={`${starSizeClass[size]} ${
                isActive
                  ? 'text-yellow-500 fill-current'
                  : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;