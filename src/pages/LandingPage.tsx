import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import RootsLogo from '../components/RootsLogo';
import Hero3DSection from '../components/Hero3DSection';
import './LandingPage.scss';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

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

          {/* 3D Hero Section - Only this section has 3D enhancements */}
          <Hero3DSection 
            autoRotate={true}
            interactionEnabled={true}
            className="landing-hero-3d"
          />

          {/* Features Section - Original non-3D version */}
          <section className="landing-features-new">
            <div className="landing-container">
              <div className="features-new-header">
                <h2>Everything you need to grow your legacy.</h2>
                <p>Powerful tools wrapped in a beautiful, intuitive interface designed for every generation.</p>
              </div>
              
              <div className="features-new-grid">
                <div className="feature-new-card feature-large feature-teal">
                  <div className="feature-new-icon">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3>The Infinite Tree</h3>
                  <p>Our signature canvas lets you visualize everything. Zoom from a single face to a thousand-person tree.</p>
                  <div className="feature-new-image">
                    <img src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&h=400&fit=crop" alt="Tree visualization" />
                  </div>
                </div>

                <div className="feature-new-card feature-light">
                  <div className="feature-new-icon">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <h3>Voice Memories</h3>
                  <p>Don't just save photos. Record the laughter, stories, and songs that define your family culture.</p>
                </div>

                <div className="feature-new-card feature-light">
                  <div className="feature-new-icon">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3>Real-time Collaboration</h3>
                  <p>Build together. Changes sync instantly across devices.</p>
                </div>

                <div className="feature-new-card feature-light">
                  <div className="feature-new-icon">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3>DNA Insights</h3>
                  <p>Trace migration paths and find matches with precision.</p>
                </div>

                <div className="feature-new-card feature-dark-image">
                  <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop" alt="Memories" />
                </div>
              </div>
            </div>
          </section>

          {/* Story Section - Original non-3D version */}
          <section className="landing-story" id="features">
            <div className="landing-container">
              <div className="story-layout">
                <div className="story-heading">
                  <h2>Your family story is too important to be lost in a shoebox.</h2>
                </div>
                <div className="story-right">
                  <div className="story-description">
                    <p>We built FamilyHub because the old way of tracking family history felt dusty and disconnected. We wanted a place that felt alive—where your grandmother's voice and your cousin's photos could live side by side.</p>
                    <p>It's not just about names and dates. It's about the context, the stories, and the connections that make you who you are.</p>
                  </div>
                  <div className="story-stats">
                    <div className="story-stat-item">
                      <div className="story-stat-number">50M+</div>
                      <div className="story-stat-label">Photos Preserved</div>
                    </div>
                    <div className="story-stat-item">
                      <div className="story-stat-number">120+</div>
                      <div className="story-stat-label">Countries Supported</div>
                    </div>
                    <div className="story-stat-item">
                      <div className="story-stat-number">99.9%</div>
                      <div className="story-stat-label">Uptime Reliability</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section - Original non-3D version */}
          <section className="landing-how-it-works">
            <div className="landing-container">
              <div className="how-it-works-header">
                <h2>How FamilyHub fits into your life.</h2>
                <p>From first login to a living, breathing tree in under a week.</p>
              </div>
              
              <div className="how-it-works-grid">
                <div className="how-it-works-card">
                  <div className="how-it-works-number">1</div>
                  <h3>Create your core tree</h3>
                  <p>Add parents, grandparents, and siblings. Import existing files or start from memory—no spreadsheets required.</p>
                </div>
                
                <div className="how-it-works-card">
                  <div className="how-it-works-number">2</div>
                  <h3>Invite your family</h3>
                  <p>Share a secure link so relatives can upload photos, write stories, and record voice notes from anywhere.</p>
                </div>
                
                <div className="how-it-works-card">
                  <div className="how-it-works-number">3</div>
                  <h3>Unlock deeper connections</h3>
                  <p>Connect DNA data, trace relationships across branches, and see how everyone is related at a glance.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section - Original non-3D version */}
          <section className="landing-testimonials">
            <div className="landing-container">
              <div className="testimonials-header">
                <h2>Families love FamilyHub</h2>
              </div>
              
              <div className="testimonials-grid">
                <div className="testimonial-card">
                  <div className="testimonial-stars">
                    ⭐⭐⭐⭐⭐
                  </div>
                  <p className="testimonial-text">
                    "I discovered cousins I never knew existed. The interface is so much cleaner and greener than other sites I've used."
                  </p>
                  <div className="testimonial-author">
                    <img src="https://i.pravatar.cc/48?img=1" alt="Sarah J." className="testimonial-avatar" />
                    <div className="testimonial-info">
                      <div className="testimonial-name">Sarah J.</div>
                      <div className="testimonial-meta">Member since 2021</div>
                    </div>
                  </div>
                </div>

                <div className="testimonial-card">
                  <div className="testimonial-stars">
                    ⭐⭐⭐⭐⭐
                  </div>
                  <p className="testimonial-text">
                    "The audio recording feature is a game changer. I have my late grandfather's stories saved forever."
                  </p>
                  <div className="testimonial-author">
                    <img src="https://i.pravatar.cc/48?img=12" alt="Marcus T." className="testimonial-avatar" />
                    <div className="testimonial-info">
                      <div className="testimonial-name">Marcus T.</div>
                      <div className="testimonial-meta">Member since 2023</div>
                    </div>
                  </div>
                </div>

                <div className="testimonial-card">
                  <div className="testimonial-stars">
                    ⭐⭐⭐⭐⭐
                  </div>
                  <p className="testimonial-text">
                    "Finally, a genealogy site that doesn't feel like it was built in 1998. Beautiful and intuitive."
                  </p>
                  <div className="testimonial-author">
                    <img src="https://i.pravatar.cc/48?img=9" alt="Emily R." className="testimonial-avatar" />
                    <div className="testimonial-info">
                      <div className="testimonial-name">Emily R.</div>
                      <div className="testimonial-meta">Member since 2024</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section - Original non-3D version */}
          <section className="landing-stats">
            <div className="landing-container">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">2M+</div>
                  <div className="stat-label">Families connected</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">50M+</div>
                  <div className="stat-label">Memories preserved</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">150+</div>
                  <div className="stat-label">Countries worldwide</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">99.9%</div>
                  <div className="stat-label">Uptime guarantee</div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section - Original non-3D version */}
          <section className="landing-cta">
            <div className="landing-container">
              <div className="cta-content">
                <h2>Start building your legacy today</h2>
                <p>Join thousands of families who trust Roots to keep their memories safe and connections strong.</p>
                <Button variant="primary" size="large" onClick={() => navigate('/signup')}>
                  Get started for free
                </Button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="landing-footer">
            <div className="landing-container">
              <div className="footer-content">
                <div className="footer-brand-section">
                  <div className="footer-logo">
                    <RootsLogo width={48} height={48} />
                    <span className="footer-brand-name">FamilyHub</span>
                  </div>
                  <p className="footer-tagline">
                    Empowering families to connect with their past and preserve their future.
                  </p>
                  <div className="footer-social">
                    <a href="#twitter" aria-label="Twitter">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                      </svg>
                    </a>
                    <a href="#instagram" aria-label="Instagram">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                      </svg>
                    </a>
                    <a href="#facebook" aria-label="Facebook">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
                
                <div className="footer-links-section">
                  <div className="footer-column">
                    <h4 className="footer-column-title">PRODUCT</h4>
                    <ul className="footer-column-links">
                      <li><a href="#features">Features</a></li>
                      <li><a href="#pricing">Pricing</a></li>
                      <li><a href="#updates">Updates</a></li>
                      <li><a href="#beta">Beta Program</a></li>
                    </ul>
                  </div>
                  
                  <div className="footer-column">
                    <h4 className="footer-column-title">RESOURCES</h4>
                    <ul className="footer-column-links">
                      <li><a href="#help">Help Center</a></li>
                      <li><a href="#guide">Genealogy Guide</a></li>
                      <li><a href="#community">Community</a></li>
                      <li><a href="#blog">Blog</a></li>
                    </ul>
                  </div>
                  
                  <div className="footer-column">
                    <h4 className="footer-column-title">COMPANY</h4>
                    <ul className="footer-column-links">
                      <li><a href="#about">About</a></li>
                      <li><a href="#careers">Careers</a></li>
                      <li><a href="#legal">Legal</a></li>
                      <li><a href="#contact">Contact</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="footer-bottom">
                <p>© 2025 FamilyHub Inc. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
  );
};

export default LandingPage;
