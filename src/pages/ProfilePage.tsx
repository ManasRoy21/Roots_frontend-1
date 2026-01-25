import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { getFamilyMembers } from '../redux/slices/familySlice';
import Button from '../components/Button';
import './ProfilePage.scss';

interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  relationshipType: 'spouse' | 'son' | 'daughter' | 'grandson' | 'granddaughter';
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { familyMembers } = useSelector((state: RootState) => state.family);

  const [immediateFamily, setImmediateFamily] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      dispatch(getFamilyMembers());
      // Simulate loading for smooth animation
      setTimeout(() => setIsLoading(false), 800);
    }
  }, [dispatch, user]);

  useEffect(() => {
    // Filter immediate family members (spouse, children, grandchildren)
    const immediate = familyMembers.filter(member => 
      ['spouse', 'son', 'daughter', 'grandson', 'granddaughter'].includes(member.relationshipType || '')
    ).slice(0, 3); // Show only first 3 for the layout
    
    setImmediateFamily(immediate as FamilyMember[]);
  }, [familyMembers]);

  const handleBackToFamilyTree = () => {
    navigate('/family-tree');
  };

  const handleEditProfile = () => {
    navigate('/profile-setup');
  };

  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: `${user?.firstName} ${user?.lastName}'s Profile`,
        text: 'Check out this family profile',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  const handleMessage = () => {
    // Navigate to messaging or open message modal
    console.log('Message functionality to be implemented');
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getRelationshipLabel = (type: string): string => {
    const labels: { [key: string]: string } = {
      'spouse': 'Spouse',
      'son': 'Son',
      'daughter': 'Daughter',
      'grandson': 'Grandson',
      'granddaughter': 'Granddaughter'
    };
    return labels[type] || type;
  };

  if (!user) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Floating Header */}
      <div className="profile-header">
        <button className="back-button" onClick={handleBackToFamilyTree}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m7-7l-7 7 7 7"/>
          </svg>
          <span>Back to Family Tree</span>
        </button>
      </div>

      {/* Compact Profile Hero Section */}
      <div className="profile-hero">
        <div className="profile-background">
          <div className="background-overlay"></div>
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=300&fit=crop&crop=center" 
            alt="Profile background" 
            className="background-image"
          />
        </div>
        
        <div className="profile-content">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              <img 
                src={user.photoUrl || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&size=100&background=0d7377&color=fff&bold=true`}
                alt={`${user.firstName} ${user.lastName}`}
                className="avatar-image"
              />
              <div className="avatar-status"></div>
            </div>
          </div>
          
          <div className="profile-info">
            <h1 className="profile-name">
              <span className="first-name">{user.firstName}</span>
              <span className="last-name">{user.lastName}</span>
            </h1>
            <div className="profile-badges">
              <span className="profile-badge primary">GRANDFATHER</span>
              <span className="profile-badge secondary">HISTORIAN</span>
            </div>
            <div className="profile-meta">
              <div className="meta-item location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>{user.placeOfBirth || 'Havana, Cuba'}</span>
              </div>
              <div className="meta-item birth">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>Born {user.dateOfBirth ? formatDate(user.dateOfBirth).split(',')[1] : '1934'}</span>
              </div>
              <div className="meta-item profession">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                <span>Writer & Poet</span>
              </div>
            </div>
          </div>
          
          <div className="profile-actions">
            <Button variant="outline" size="small" onClick={handleShare} className="action-btn share-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
              </svg>
              <span>Share</span>
            </Button>
            
            <Button variant="outline" size="small" onClick={handleMessage} className="action-btn message-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              <span>Message</span>
            </Button>
            
            <Button variant="primary" size="small" onClick={handleEditProfile} className="action-btn edit-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              <span>Edit</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="profile-main">
        <div className="profile-container">
          <div className="profile-grid">
            {/* Enhanced Personal Details */}
            <div className="profile-section personal-details">
              <div className="section-header">
                <div className="section-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <h2 className="section-title">Personal Details</h2>
              </div>
              
              <div className="details-grid">
                <div className="detail-card">
                  <div className="detail-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div className="detail-content">
                    <label className="detail-label">Full Name</label>
                    <p className="detail-value">{user.firstName} {user.lastName}</p>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <div className="detail-content">
                    <label className="detail-label">Age</label>
                    <p className="detail-value">
                      {user.dateOfBirth ? `${calculateAge(user.dateOfBirth)} years` : '89 years'}
                    </p>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div className="detail-content">
                    <label className="detail-label">Location</label>
                    <p className="detail-value">{user.placeOfBirth || 'Havana, Cuba'}</p>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                  </div>
                  <div className="detail-content">
                    <label className="detail-label">Occupation</label>
                    <p className="detail-value">Retired Journalist</p>
                  </div>
                </div>
              </div>
              
              <div className="interests-section">
                <h3 className="interests-title">Interests</h3>
                <div className="interests-tags">
                  <span className="interest-tag poetry">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                    Poetry
                  </span>
                  <span className="interest-tag baseball">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                    Baseball
                  </span>
                  <span className="interest-tag jazz">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                    </svg>
                    Jazz
                  </span>
                  <span className="interest-tag history">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                    History
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Immediate Family */}
            <div className="profile-section immediate-family">
              <div className="section-header">
                <div className="section-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
                <h2 className="section-title">Immediate Family</h2>
                <button className="view-all-btn">
                  <span>View All</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
              
              <div className="family-grid">
                {/* Compact family members */}
                <div className="family-member featured">
                  <div className="member-avatar">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face" 
                      alt="Elena"
                    />
                    <div className="member-status spouse"></div>
                  </div>
                  <div className="member-info">
                    <h3 className="member-name">Elena Rivera</h3>
                    <p className="member-relation">Spouse</p>
                    <p className="member-years">Since 1956</p>
                  </div>
                  <div className="member-actions">
                    <button className="member-action-btn">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="family-member">
                  <div className="member-avatar">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face" 
                      alt="Javier"
                    />
                    <div className="member-status son"></div>
                  </div>
                  <div className="member-info">
                    <h3 className="member-name">Javier Rivera</h3>
                    <p className="member-relation">Son</p>
                    <p className="member-years">Born 1960</p>
                  </div>
                  <div className="member-actions">
                    <button className="member-action-btn">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="family-member">
                  <div className="member-avatar">
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face" 
                      alt="Alex"
                    />
                    <div className="member-status grandson"></div>
                  </div>
                  <div className="member-info">
                    <h3 className="member-name">Alex Rivera</h3>
                    <p className="member-relation">Grandson</p>
                    <p className="member-years">Born 1985</p>
                  </div>
                  <div className="member-actions">
                    <button className="member-action-btn">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                {immediateFamily.slice(0, 2).map((member) => (
                  <div key={member.id} className="family-member">
                    <div className="member-avatar">
                      <img 
                        src={member.photoUrl || `https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}&size=60&background=0d7377&color=fff`}
                        alt={`${member.firstName} ${member.lastName}`}
                      />
                      <div className={`member-status ${member.relationshipType}`}></div>
                    </div>
                    <div className="member-info">
                      <h3 className="member-name">{member.firstName} {member.lastName}</h3>
                      <p className="member-relation">{getRelationshipLabel(member.relationshipType)}</p>
                    </div>
                    <div className="member-actions">
                      <button className="member-action-btn">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="family-stats">
                <div className="stat-item">
                  <span className="stat-number">12</span>
                  <span className="stat-label">Members</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">3</span>
                  <span className="stat-label">Generations</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">8</span>
                  <span className="stat-label">Countries</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;