import React from 'react';
import './PlaceholderCard.scss';

interface PlaceholderCardProps {
  type: string;
  label: string;
  onClick?: (type: string) => void;
}

const PlaceholderCard: React.FC<PlaceholderCardProps> = ({ 
  type, 
  label, 
  onClick 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(type);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick(type);
    }
  };

  return (
    <div 
      className="placeholder-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={label}
    >
      <div className="placeholder-card-icon" aria-hidden="true">
        <svg 
          width="32" 
          height="32" 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M16 8V24M8 16H24" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="placeholder-card-label">
        {label}
      </div>
    </div>
  );
};

export default PlaceholderCard;