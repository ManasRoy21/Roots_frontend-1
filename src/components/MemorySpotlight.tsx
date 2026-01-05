import React, { useState } from 'react';
import './MemorySpotlight.scss';

interface Memory {
  id: string;
  title: string;
  date: string;
  photoUrl: string;
  uploaderName?: string;
  isFavorite?: boolean;
}

interface MemorySpotlightProps {
  memory?: Memory | null;
  onFavoriteToggle?: (memoryId: string) => void;
  onMemoryClick?: (memoryId: string) => void;
}

const MemorySpotlight: React.FC<MemorySpotlightProps> = ({ memory, onFavoriteToggle, onMemoryClick }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(memory?.isFavorite || false);

  if (!memory) {
    return (
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Memory Spotlight</h2>
          <span className="memory-time">2 years ago</span>
        </div>
        <div className="memory-card">
          <p className="empty-state">No memories to display</p>
        </div>
      </section>
    );
  }

  const { id, title, date, photoUrl, uploaderName } = memory;

  const formatDate = (dateStr: string): string => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    
    if (diffYears === 0) {
      const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
      return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`;
    }
    return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
  };

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    if (onFavoriteToggle) {
      onFavoriteToggle(id);
    }
  };

  const handleCardClick = () => {
    if (onMemoryClick) {
      onMemoryClick(id);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleCardClick();
    }
  };

  return (
    <section className="dashboard-section">
      <div className="section-header">
        <h2>Memory Spotlight</h2>
        <span className="memory-time">{formatDate(date)}</span>
      </div>
      <div className="memory-card">
        <div 
          className="memory-image-container"
          onClick={handleCardClick}
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyPress}
        >
          <img src={photoUrl} alt={title} className="memory-image" />
          <div className="memory-overlay-info">
            <h3 className="memory-title">{title}</h3>
            <p className="memory-date">{formatDate(date)}</p>
          </div>
        </div>
        <div className="memory-footer">
          {uploaderName && (
            <p className="memory-uploader">Uploaded by {uploaderName}</p>
          )}
          <button
            className={`memory-favorite-icon ${isFavorite ? 'favorited' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isFavorite ? 'currentColor' : 'none'}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default MemorySpotlight;