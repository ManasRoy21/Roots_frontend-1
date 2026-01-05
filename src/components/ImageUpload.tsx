import React, { useRef } from 'react';
import { ImageUploadProps } from '../types/components';
import './ImageUpload.scss';

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onUpload, 
  preview = null, 
  maxSize = 5, // in MB
  error = null,
  className = '',
  'data-testid': dataTestId
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      if (onUpload) {
        onUpload(null, 'Only image files are accepted (JPG, PNG, GIF)');
      }
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      if (onUpload) {
        onUpload(null, `Image must be smaller than ${maxSize}MB`);
      }
      return;
    }

    // File is valid
    if (onUpload) {
      onUpload(file, null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className={`image-upload-wrapper ${className}`} data-testid={dataTestId}>
      <div 
        className={`image-upload-circle ${error ? 'image-upload-error' : ''}`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Upload profile photo"
      >
        {preview ? (
          <img src={preview} alt="Profile preview" className="image-upload-preview" />
        ) : (
          <div className="image-upload-placeholder">
            <svg 
              className="camera-icon" 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileChange}
        className="image-upload-input"
        aria-hidden="true"
      />
      {error && (
        <span className="image-upload-error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default ImageUpload;
