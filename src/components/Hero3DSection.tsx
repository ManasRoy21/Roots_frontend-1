/**
 * Hero3DSection Component
 * Main hero area matching the FamilyHub design with floating card preview
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import './Hero3DSection.scss';

interface Hero3DSectionProps {
  className?: string;
}

export function Hero3DSection({ className = '' }: Hero3DSectionProps) {
  const navigate = useNavigate();

  return (
    <section className={`hero-section-main ${className}`}>
      {/* Background gradient */}
      <div className="hero-bg-glow"></div>
      
      <div className="hero-main-container">
        {/* Left Side - Text Content */}
        <div className="hero-left-content">
          <div className="hero-version-badge">
            v4.0 · Reimagined for modern families
          </div>
          
          <h1 className="hero-main-title">
            The modern way to preserve your history.
          </h1>
          
          <p className="hero-main-description">
            FamilyHub turns scattered photos, stories, and DNA results into one living, interactive family hub—beautiful, private, and built for generations.
          </p>
          
          <div className="hero-action-buttons">
            <Button 
              variant="primary" 
              size="large" 
              onClick={() => navigate('/signup')}
              className="hero-primary-btn"
            >
              Start Your Free Tree
            </Button>
            <Button 
              variant="outline" 
              size="large"
              className="hero-outline-btn"
            >
              Watch Demo
            </Button>
          </div>
          
          <div className="hero-trust-line">
            <span className="hero-trust-dot"></span>
            <span>No credit card · Invite your whole family in minutes</span>
          </div>
        </div>

        {/* Right Side - Visual Card */}
        <div className="hero-right-visual">
          {/* Sparkle decoration - top center */}
          <div className="hero-sparkle-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#0d9488"/>
            </svg>
          </div>

          {/* Floating heart icon - top left */}
          <div className="hero-floating-icon-left">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ec4899"/>
            </svg>
          </div>

          {/* Main Card */}
          <div className="hero-preview-card">
            <div className="preview-card-header">
              THE RIVERA LEGACY
            </div>
            
            <div className="preview-card-tree">
              <div className="tree-photo-top">
                <img 
                  src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face" 
                  alt="Family member"
                />
              </div>
              <div className="tree-connector-line"></div>
              <div className="tree-photo-bottom">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" 
                  alt="Family member"
                />
              </div>
            </div>

            <div className="preview-card-info">
              <h3>Connected History</h3>
              <p>Tracing roots back to 1924</p>
            </div>

            <div className="preview-card-progress">
              <span className="progress-label">Tree Growth</span>
              <div className="progress-bar-track">
                <div className="progress-bar-fill"></div>
              </div>
              <span className="progress-value">+24%</span>
            </div>
          </div>

          {/* New Match Notification */}
          <div className="hero-notif hero-notif-match">
            <div className="notif-avatar">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face" 
                alt="New match"
              />
            </div>
            <div className="notif-text">
              <span className="notif-title">New Match</span>
              <span className="notif-subtitle">2nd Cousin</span>
            </div>
          </div>

          {/* Audio Story Notification */}
          <div className="hero-notif hero-notif-audio">
            <div className="notif-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z" fill="#6b7280"/>
                <path d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" fill="#6b7280"/>
              </svg>
            </div>
            <span className="notif-label">Audio Story Added</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero3DSection;