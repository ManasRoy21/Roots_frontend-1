import React, { useState, useEffect } from 'react';
import { AddRelativeModalProps, AddRelativeSubmissionData } from '../types/components';
import FamilyService from '../services/FamilyService';
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

// Mock existing user interface
interface ExistingUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string;
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

  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ExistingUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ExistingUser | null>(null);
  const [existingFriends, setExistingFriends] = useState<ExistingUser[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [friendsError, setFriendsError] = useState<string | null>(null);

  const [formData, setFormData] = useState<AddRelativeFormData>({
    relationship: relationshipType || 'parent',
    firstName: '',
    lastName: '',
    birthYear: '',
    status: 'living',
    tag: '',
    photo: null,
  });

  // Fetch existing friends when modal opens and mode is 'existing'
  useEffect(() => {
    const fetchExistingFriends = async () => {
      if (isOpen && mode === 'existing' && existingFriends.length === 0) {
        setLoadingFriends(true);
        setFriendsError(null);
        try {
          const friends = await FamilyService.getExistingFriends();
          setExistingFriends(friends);
        } catch (error: any) {
          console.error('Failed to fetch existing friends:', error);
          setFriendsError(error.message || 'Failed to load existing users');
        } finally {
          setLoadingFriends(false);
        }
      }
    };

    fetchExistingFriends();
  }, [isOpen, mode, existingFriends.length]);

  // Update relationship when prop changes
  useEffect(() => {
    if (relationshipType) {
      setFormData(prev => ({ ...prev, relationship: relationshipType }));
    }
  }, [relationshipType]);

  // Search existing users
  useEffect(() => {
    if (mode === 'existing' && searchQuery.trim().length > 0) {
      const filtered = existingFriends.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, mode, existingFriends]);

  if (!isOpen) return null;

  const handleModeToggle = (newMode: 'new' | 'existing'): void => {
    setMode(newMode);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedUser(null);
  };

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
    setSelectedUser(null);
  };

  const handleUserSelect = (user: ExistingUser): void => {
    setSelectedUser(user);
  };

  const handleSubmit = (): void => {
    if (mode === 'existing' && selectedUser) {
      // Handle adding existing user
      console.log('Adding existing user:', selectedUser, 'with relationship:', formData.relationship);
      // TODO: Implement API call to add existing user as relative
      onClose();
    } else if (mode === 'new') {
      // Handle form submission for new member
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
    setMode('new');
    setSearchQuery('');
    setSearchResults([]);
    setSelectedUser(null);
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
          {/* Mode Toggle */}
          <div className="mode-toggle-container">
            <button
              type="button"
              className={`mode-toggle-btn ${mode === 'new' ? 'active' : ''}`}
              onClick={() => handleModeToggle('new')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4.16666V15.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.16666 10H15.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Add New Member
            </button>
            <button
              type="button"
              className={`mode-toggle-btn ${mode === 'existing' ? 'active' : ''}`}
              onClick={() => handleModeToggle('existing')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Find Existing User
            </button>
          </div>

          {/* Relationship Selection - Common for both modes */}
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

          {/* Conditional Content Based on Mode */}
          {mode === 'existing' ? (
            <>
              {/* Search Bar */}
              <div className="form-group">
                <label className="form-label" htmlFor="userSearch">Search for existing user</label>
                <div className="search-input-wrapper">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="search-icon">
                    <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    type="text"
                    id="userSearch"
                    className="form-input search-input"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    disabled={loadingFriends}
                  />
                </div>
                {friendsError && (
                  <p className="error-message">{friendsError}</p>
                )}
              </div>

              {/* Loading State */}
              {loadingFriends && (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading existing users...</p>
                </div>
              )}

              {/* Search Results */}
              {!loadingFriends && searchQuery && (
                <div className="search-results">
                  {searchResults.length > 0 ? (
                    searchResults.map(user => (
                      <div
                        key={user.id}
                        className={`user-result-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
                        onClick={() => handleUserSelect(user)}
                      >
                        <div className="user-avatar">
                          {user.photoUrl ? (
                            <img src={user.photoUrl} alt={`${user.firstName} ${user.lastName}`} />
                          ) : (
                            <div className="avatar-placeholder">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="user-info">
                          <div className="user-name">{user.firstName} {user.lastName}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                        {selectedUser?.id === user.id && (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="check-icon">
                            <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-results">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                        <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <p>No users found</p>
                      <span>Try searching with a different name or email</span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
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
                    maxLength={4}
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
            </>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button 
            type="button" 
            className="btn-submit" 
            onClick={handleSubmit}
            disabled={mode === 'existing' && !selectedUser}
          >
            {mode === 'existing' ? 'Add User' : 'Add Relative'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRelativeModal;
