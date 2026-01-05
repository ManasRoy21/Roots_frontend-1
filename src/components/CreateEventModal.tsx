import React, { useState } from 'react';
import InviteExternalGuestsModal from './InviteExternalGuestsModal';
import { CreateEventModalProps } from '../types/components';
import './CreateEventModal.scss';

// Form data interface for the modal
interface CreateEventFormData {
  eventName: string;
  category: 'celebration' | 'reunion' | 'dinner' | 'trip' | 'memorial';
  date: string;
  time: string;
  location: string;
  guestType: 'all' | 'specific';
  selectedGuests: string[];
}

// Category option interface
interface CategoryOption {
  id: CreateEventFormData['category'];
  label: string;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<CreateEventFormData>({
    eventName: '',
    category: 'celebration',
    date: '',
    time: '',
    location: '',
    guestType: 'specific',
    selectedGuests: [],
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExternalGuestsModalOpen, setIsExternalGuestsModalOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  const categories: CategoryOption[] = [
    { id: 'celebration', label: 'Celebration' },
    { id: 'reunion', label: 'Reunion' },
    { id: 'dinner', label: 'Dinner' },
    { id: 'trip', label: 'Trip' },
    { id: 'memorial', label: 'Memorial' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (categoryId: CreateEventFormData['category']): void => {
    setFormData({ ...formData, category: categoryId });
  };

  const handleGuestTypeChange = (type: CreateEventFormData['guestType']): void => {
    setFormData({ ...formData, guestType: type });
  };

  const handleSubmit = (): void => {
    console.log('Event data:', formData);
    onClose();
  };

  const handleCancel = (): void => {
    setFormData({
      eventName: '',
      category: 'celebration',
      date: '',
      time: '',
      location: '',
      guestType: 'specific',
      selectedGuests: [],
    });
    setSearchQuery('');
    onClose();
  };

  return (
    <>
      <InviteExternalGuestsModal 
        isOpen={isExternalGuestsModalOpen}
        onClose={() => setIsExternalGuestsModalOpen(false)}
      />
      <div className="create-event-overlay" onClick={handleCancel}>
        <div className="create-event-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-event-header">
          <div>
            <h2 className="create-event-title">Create Event</h2>
            <p className="create-event-subtitle">Plan a gathering for the family tree</p>
          </div>
          <button className="create-event-close" onClick={handleCancel} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="create-event-body">
          {/* Event Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="eventName">Event Name</label>
            <input
              type="text"
              id="eventName"
              name="eventName"
              className="form-input"
              placeholder="e.g. Grandma's 80th Birthday"
              value={formData.eventName}
              onChange={handleInputChange}
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <div className="category-buttons">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={`category-btn ${formData.category === category.id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date and Time */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="date">Date</label>
              <div className="input-with-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-input"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="time">Time</label>
              <div className="input-with-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/>
                </svg>
                <input
                  type="time"
                  id="time"
                  name="time"
                  className="form-input"
                  value={formData.time}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label" htmlFor="location">Location</label>
            <div className="input-with-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <input
                type="text"
                id="location"
                name="location"
                className="form-input"
                placeholder="Add a location or link"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Guests */}
          <div className="form-group">
            <label className="form-label">Guests</label>
            
            {/* All Family Members Option */}
            <div 
              className={`guest-option ${formData.guestType === 'all' ? 'active' : ''}`}
              onClick={() => handleGuestTypeChange('all')}
            >
              <div className="guest-option-radio">
                <div className={`radio-circle ${formData.guestType === 'all' ? 'checked' : ''}`}>
                  {formData.guestType === 'all' && <div className="radio-dot" />}
                </div>
              </div>
              <div className="guest-option-content">
                <div className="guest-option-title">All Family Members</div>
                <div className="guest-option-subtitle">Invite everyone in this tree (24 people)</div>
              </div>
            </div>

            {/* Specific People Option */}
            <div 
              className={`guest-option ${formData.guestType === 'specific' ? 'active' : ''}`}
              onClick={() => handleGuestTypeChange('specific')}
            >
              <div className="guest-option-radio">
                <div className={`radio-circle ${formData.guestType === 'specific' ? 'checked' : ''}`}>
                  {formData.guestType === 'specific' && <div className="radio-dot" />}
                </div>
              </div>
              <div className="guest-option-content">
                <div className="guest-option-title">Specific People</div>
                <div className="guest-option-subtitle">Choose who to invite</div>
              </div>
            </div>

            {/* Search Box (shown when Specific People is selected) */}
            {formData.guestType === 'specific' && (
              <div className="guest-search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  className="guest-search-input"
                  placeholder="Search relatives to invite..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}

            {/* Invite from other trees link */}
            <button 
              className="invite-other-trees"
              onClick={() => setIsExternalGuestsModalOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              Invite from other trees
            </button>
          </div>
        </div>

        <div className="create-event-footer">
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button type="button" className="btn-create" onClick={handleSubmit}>
            Create Event
          </button>
        </div>
      </div>
      </div>
    </>
  );
};

export default CreateEventModal;
