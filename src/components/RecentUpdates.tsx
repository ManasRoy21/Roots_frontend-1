import React from 'react';
import './RecentUpdates.scss';

interface BirthdayData {
  relativeName: string;
  age: number;
  date: string;
}

interface PhotoData {
  uploaderName: string;
  albumName: string;
  photoUrls: string[];
  timestamp: string;
}

interface NewMemberData {
  relativeName: string;
  joinedAt: string;
}

interface Update {
  id: string;
  type: 'birthday' | 'photo' | 'new_member';
  data: BirthdayData | PhotoData | NewMemberData;
}

interface RecentUpdatesProps {
  updates?: Update[];
  onViewAll?: () => void;
}

const RecentUpdates: React.FC<RecentUpdatesProps> = ({ updates = [], onViewAll }) => {
  if (updates.length === 0) {
    return (
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Recent Updates</h2>
          <button className="view-all-link" onClick={onViewAll}>
            View All
          </button>
        </div>
        <div className="updates-list">
          <p className="empty-state">No recent updates</p>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <div className="section-header">
        <h2>Recent Updates</h2>
        <button className="view-all-link" onClick={onViewAll}>
          View All
        </button>
      </div>
      <div className="updates-list">
        {updates.map((update) => (
          <UpdateItem key={update.id} update={update} />
        ))}
      </div>
    </section>
  );
};

interface UpdateItemProps {
  update: Update;
}

const UpdateItem: React.FC<UpdateItemProps> = ({ update }) => {
  const { type, data } = update;

  switch (type) {
    case 'birthday':
      return <BirthdayUpdate data={data as BirthdayData} />;
    case 'photo':
      return <PhotoUpdate data={data as PhotoData} />;
    case 'new_member':
      return <NewMemberUpdate data={data as NewMemberData} />;
    default:
      return null;
  }
};

interface BirthdayUpdateProps {
  data: BirthdayData;
}

const BirthdayUpdate: React.FC<BirthdayUpdateProps> = ({ data }) => {
  const { relativeName, age, date } = data;
  
  const formatDate = (dateStr: string): string => {
    const d = new Date(dateStr);
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const day = d.getDate();
    return `${month} ${day}`;
  };

  return (
    <div className="update-item birthday-update">
      <div className="update-icon birthday-icon">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2L11.5 5.5L15 7L11.5 8.5L10 12L8.5 8.5L5 7L8.5 5.5L10 2Z" fill="currentColor"/>
          <path d="M4 14H16V16C16 17.1 15.1 18 14 18H6C4.9 18 4 17.1 4 16V14Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="update-content">
        <p className="update-text">
          <strong>{relativeName}</strong> has a birthday tomorrow!
        </p>
        <p className="update-meta">
          Turning {age} • {formatDate(date)}
        </p>
        <div className="update-actions">
          <button className="update-action-link">Send a wish</button>
          <button className="update-action-link">Send gift card</button>
        </div>
      </div>
    </div>
  );
};

interface PhotoUpdateProps {
  data: PhotoData;
}

const PhotoUpdate: React.FC<PhotoUpdateProps> = ({ data }) => {
  const { uploaderName, albumName, photoUrls, timestamp } = data;
  
  const formatTimestamp = (ts: string): string => {
    const now = new Date();
    const then = new Date(ts);
    const diffMs = now.getTime() - then.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }
  };

  const displayPhotos = photoUrls.slice(0, 3);

  return (
    <div className="update-item photo-update">
      <div className="update-icon photo-icon">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="7" cy="8" r="1.5" fill="currentColor"/>
          <path d="M3 13L6 10L9 13L13 9L17 13V14C17 15.1 16.1 16 15 16H5C3.9 16 3 15.1 3 14V13Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="update-content">
        <p className="update-text">
          <strong>{uploaderName}</strong> added {photoUrls.length} new photos to the "{albumName}" album.
        </p>
        <p className="update-meta">{formatTimestamp(timestamp)}</p>
        <div className="photo-thumbnails">
          {displayPhotos.map((url, index) => (
            <div key={index} className="photo-thumbnail">
              <img src={url} alt={`Photo ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface NewMemberUpdateProps {
  data: NewMemberData;
}

const NewMemberUpdate: React.FC<NewMemberUpdateProps> = ({ data }) => {
  const { relativeName, joinedAt } = data;
  
  const formatTimestamp = (ts: string): string => {
    const now = new Date();
    const then = new Date(ts);
    const diffMs = now.getTime() - then.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return 'Yesterday';
    } else {
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays} days ago`;
    }
  };

  return (
    <div className="update-item new-member-update">
      <div className="update-icon member-icon">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M4 17C4 14 6.5 12 10 12C13.5 12 16 14 16 17" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      </div>
      <div className="update-content">
        <p className="update-text">
          <strong>{relativeName}</strong> joined the family tree.
        </p>
        <p className="update-meta">{formatTimestamp(joinedAt)}</p>
        <div className="update-actions">
          <button className="update-action-link">View Profile</button>
          <button className="update-action-link">Message</button>
        </div>
      </div>
    </div>
  );
};

export default RecentUpdates;