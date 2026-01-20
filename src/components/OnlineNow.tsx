import React from 'react';
import './OnlineNow.scss';

interface OnlineUser {
  id: string;
  name: string;
  photoUrl?: string;
}

interface OnlineNowProps {
  onlineUsers?: OnlineUser[];
  maxDisplay?: number;
  onUserClick?: (userId: string) => void;
}

const OnlineNow: React.FC<OnlineNowProps> = ({ onlineUsers = [], maxDisplay = 4, onUserClick }) => {
  if (onlineUsers.length === 0) {
    return (
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Online Now</h2>
          <span className="online-indicator">
            <span className="online-dot"></span>
          </span>
        </div>
        <div className="online-users">
          <p className="empty-state">No one online</p>
        </div>
      </section>
    );
  }

  const displayUsers = onlineUsers.slice(0, maxDisplay);
  const remainingCount = onlineUsers.length - maxDisplay;

  return (
    <section className="dashboard-section">
      <div className="section-header">
        <h2>Online Now</h2>
        <span className="online-indicator">
          <span className="online-dot"></span>
        </span>
      </div>
      <div className="online-users">
        <div className="online-users-grid">
          {displayUsers.map((user) => (
            <button
              key={user.id}
              className="online-user"
              onClick={() => onUserClick && onUserClick(user.id)}
              aria-label={`View ${user.name}'s profile`}
            >
              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.name}
                  className="online-user-photo"
                />
              ) : (
                <div className="online-user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="online-status-dot"></span>
            </button>
          ))}
          {remainingCount > 0 && (
            <div className="online-user-more">
              <span className="online-more-count">+{remainingCount}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OnlineNow;