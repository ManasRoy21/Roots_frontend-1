import React from 'react';
import './PhotoPreviewGrid.scss';

interface PhotoPreviewGridProps {
  files: File[];
  previews: string[];
  onClearAll: () => void;
  onRemove: (index: number) => void;
}

const PhotoPreviewGrid: React.FC<PhotoPreviewGridProps> = ({ 
  files, 
  previews, 
  onClearAll, 
  onRemove 
}) => {
  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div className="photo-preview-grid-wrapper" role="region" aria-label="Photo preview">
      <div className="photo-preview-header">
        <h3 className="photo-preview-title" id="photo-preview-title">
          Ready to Upload ({files.length})
        </h3>
        <button 
          type="button"
          className="photo-preview-clear-all"
          onClick={onClearAll}
          aria-label={`Clear all ${files.length} photos`}
        >
          Clear all
        </button>
      </div>
      <div className="photo-preview-grid" role="list" aria-labelledby="photo-preview-title">
        {previews.map((preview, index) => (
          <div key={index} className="photo-preview-item" role="listitem">
            <img 
              src={preview} 
              alt={files[index]?.name || `Photo ${index + 1}`}
              className="photo-preview-image"
            />
            <button
              type="button"
              className="photo-preview-remove"
              onClick={() => onRemove(index)}
              aria-label={`Remove ${files[index]?.name || `photo ${index + 1}`}`}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path 
                  d="M12 4L4 12M4 4L12 12" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="photo-preview-name">
              {files[index]?.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoPreviewGrid;