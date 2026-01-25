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

  useEffect(() => {
    if (user) {
      dispatch(getFamilyMembers());
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
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <button className="back-button" onClick={handleBackToFamilyTree}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m7-7l-7 7 7 7"/>
          </svg>
          Back to Family Tree
        </button>
      </div>

      {/* Profile Hero Section */}
      <div className="profile-hero">
        <div className="profile-background">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop" 
            alt="Profile background" 
            className="background-image"
          />
        </div>
        
        <div className="profile-content">
          <div className="profile-avatar">
            <img 
              src={user.photoUrl || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&size=120&background=0d7377&color=fff`}
              alt={`${user.firstName} ${user.lastName}`}
              className="avatar-image"
            />
          </div>
          
          <div className="profile-info">
            <div className="name-section">
              <h1 className="profile-name">{user.firstName} {user.lastName}</h1>
              <span className="profile-badge">GRANDFATHER</span>
            </div>
            
            <div className="profile-meta">
              <div className="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>{user.placeOfBirth || 'Havana, Cuba'}</span>
              </div>
              
              <div className="meta-item">
                <span>Born</span>
                <span>{user.dateOfBirth ? formatDate(user.dateOfBirth).split(',')[1] : '1934'}</span>
              </div>
              
              <div className="meta-item">
                <span>Writer &</span>
                <span>Poet</span>
              </div>
            </div>
          </div>
          
          <div className="profile-actions">
            <Button variant="outline" size="small" onClick={handleShare}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
              </svg>
              Share
            </Button>
            
            <Button variant="outline" size="small" onClick={handleMessage}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              Message
            </Button>
            
            <Button variant="primary" size="small" onClick={handleEditProfile}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-main">
        <div className="profile-grid">
          {/* Personal Details */}
          <div className="profile-section personal-details">
            <h2 className="section-title">Personal Details</h2>
            
            <div className="detail-group">
              <label className="detail-label">Full Name</label>
              <p className="detail-value">{user.firstName} {user.lastName}</p>
            </div>
            
            <div className="detail-group">
              <label className="detail-label">Date of Birth</label>
              <p className="detail-value">
                {user.dateOfBirth ? 
                  `${formatDate(user.dateOfBirth)} (${calculateAge(user.dateOfBirth)} years)` : 
                  'September 14, 1934 (89 years)'
                }
              </p>
            </div>
            
            <div className="detail-group">
              <label className="detail-label">Place of Birth</label>
              <p className="detail-value">{user.placeOfBirth || 'Havana, Cuba'}</p>
            </div>
            
            <div className="detail-group">
              <label className="detail-label">Occupation</label>
              <p className="detail-value">Retired Journalist</p>
            </div>
            
            <div className="detail-group">
              <label className="detail-label">Interests</label>
              <div className="interests-tags">
                <span className="interest-tag">Poetry</span>
                <span className="interest-tag">Baseball</span>
                <span className="interest-tag">Jazz</span>
                <span className="interest-tag">History</span>
              </div>
            </div>
          </div>

          {/* Immediate Family */}
          <div className="profile-section immediate-family">
            <div className="section-header">
              <h2 className="section-title">Immediate Family</h2>
              <button className="view-all-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </button>
            </div>
            
            <div className="family-grid">
              {/* Mock family members - replace with actual data */}
              <div className="family-member">
                <div className="member-avatar">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face" 
                    alt="Elena"
                  />
                </div>
                <div className="member-info">
                  <h3 className="member-name">Elena</h3>
                  <p className="member-relation">Spouse</p>
                </div>
              </div>
              
              <div className="family-member">
                <div className="member-avatar">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" 
                    alt="Javier"
                  />
                </div>
                <div className="member-info">
                  <h3 className="member-name">Javier</h3>
                  <p className="member-relation">Son</p>
                </div>
              </div>
              
              <div className="family-member">
                <div className="member-avatar">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" 
                    alt="Alex"
                  />
                </div>
                <div className="member-info">
                  <h3 className="member-name">Alex</h3>
                  <p className="member-relation">Grandson</p>
                </div>
              </div>
              
              {immediateFamily.map((member) => (
                <div key={member.id} className="family-member">
                  <div className="member-avatar">
                    <img 
                      src={member.photoUrl || `https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}&size=80&background=0d7377&color=fff`}
                      alt={`${member.firstName} ${member.lastName}`}
                    />
                  </div>
                  <div className="member-info">
                    <h3 className="member-name">{member.firstName}</h3>
                    <p className="member-relation">{getRelationshipLabel(member.relationshipType)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;