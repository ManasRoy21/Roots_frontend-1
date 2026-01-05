import React, { useState } from 'react';
import './PhotoDropzone.scss';

interface PhotoDropzoneProps {
  onFilesSelected: (files: File[], error: string | null) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  error?: string | null;
}

interface ValidationResult {
  validFiles: File[];
  errors: string[];
}

const PhotoDropzone: React.FC<PhotoDropzoneProps> = ({ 
  onFilesSelected, 
  maxFiles = 10, 
  maxSizeMB = 10, 
  acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'],
  error = null 
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const validateFiles = (files: File[]): ValidationResult => {
    const errors: string[] = [];
    const validFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (files.length > maxFiles) {
      errors.push(`You can upload a maximum of ${maxFiles} photos at once.`);
      return { validFiles: [], errors };
    }

    for (const file of files) {
      // Check file type
      if (!acceptedFormats.includes(file.type)) {
        errors.push(`${file.name}: Only image files are accepted (JPG, PNG, GIF, SVG).`);
        continue;
      }

      // Check file size
      if (file.size > maxSizeBytes) {
        errors.push(`${file.name}: Image must be smaller than ${maxSizeMB}MB.`);
        continue;
      }

      validFiles.push(file);
    }

    return { validFiles, errors };
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const { validFiles, errors } = validateFiles(files);
    
    if (errors.length > 0) {
      onFilesSelected([], errors.join(' '));
    } else {
      onFilesSelected(validFiles, null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const { validFiles, errors } = validateFiles(files);
    
    if (errors.length > 0) {
      onFilesSelected([], errors.join(' '));
    } else {
      onFilesSelected(validFiles, null);
    }
    
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleClick = () => {
    const input = document.getElementById('photo-dropzone-input') as HTMLInputElement;
    input?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="photo-dropzone-wrapper">
      <div
        className={`photo-dropzone ${isDragging ? 'photo-dropzone-dragging' : ''} ${error ? 'photo-dropzone-error' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Upload photos by clicking or dragging files"
      >
        <input
          id="photo-dropzone-input"
          type="file"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={handleFileSelect}
          className="photo-dropzone-input"
          aria-hidden="true"
        />
        <svg 
          className="photo-dropzone-icon" 
          width="48" 
          height="48" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path 
            d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        <p className="photo-dropzone-text">
          <span className="photo-dropzone-text-primary">Click to upload</span> or drag and drop
        </p>
        <p className="photo-dropzone-hint">
          SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
        </p>
      </div>
      {error && (
        <span className="photo-dropzone-error-message" role="alert" aria-live="assertive">
          {error}
        </span>
      )}
    </div>
  );
};

export default PhotoDropzone;