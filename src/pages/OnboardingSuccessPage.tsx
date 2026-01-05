import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProfile } from '../redux/slices/userSlice';
import { useAppSelector } from '../redux/store';
import './OnboardingSuccessPage.scss';

const OnboardingSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const profile = useAppSelector(selectProfile);

  // Get user's first name from profile, fallback to generic greeting
  const firstName = profile?.firstName || 'there';
  const photoUrl = profile?.photoUrl;

  const handleStartNewTree = () => {
    navigate('/create-tree');
  };

  const handleJoinTree = () => {
    navigate('/join-tree');
  };

  const handleSkipToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="onboarding-success-page">
      <div className="onboarding-success-container">
        {/* Logo */}
        <div className="onboarding-success-logo">
          <div className="logo-icon">FH</div>
          <span className="logo-text">Family Hub</span>
        </div>

        {/* Profile Photo */}
        {photoUrl && (
          <div className="onboarding-success-photo">
            <img src={photoUrl} alt={`${firstName}'s profile`} />
          </div>
        )}

        {/* Heading */}
        <h1 className="onboarding-success-heading">You're all set, {firstName}!</h1>
        <p className="onboarding-success-subheading">
          Your profile has been created. Now, let's get you connected to your family history.
        </p>

        {/* Options */}
        <div className="onboarding-success-options">
          <div className="option-card" onClick={handleStartNewTree}>
            <div className="option-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <h3 className="option-title">Start a New Tree</h3>
            <p className="option-description">
              I'm the first one here. I'll add my parents and start building.
            </p>
          </div>

          <div className="option-card" onClick={handleJoinTree}>
            <div className="option-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="option-title">Join Existing Tree</h3>
            <p className="option-description">
              My family is already on Family Hub. I have an invite code.
            </p>
          </div>
        </div>

        {/* Skip Link */}
        <button className="onboarding-success-skip" onClick={handleSkipToDashboard}>
          Skip for now, take me to Dashboard
        </button>
      </div>
    </div>
  );
};

export default OnboardingSuccessPage;
