import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import RootsLogo from '../components/RootsLogo';
import './LandingPage.scss';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State for invitation customization
  const [selectedLayout, setSelectedLayout] = React.useState('classic');
  const [selectedFont, setSelectedFont] = React.useState('serif');
  const [selectedColor, setSelectedColor] = React.useState('#7FB069');
  const [isAutoCycling, setIsAutoCycling] = React.useState<'layout' | 'font' | 'color' | null>(null);

  // Font families
  const fontFamilies = {
    serif: "'Georgia', 'Times New Roman', serif",
    sans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    script: "'Dancing Script', cursive"
  };

  // Auto-cycle effect
  React.useEffect(() => {
    if (!isAutoCycling) return;

    const interval = setInterval(() => {
      if (isAutoCycling === 'layout') {
        const layouts = ['classic', 'modern', 'minimal'];
        const currentIndex = layouts.indexOf(selectedLayout);
        const nextIndex = (currentIndex + 1) % layouts.length;
        setSelectedLayout(layouts[nextIndex]);
      } else if (isAutoCycling === 'font') {
        const fonts = ['serif', 'sans', 'script'];
        const currentIndex = fonts.indexOf(selectedFont);
        const nextIndex = (currentIndex + 1) % fonts.length;
        setSelectedFont(fonts[nextIndex]);
      } else if (isAutoCycling === 'color') {
        const colors = ['#7FB069', '#C7E9B4', '#2F5233'];
        const currentIndex = colors.indexOf(selectedColor);
        const nextIndex = (currentIndex + 1) % colors.length;
        setSelectedColor(colors[nextIndex]);
      }
    }, 1500); // Change every 1.5 seconds

    return () => clearInterval(interval);
  }, [isAutoCycling, selectedLayout, selectedFont, selectedColor]);

  // Toggle auto-cycling
  const toggleLayoutCycle = () => {
    setIsAutoCycling(isAutoCycling === 'layout' ? null : 'layout');
  };

  const toggleFontCycle = () => {
    setIsAutoCycling(isAutoCycling === 'font' ? null : 'font');
  };

  const toggleColorCycle = () => {
    setIsAutoCycling(isAutoCycling === 'color' ? null : 'color');
  };

  return (
    <div className="landing-page">
          {/* Navigation Header */}
          <header className="landing-header">
            <div className="landing-container">
              <div className="landing-nav">
                <div className="landing-logo">
                  <RootsLogo />
                </div>
                <nav className="landing-nav-links">
                  <a href="#tree">Tree</a>
                  <a href="#events">Events</a>
                  <a href="#messages">Messages</a>
                  <a href="#photos">Photos</a>
                </nav>
                <div className="landing-nav-actions">
                  <Button variant="outline" size="small" onClick={() => navigate('/signin')}>
                    Sign In
                  </Button>
                  <Button variant="primary" size="small" onClick={() => navigate('/signup')}>
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <section className="landing-hero-vowly">
            <div className="landing-container">
              <div className="hero-vowly-content">
                <div className="hero-vowly-text">
                  <h1>
                    Plan your wedding,<br />
                    without the <span className="text-stress">stress</span>
                  </h1>
                  <p className="hero-vowly-description">
                    Invites, guests, relationships, RSVPs, and updates — all beautifully organized in one place.
                  </p>
                  <div className="hero-vowly-actions">
                    <Button variant="primary" size="large" onClick={() => navigate('/signup')}>
                      Create your wedding
                    </Button>
                    <button className="btn-text-link" onClick={() => navigate('/themes')}>
                      View themes
                    </button>
                  </div>
                  <p className="hero-vowly-note">Free to start · No credit card required</p>
                </div>

                <div className="hero-vowly-preview">
                  <div className="preview-card-vowly">
                    <div className="preview-header-vowly">
                      <div className="preview-initials">S & D</div>
                      <div className="preview-welcome">
                        <span className="welcome-text">Welcome back</span>
                        <h3 className="couple-name">Sarah & David</h3>
                      </div>
                      <div className="preview-avatar">
                        <img src="https://i.pravatar.cc/48?img=5" alt="User" />
                      </div>
                    </div>

                    <div className="preview-stats-vowly">
                      <div className="stat-item-vowly">
                        <div className="stat-number-vowly">124</div>
                        <div className="stat-label-vowly">Confirmed</div>
                      </div>
                      <div className="stat-divider-vowly"></div>
                      <div className="stat-item-vowly">
                        <div className="stat-number-vowly">18</div>
                        <div className="stat-label-vowly">Pending</div>
                      </div>
                    </div>

                    <div className="preview-rsvps-vowly">
                      <h4 className="rsvps-title-vowly">Recent RSVPs</h4>
                      <div className="rsvp-list-vowly">
                        <div className="rsvp-item-vowly">
                          <img src="https://i.pravatar.cc/40?img=1" alt="Guest" className="rsvp-avatar-vowly" />
                          <div className="rsvp-info-vowly">
                            <div className="rsvp-name-vowly">Arjun Patel</div>
                            <div className="rsvp-relation-vowly">Groom's Friend</div>
                          </div>
                          <span className="rsvp-status-vowly status-going">Going</span>
                        </div>
                        <div className="rsvp-item-vowly">
                          <img src="https://i.pravatar.cc/40?img=9" alt="Guest" className="rsvp-avatar-vowly" />
                          <div className="rsvp-info-vowly">
                            <div className="rsvp-name-vowly">Emma Wilson</div>
                            <div className="rsvp-relation-vowly">Bride's Family</div>
                          </div>
                          <span className="rsvp-status-vowly status-maybe">Maybe</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. ELEGANT INVITATION PREVIEW */}
          <section className="vowly-invitation-preview">
            <div className="invitation-controls">
              <button 
                className={`control-pill ${isAutoCycling === 'layout' ? 'active-cycling' : ''}`}
                onClick={toggleLayoutCycle}
              >
                Layouts {isAutoCycling === 'layout' && '●'}
              </button>
              <button 
                className={`control-pill ${isAutoCycling === 'font' ? 'active-cycling' : ''}`}
                onClick={toggleFontCycle}
              >
                Fonts {isAutoCycling === 'font' && '●'}
              </button>
              <button 
                className={`control-pill ${isAutoCycling === 'color' ? 'active-cycling' : ''}`}
                onClick={toggleColorCycle}
              >
                Colors {isAutoCycling === 'color' && '●'}
              </button>
            </div>

            <div className="invitation-card-container">
              <div className={`invitation-card-elegant layout-${selectedLayout}`}>
                <div className="invitation-label">THE MARRIAGE OF</div>
                <h2 
                  className="invitation-names" 
                  style={{ 
                    fontFamily: fontFamilies[selectedFont as keyof typeof fontFamilies],
                    color: selectedColor 
                  }}
                >
                  Katherine & Michael
                </h2>
                <div className="invitation-details">Saturday, August 14th, 2025 · Napa Valley, CA</div>
                
                <div className="invitation-illustration">
                  <img 
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop" 
                    alt="Vineyard landscape" 
                    className="invitation-scene"
                  />
                </div>
                
                <button 
                  className="invitation-cta" 
                  style={{ background: selectedColor }}
                  onClick={() => navigate('/signup')}
                >
                  RSVP Now
                </button>
              </div>
            </div>
          </section>

          {/* 3. GUEST RELATIONSHIP MAPPING */}
          <section className="vowly-relationship-map">
            <div className="vowly-container">
              <div className="relationship-map-content">
                <div className="guest-list-preview">
                  <div className="guest-list-card">
                    <div className="guest-list-header">
                      <span className="guest-list-title">Guest List</span>
                      <button className="filter-icon">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                      </button>
                    </div>

                    <div className="guest-list-items">
                      <div className="guest-list-item">
                        <img src="https://i.pravatar.cc/48?img=5" alt="Martha Jenkins" className="guest-avatar" />
                        <div className="guest-details">
                          <div className="guest-name">Martha Jenkins</div>
                          <div className="guest-tag tag-bride">Bride's Mother</div>
                        </div>
                        <button className="guest-check checked">
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" fill="#14532d" stroke="#14532d" strokeWidth="2"/>
                            <path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4"/>
                          </svg>
                        </button>
                      </div>

                      <div className="guest-list-item">
                        <img src="https://i.pravatar.cc/48?img=12" alt="David Okonjo" className="guest-avatar" />
                        <div className="guest-details">
                          <div className="guest-name">David Okonjo</div>
                          <div className="guest-tag tag-groom">Groom's Colleague</div>
                        </div>
                        <button className="guest-check">
                          <svg width="20" height="20" fill="none" stroke="#d1d5db" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                          </svg>
                        </button>
                      </div>

                      <div className="guest-list-item">
                        <img src="https://i.pravatar.cc/48?img=9" alt="Sarah Kim" className="guest-avatar" />
                        <div className="guest-details">
                          <div className="guest-name">Sarah Kim</div>
                          <div className="guest-tag tag-friend">Bride's Friend</div>
                        </div>
                        <button className="guest-check">
                          <svg width="20" height="20" fill="none" stroke="#d1d5db" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <button className="view-all-guests">View all 142 guests</button>
                  </div>
                </div>

                <div className="relationship-text">
                  <h2>
                    Know who's coming —<br />
                    and how they're <span className="text-connected">connected</span>
                  </h2>
                  <p className="relationship-description">
                    See all guests at a glance, clearly grouped by relationship. Avoid confusion during seating charts and planning.
                  </p>
                  
                  <div className="relationship-features">
                    <div className="feature-item">
                      <svg width="20" height="20" fill="none" stroke="#7FB069" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Group by family, friends, work</span>
                    </div>
                    <div className="feature-item">
                      <svg width="20" height="20" fill="none" stroke="#7FB069" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                      </svg>
                      <span>Drag-and-drop seating planner</span>
                    </div>
                  </div>

                  <button className="view-demo-btn" onClick={() => navigate('/signup')}>
                    View guest list demo
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 4. GUEST INTERACTION & UPDATES */}
          <section className="vowly-guest-interaction">
            <div className="vowly-container">
              <div className="interaction-content">
                <div className="interaction-text">
                  <h2>
                    Keep everyone informed<br />
                    in <span className="text-one-place">one place</span>
                  </h2>
                  <p className="interaction-description">
                    No more repeated calls or messages. Guests can ask questions, leave comments, and get excited together.
                  </p>
                  
                  <button className="learn-more-btn" onClick={() => navigate('/signup')}>
                    Learn more
                  </button>
                </div>

                <div className="interaction-preview">
                  <div className="interaction-card">
                    <div className="comment-item">
                      <img src="https://i.pravatar.cc/40?img=5" alt="Maria Rodriguez" className="comment-avatar" />
                      <div className="comment-content">
                        <div className="comment-header">
                          <span className="comment-name">Maria Rodriguez</span>
                        </div>
                        <div className="comment-text">Is there a shuttle from the hotel to the venue?</div>
                        <div className="comment-actions">
                          <button className="comment-action">Reply</button>
                          <button className="comment-action">Like</button>
                        </div>
                      </div>
                    </div>

                    <div className="comment-item">
                      <div className="comment-avatar-badge">
                        <span className="badge-text">Bride</span>
                      </div>
                      <div className="comment-content">
                        <div className="comment-header">
                          <span className="comment-name">Bride</span>
                        </div>
                        <div className="comment-text">Yes! Shuttles leave every 30 mins starting at 3 PM! 🚌</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. POWERFUL WEDDING FEATURES */}
          <section className="vowly-features">
            <div className="vowly-container">
              <div className="features-header">
                <h2>Powerful wedding features</h2>
              </div>
              
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">
                    <svg width="24" height="24" fill="none" stroke="#7FB069" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h3>RSVP Tracking</h3>
                  <p>Real-time stats on who is attending. Export data instantly.</p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">
                    <svg width="24" height="24" fill="none" stroke="#7FB069" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3>Guest Preferences</h3>
                  <p>Collect dietary needs, song requests, and accommodation info.</p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">
                    <svg width="24" height="24" fill="none" stroke="#7FB069" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <h3>Cost Contributions</h3>
                  <p>Optional discreet registry or honeymoon fund integration.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 6. SHARE YOUR INVITE ANYWHERE */}
          <section className="vowly-share">
            <div className="vowly-container">
              <div className="share-content">
                <div className="share-text">
                  <h2>
                    Share your invite<br />
                    <span className="text-anywhere">anywhere</span>
                  </h2>
                  <p className="share-description">
                    Guests don't need to download an app. Send a link via WhatsApp, Email, or SMS and they're in.
                  </p>
                  
                  <div className="share-methods">
                    <div className="share-method">
                      <div className="share-method-icon whatsapp">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </div>
                      <span>WhatsApp</span>
                    </div>

                    <div className="share-method">
                      <div className="share-method-icon email">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span>Email</span>
                    </div>

                    <div className="share-method">
                      <div className="share-method-icon sms">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span>SMS</span>
                    </div>
                  </div>
                </div>

                <div className="share-preview">
                  <div className="phone-mockup">
                    <div className="phone-screen">
                      <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop" alt="Wedding invitation" className="invite-image" />
                      <div className="invite-content">
                        <h4>You're Invited!</h4>
                        <p>Tap to view the details for Katherine & Michael's wedding.</p>
                        <div className="invite-link">vowly.com/k-and-m</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 7. COLLECT AND RELIVE MEMORIES */}
          <section className="vowly-memories">
            <div className="vowly-container">
              <div className="memories-content">
                <div className="memories-grid">
                  <div className="memory-photo large">
                    <img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=400&fit=crop" alt="Wedding couple" />
                  </div>
                  <div className="memory-photo">
                    <img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=400&fit=crop" alt="Wedding cake" />
                    <div className="photo-reaction">
                      <span>❤️ 34</span>
                    </div>
                  </div>
                  <div className="memory-photo">
                    <img src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=400&fit=crop" alt="Wedding bouquet" />
                  </div>
                  <div className="memory-photo">
                    <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=400&fit=crop" alt="Wedding celebration" />
                  </div>
                </div>

                <div className="memories-text">
                  <h2>
                    Collect and relive<br />
                    <span className="text-memories">memories</span>
                  </h2>
                  <p className="memories-description">
                    Guests upload photos directly to your shared album. Everyone keeps the memories without chasing files.
                  </p>
                  
                  <button className="create-album-btn" onClick={() => navigate('/signup')}>
                    Create Shared Album
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 8. FINAL CTA */}
          <section className="vowly-final-cta">
            <div className="vowly-container">
              <div className="final-cta-content">
                <h2>
                  Plan your wedding, <span className="text-beautifully">beautifully</span> organized
                </h2>
                <p>Accessible on web and mobile. Join happy couples worldwide.</p>
                <button className="start-wedding-btn" onClick={() => navigate('/signup')}>
                  Start your wedding
                </button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="vowly-footer">
            <div className="vowly-container">
              <div className="footer-content">
                <div className="footer-brand-section">
                  <div className="footer-logo">
                    <div className="footer-logo-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="4" y="4" width="16" height="16" rx="2" fill="#7FB069"/>
                      </svg>
                    </div>
                    <span className="footer-brand-name">Vowly</span>
                  </div>
                  <p className="footer-tagline">
                    Modern tools for modern couples. Making wedding planning simple and elegant.
                  </p>
                </div>
                
                <div className="footer-links-section">
                  <div className="footer-column">
                    <h4 className="footer-column-title">Product</h4>
                    <ul className="footer-column-links">
                      <li><a href="#features">Features</a></li>
                      <li><a href="#themes">Themes</a></li>
                      <li><a href="#pricing">Pricing</a></li>
                    </ul>
                  </div>
                  
                  <div className="footer-column">
                    <h4 className="footer-column-title">Company</h4>
                    <ul className="footer-column-links">
                      <li><a href="#about">About</a></li>
                      <li><a href="#careers">Careers</a></li>
                      <li><a href="#blog">Blog</a></li>
                    </ul>
                  </div>
                  
                  <div className="footer-column">
                    <h4 className="footer-column-title">Legal</h4>
                    <ul className="footer-column-links">
                      <li><a href="#privacy">Privacy</a></li>
                      <li><a href="#terms">Terms</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="footer-bottom">
                <p>© 2025 Vowly Inc. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
  );
};

export default LandingPage;
