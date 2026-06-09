import React from 'react';
import { FiStar } from 'react-icons/fi';

const StarRating = ({ rating, onRate, size = 24, interactive = false }) => {
  const [hover, setHover] = React.useState(0);

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate?.(star)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
        >
          <FiStar
            size={size}
            className={`transition-colors ${star <= (hover || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
