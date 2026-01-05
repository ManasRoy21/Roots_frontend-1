import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, signOut as signOutAction } from '../redux/slices/authSlice';
import { selectProfile } from '../redux/slices/userSlice';
import RootsLogo from './RootsLogo';
import './NavigationBar.scss';
import { AppDispatch } from '../redux/store';

interface NavLink {
  path: string;
  label: string;
}

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const profile = useSelector(selectProfile);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  const navLinks: NavLink[] = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/family-tree', label: 'Family Tree' },
    { path: '/memories', label: 'Memories' },
    { path: '/messages', label: 'Messages' },
    { path: '/events', label: 'Events' },
  ];

  const isActive = (path: string): boolean => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await dispatch(signOutAction()).unwrap();
      navigate('/signin');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Get user's first name from profile or auth user
  const firstName = profile?.firstName || user?.fullName?.split(' ')[0] || 'User';
  const photoUrl = profile?.photoUrl || user?.photoUrl;

  return (
    <nav className="navigation-bar" role="navigation" aria-label="Main navigation">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo" onClick={() => navigate('/dashboard')}>
          <RootsLogo width={100} height={100} />
        </div>

        {/* Desktop Navigation Links */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <button
              key={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => navigate(link.path)}
              aria-current={isActive(link.path) ? 'page' : undefined}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* User Profile Section */}
        <div className="nav-user">
          <button
            className="nav-user-button"
            onClick={toggleDropdown}
            aria-label="User menu"
            aria-expanded={showDropdown}
            aria-haspopup="true"
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={`${firstName}'s profile`}
                className="nav-user-photo"
              />
            ) : (
              <div className="nav-user-avatar" aria-label={`${firstName}'s profile`}>
                {firstName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="nav-user-name">{firstName}</span>
            <svg
              className={`nav-dropdown-icon ${showDropdown ? 'open' : ''}`}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="nav-dropdown" role="menu">
              <button
                className="nav-dropdown-item"
                onClick={() => {
                  navigate('/profile');
                  setShowDropdown(false);
                }}
                role="menuitem"
              >
                Profile Settings
              </button>
              <button
                className="nav-dropdown-item"
                onClick={() => {
                  navigate('/account');
                  setShowDropdown(false);
                }}
                role="menuitem"
              >
                Account Settings
              </button>
              <div className="nav-dropdown-divider" role="separator" />
              <button
                className="nav-dropdown-item"
                onClick={handleSignOut}
                role="menuitem"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="nav-mobile-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={showMobileMenu}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {showMobileMenu ? (
              <path
                d="M6 18L18 6M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M3 12H21M3 6H21M3 18H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="nav-mobile-menu">
          {navLinks.map((link) => (
            <button
              key={link.path}
              className={`nav-mobile-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => {
                navigate(link.path);
                setShowMobileMenu(false);
              }}
              aria-current={isActive(link.path) ? 'page' : undefined}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;