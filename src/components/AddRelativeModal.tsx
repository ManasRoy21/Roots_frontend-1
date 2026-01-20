import React, { useState, useEffect } from 'react';
import { AddRelativeModalProps, AddRelativeSubmissionData } from '../types/components';
import './AddRelativeModal.scss';

// Form data interface for the modal
interface AddRelativeFormData {
  relationship: 'parent' | 'spouse' | 'child' | 'sibling';
  firstName: string;
  lastName: string;
  birthYear: string;
  status: 'living' | 'deceased';
  tag: string;
  photo: File | null;
}

const AddRelativeModal: React.FC<AddRelativeModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  relationshipType = null,
  relatedToMember = null,
}) => {
  const userName = relatedToMember 
    ? `${relatedToMember.firstName || ''} ${relatedToMember.lastName || ''}`.trim() || 'User'
    : 'User';

  const [formData, setFormData] = useState<AddRelativeFormData>({
    relationship: relationshipType || 'parent',
    firstName: '',
    lastName: '',
    birthYear: '',
    status: 'living',
    tag: '',
    photo: null,
  });

  // Update relationship when prop changes
  useEffect(() => {
    if (relationshipType) {
      setFormData(prev => ({ ...prev, relationship: relationshipType }));
    }
  }, [relationshipType]);

  if (!isOpen) return null;

  const handleRelationshipChange = (relationship: AddRelativeFormData['relationship']): void => {
    setFormData({ ...formData, relationship });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatusChange = (status: AddRelativeFormData['status']): void => {
    setFormData({ ...formData, status });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
    }
  };

  const handleSubmit = (): void => {
    // Handle form submission
    if (onSubmit) {
      onSubmit({
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.birthYear ? `${formData.birthYear}-01-01` : null,
        status: formData.status,
        specificLabel: formData.tag || null,
        photoUrl: formData.photo ? URL.createObjectURL(formData.photo) : null,
      });
    } else {
      onClose();
    }
  };

  const handleCancel = (): void => {
    setFormData({
      relationship: 'parent',
      firstName: '',
      lastName: '',
      birthYear: '',
      status: 'living',
      tag: '',
      photo: null,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Add Relative</h2>
            <p className="modal-subtitle">Adding a new connection for {userName}</p>
          </div>
          <button className="modal-close" onClick={handleCancel} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Relationship Selection */}
          <div className="form-group">
            <label className="form-label">Relationship to {userName.split(' ')[0]}</label>
            <div className="relationship-buttons">
              <button
                type="button"
                className={`relationship-btn ${formData.relationship === 'parent' ? 'active' : ''}`}
                onClick={() => handleRelationshipChange('parent')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>Parent</span>
              </button>
              <button
                type="button"
                className={`relationship-btn ${formData.relationship === 'spouse' ? 'active' : ''}`}
                onClick={() => handleRelationshipChange('spouse')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Spouse</span>
              </button>
              <button
                type="button"
                className={`relationship-btn ${formData.relationship === 'child' ? 'active' : ''}`}
                onClick={() => handleRelationshipChange('child')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span>Child</span>
              </button>
              <button
                type="button"
                className={`relationship-btn ${formData.relationship === 'sibling' ? 'active' : ''}`}
                onClick={() => handleRelationshipChange('sibling')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span>Sibling</span>
              </button>
            </div>
          </div>

          {/* Name Fields */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="form-input"
                placeholder="e.g. Maria"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-input"
                placeholder="Rivera"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Birth Year and Status */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="birthYear">Birth Year (Approx.)</label>
              <input
                type="text"
                id="birthYear"
                name="birthYear"
                className="form-input"
                placeholder="YYYY"
                value={formData.birthYear}
                onChange={handleInputChange}
                maxLength="4"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <div className="status-buttons">
                <button
                  type="button"
                  className={`status-btn ${formData.status === 'living' ? 'active' : ''}`}
                  onClick={() => handleStatusChange('living')}
                >
                  Living
                </button>
                <button
                  type="button"
                  className={`status-btn ${formData.status === 'deceased' ? 'active' : ''}`}
                  onClick={() => handleStatusChange('deceased')}
                >
                  Deceased
                </button>
              </div>
            </div>
          </div>

          {/* Tag/Label */}
          <div className="form-group">
            <label className="form-label" htmlFor="tag">Tag / Label (Optional)</label>
            <input
              type="text"
              id="tag"
              name="tag"
              className="form-input"
              placeholder="e.g. Grandmother, Uncle, Cousin"
              value={formData.tag}
              onChange={handleInputChange}
            />
          </div>

          {/* Photo Upload */}
          <div className="form-group">
            <label className="form-label">Profile Photo (Optional)</label>
            <label htmlFor="photo-upload" className="photo-upload-area">
              <input
                type="file"
                id="photo-upload"
                accept="image/jpeg,image/png"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15l-5-5L5 21"/>
              </svg>
              <div>
                <p className="upload-text">Click to upload photo</p>
                <p className="upload-subtext">JPG, PNG up to 5MB</p>
              </div>
            </label>
            {formData.photo && (
              <p className="file-name">{formData.photo.name}</p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button type="button" className="btn-submit" onClick={handleSubmit}>
            Add Relative
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRelativeModal;
