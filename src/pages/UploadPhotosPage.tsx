import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  uploadPhotos, 
  getAlbums, 
  selectAlbums, 
  selectMemoryLoading, 
  selectUploadProgress 
} from '../redux/slices/memorySlice';
import MemoryService from '../services/MemoryService';
import NavigationBar from '../components/NavigationBar';
import BackLink from '../components/BackLink';
import PhotoDropzone from '../components/PhotoDropzone';
import PhotoPreviewGrid from '../components/PhotoPreviewGrid';
import Select from '../components/Select';
import Input from '../components/Input';
import DateInput from '../components/DateInput';
import TagSearch from '../components/TagSearch';
import Button from '../components/Button';
import { useAppDispatch, useAppSelector } from '../redux/store';
import './UploadPhotosPage.scss';

interface FormData {
  selectedFiles: File[];
  previews: string[];
  album: string;
  location: string;
  dateTaken: string;
  taggedPeople: string[];
  description: string;
}

interface FormErrors {
  [key: string]: string | null;
}

interface SearchResult {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
}

const UploadPhotosPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Redux state
  const albums = useAppSelector(selectAlbums);
  const isLoading = useAppSelector(selectMemoryLoading);
  const uploadProgress = useAppSelector(selectUploadProgress);

  // Mock mode for development
  const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

  // Form state
  const [formData, setFormData] = useState<FormData>({
    selectedFiles: [],
    previews: [],
    album: '',
    location: '',
    dateTaken: '',
    taggedPeople: [],
    description: '',
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedTags, setSelectedTags] = useState<SearchResult[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [dropzoneError, setDropzoneError] = useState<string | null>(null);

  // Load albums on mount
  useEffect(() => {
    dispatch(getAlbums());
  }, [dispatch]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFilesSelected = (files: File[], error: string | null) => {
    if (error) {
      setDropzoneError(error);
      return;
    }

    setDropzoneError(null);

    // Create preview URLs for selected files
    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      selectedFiles: [...prev.selectedFiles, ...files],
      previews: [...prev.previews, ...newPreviews],
    }));
  };

  const handleClearAll = () => {
    // Revoke all preview URLs to free memory
    formData.previews.forEach(preview => URL.revokeObjectURL(preview));
    
    setFormData(prev => ({
      ...prev,
      selectedFiles: [],
      previews: [],
    }));
    setDropzoneError(null);
  };

  const handleRemovePhoto = (index: number) => {
    // Revoke the preview URL for the removed photo
    URL.revokeObjectURL(formData.previews[index]);
    
    setFormData(prev => ({
      ...prev,
      selectedFiles: prev.selectedFiles.filter((_, i) => i !== index),
      previews: prev.previews.filter((_, i) => i !== index),
    }));
  };

  const handleCancel = () => {
    // Clean up preview URLs before navigating away
    formData.previews.forEach(preview => URL.revokeObjectURL(preview));
    navigate('/dashboard');
  };

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      formData.previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, []);

  const handleTagSearch = async (query: string) => {
    setSearchQuery(query);
    try {
      // searchFamilyMembers doesn't need to be in Redux state (per design doc requirement 5.5)
      // Call the service directly for search operations
      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 300));
        const mockMembers = [
          {
            id: 'mock-member-1',
            firstName: 'John',
            lastName: 'Doe',
            photoUrl: null,
          },
          {
            id: 'mock-member-2',
            firstName: 'Jane',
            lastName: 'Smith',
            photoUrl: null,
          },
        ];
        
        // Filter by query
        const filtered = mockMembers.filter(member =>
          `${member.firstName} ${member.lastName}`.toLowerCase().includes(query.toLowerCase())
        );
        
        setSearchResults(filtered);
      } else {
        const results = await MemoryService.searchMembers(query);
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Failed to search family members:', error);
      setSearchResults([]);
    }
  };

  const handleTagSelect = (memberId: string) => {
    // Check if already selected
    const isSelected = selectedTags.some(tag => tag.id === memberId);
    
    if (isSelected) {
      // Remove tag
      setSelectedTags(prev => prev.filter(tag => tag.id !== memberId));
      setFormData(prev => ({
        ...prev,
        taggedPeople: prev.taggedPeople.filter(id => id !== memberId),
      }));
    } else {
      // Add tag
      const member = searchResults.find(m => m.id === memberId);
      if (member) {
        setSelectedTags(prev => [...prev, member]);
        setFormData(prev => ({
          ...prev,
          taggedPeople: [...prev.taggedPeople, memberId],
        }));
      }
    }
  };

  const handleDescriptionChange = (value: string) => {
    // Enforce 500 character limit
    if (value.length <= 500) {
      handleInputChange('description', value);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // At least one photo is required
    if (formData.selectedFiles.length === 0) {
      newErrors.photos = 'Please select at least one photo to upload';
    }

    // Date format validation (if provided)
    if (formData.dateTaken) {
      const cleaned = formData.dateTaken.replace(/\s/g, '');
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      if (!dateRegex.test(cleaned)) {
        newErrors.dateTaken = 'Please enter a valid date (DD/MM/YYYY)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      // Convert date from DD/MM/YYYY to YYYY-MM-DD if provided
      let isoDate = null;
      if (formData.dateTaken) {
        const [day, month, year] = formData.dateTaken.replace(/\s/g, '').split('/');
        isoDate = `${year}-${month}-${day}`;
      }

      const memoryData = {
        albumId: formData.album || null,
        location: formData.location || null,
        dateTaken: isoDate,
        description: formData.description || null,
        taggedPeople: formData.taggedPeople,
      };

      const result = await dispatch(uploadPhotos({
        files: formData.selectedFiles,
        memoryData,
        onProgress: (progress) => {
          // Progress is already tracked by Redux
        }
      })).unwrap();

      // Check for partial failures
      if (result.hasPartialFailures) {
        const failedFiles = result.partialFailures.map(f => f.file).join(', ');
        navigate('/dashboard', { 
          state: { 
            message: `Photos uploaded with some failures. Failed files: ${failedFiles}`,
            type: 'warning'
          } 
        });
      } else {
        // Navigate to dashboard on success
        navigate('/dashboard', { 
          state: { 
            message: 'Photos uploaded successfully!' 
          } 
        });
      }
    } catch (error) {
      console.error('Failed to upload photos:', error);
      
      // Handle validation errors from server
      if (error.isValidationError && error.validationErrors) {
        setErrors(prev => ({
          ...prev,
          ...error.validationErrors,
          submit: error.message,
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          submit: error.message || error || 'Failed to upload photos. Please try again.',
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="upload-photos-page">
      <NavigationBar />
      
      <div className="page-container" role="main" aria-label="Upload photos form">
        <BackLink to="/dashboard" label="Back to Dashboard" />
        
        <div className="page-header">
          <h1>Upload Photos</h1>
          <p className="page-subtitle">
            Add new memories to the family collection
          </p>
        </div>

        <form onSubmit={handleSubmit} className="upload-photos-form" aria-label="Upload photos form">
          <div className="upload-layout">
            {/* Left Column: Upload Area */}
            <div className="upload-area" aria-labelledby="photos-section-title">
              <h2 id="photos-section-title" className="section-title">Photos</h2>
              <PhotoDropzone
                onFilesSelected={handleFilesSelected}
                maxFiles={10}
                maxSizeMB={10}
                acceptedFormats={['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml']}
                error={dropzoneError}
              />
              <PhotoPreviewGrid
                files={formData.selectedFiles}
                previews={formData.previews}
                onClearAll={handleClearAll}
                onRemove={handleRemovePhoto}
              />
            </div>

            {/* Right Column: Details Panel */}
            <div className="details-panel" aria-labelledby="memory-details-section-title">
              <h2 id="memory-details-section-title" className="section-title">Memory Details</h2>
              
              <Select
                label="Select Album"
                value={formData.album}
                onChange={(value) => handleInputChange('album', value)}
                options={albums.map(album => ({
                  value: album.id,
                  label: album.name,
                }))}
                placeholder="Choose an album..."
              />

              <Input
                label="Location"
                placeholder="Grandma's House, Mexico"
                value={formData.location}
                onChange={(value) => handleInputChange('location', value)}
              />

              <DateInput
                label="Date Taken"
                placeholder="DD / MM / YYYY"
                value={formData.dateTaken}
                onChange={(value) => handleInputChange('dateTaken', value)}
              />

              <div className="tag-search-section">
                <label className="input-label">Tagged People</label>
                <TagSearch
                  onSearch={handleTagSearch}
                  results={searchResults}
                  onSelect={handleTagSelect}
                  selectedTags={selectedTags}
                  placeholder="Search family members..."
                />
              </div>

              <div className="textarea-wrapper">
                <label htmlFor="description" className="textarea-label">
                  Description
                </label>
                <textarea
                  id="description"
                  className={`textarea-field ${errors.description ? 'textarea-error' : ''}`}
                  placeholder="Share the story behind these photos..."
                  value={formData.description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  aria-describedby="description-char-count"
                />
                <div 
                  id="description-char-count" 
                  className={`textarea-char-count ${formData.description.length > 500 ? 'over-limit' : ''}`}
                >
                  {formData.description.length} / 500 characters
                </div>
                {errors.description && (
                  <span className="textarea-error-message" role="alert">
                    {errors.description}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {isSubmitting && uploadProgress > 0 && (
            <div className="upload-progress" role="status" aria-live="polite" aria-label={`Upload progress: ${uploadProgress}%`}>
              <div className="upload-progress-bar" role="progressbar" aria-valuenow={uploadProgress} aria-valuemin="0" aria-valuemax="100">
                <div 
                  className="upload-progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="upload-progress-text">
                Uploading... {uploadProgress}%
              </div>
            </div>
          )}

          {/* Form Actions */}
          {errors.submit && (
            <div className="form-error" role="alert" aria-live="assertive">
              {errors.submit}
            </div>
          )}

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
              aria-label="Cancel photo upload"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || isLoading || formData.selectedFiles.length === 0}
              aria-label={isSubmitting ? `Uploading photos, ${uploadProgress}% complete` : 'Post memories'}
            >
              {isSubmitting ? `Uploading... ${uploadProgress}%` : 'Post Memories'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPhotosPage;
