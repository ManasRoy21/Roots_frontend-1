import React from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import "./ProfilePage.scss";

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div className="profile-page">
      <NavigationBar />
      
      <main className="profile-main">
        <div className="profile-container">
          <div className="profile-card-centered">
            {/* Profile Image */}
            <div className="profile-image-circle">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600"
                alt="Antonio Jose Rivera"
              />
            </div>

            {/* Badge */}
            <span className="profile-role-badge">Grandfather</span>

            {/* Name */}
            <h1 className="profile-name-large">Antonio Jose Rivera</h1>

            {/* Contact Information */}
            <div className="contact-info-list">
              {/* Mobile */}
              <div className="contact-info-item">
                <div className="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.3333 14.1V16.6C18.3343 16.8321 18.2867 17.0618 18.1937 17.2745C18.1008 17.4871 17.9644 17.678 17.7934 17.8349C17.6224 17.9918 17.4205 18.1112 17.2006 18.1856C16.9808 18.26 16.7478 18.2876 16.5167 18.2667C13.9523 17.988 11.489 17.1118 9.32498 15.7083C7.31151 14.4289 5.60443 12.7218 4.32499 10.7083C2.91663 8.53438 2.04019 6.05916 1.76665 3.48334C1.74583 3.25294 1.77321 3.02069 1.84707 2.80139C1.92092 2.58209 2.03963 2.38061 2.19562 2.2098C2.35162 2.039 2.54149 1.90247 2.75314 1.80879C2.9648 1.7151 3.19348 1.66646 3.42499 1.66668H5.92499C6.32953 1.6627 6.72148 1.80582 7.028 2.06953C7.33452 2.33324 7.53155 2.69946 7.58332 3.10001C7.68011 3.90001 7.86271 4.68562 8.12499 5.44168C8.2402 5.76991 8.2561 6.12462 8.17049 6.46215C8.08489 6.79968 7.90213 7.10326 7.64499 7.33334L6.59165 8.38668C7.77744 10.4743 9.52536 12.2222 11.6133 13.4083L12.6667 12.355C12.8967 12.0979 13.2003 11.9151 13.5378 11.8295C13.8754 11.7439 14.2301 11.7598 14.5583 11.875C15.3144 12.1373 16.1 12.3199 16.9 12.4167C17.3048 12.4688 17.6745 12.6694 17.9388 12.9812C18.203 13.293 18.3435 13.6913 18.3333 14.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="contact-info-content">
                  <div className="contact-label">MOBILE</div>
                  <div className="contact-value">+1 (555) 123-4567</div>
                </div>
              </div>

              {/* Email */}
              <div className="contact-info-item">
                <div className="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.33334 3.33334H16.6667C17.5833 3.33334 18.3333 4.08334 18.3333 5.00001V15C18.3333 15.9167 17.5833 16.6667 16.6667 16.6667H3.33334C2.41668 16.6667 1.66668 15.9167 1.66668 15V5.00001C1.66668 4.08334 2.41668 3.33334 3.33334 3.33334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.3333 5L10 10.8333L1.66666 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="contact-info-content">
                  <div className="contact-label">EMAIL ADDRESS</div>
                  <div className="contact-value">antonio.rivera@example.com</div>
                </div>
              </div>

              {/* Birthday */}
              <div className="contact-info-item">
                <div className="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.8333 3.33334H4.16667C3.24619 3.33334 2.5 4.07954 2.5 5.00001V16.6667C2.5 17.5872 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5872 17.5 16.6667V5.00001C17.5 4.07954 16.7538 3.33334 15.8333 3.33334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.3333 1.66666V4.99999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.66666 1.66666V4.99999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.5 8.33334H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="contact-info-content">
                  <div className="contact-label">BIRTHDAY</div>
                  <div className="contact-value">September 14, 1934</div>
                </div>
              </div>

              {/* Age */}
              <div className="contact-info-item">
                <div className="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 18.3334C14.6024 18.3334 18.3333 14.6025 18.3333 10.0001C18.3333 5.39771 14.6024 1.66675 10 1.66675C5.39763 1.66675 1.66667 5.39771 1.66667 10.0001C1.66667 14.6025 5.39763 18.3334 10 18.3334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 5.00008V10.0001L13.3333 11.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="contact-info-content">
                  <div className="contact-label">AGE</div>
                  <div className="contact-value">89 years</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="profile-actions-row">
              <button className="share-contact-btn">
                Share Contact
              </button>
              <button className="edit-details-btn" onClick={() => navigate("/edit-profile")}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.3333 2.00004C11.5084 1.82494 11.7163 1.68605 11.9451 1.59129C12.1739 1.49653 12.4191 1.44775 12.6667 1.44775C12.9142 1.44775 13.1594 1.49653 13.3882 1.59129C13.617 1.68605 13.8249 1.82494 14 2.00004C14.1751 2.17513 14.314 2.383 14.4088 2.61178C14.5035 2.84055 14.5523 3.08575 14.5523 3.33337C14.5523 3.58099 14.5035 3.82619 14.4088 4.05497C14.314 4.28374 14.1751 4.49161 14 4.66671L5 13.6667L1.33333 14.6667L2.33333 11L11.3333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Edit Details
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
