import React from 'react';
import './LoadingSpinner.scss';

interface LoadingSpinnerProps {
  fullscreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullscreen = false }) => {
  return (
    <div className={`loading-spinner-container ${fullscreen ? 'loading-spinner-fullscreen' : ''}`}>
      <div className="loading-spinner" role="status" aria-label="Loading">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;