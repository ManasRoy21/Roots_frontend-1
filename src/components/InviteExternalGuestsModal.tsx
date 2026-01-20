import React, { useState } from 'react';
import { InviteExternalGuestsModalProps } from '../types/components';
import './InviteExternalGuestsModal.scss';

// Connection interface
interface Connection {
  id: string;
  name: string;
  treeName: string;
  avatar: string;
  status: 'available' | 'sent';
}

const InviteExternalGuestsModal: React.FC<InviteExternalGuestsModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestedConnections] = useState<Connection[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      treeName: 'Chen Family Tree',
      avatar: 'https://i.pravatar.cc/150?img=5',
      status: 'available',
    },
    {
      id: '2',
      name: 'Marcus Rivera',
      treeName: 'Rivera Extended',
      avatar: 'https://i.pravatar.cc/150?img=12',
      status: 'sent',
    },
    {
      id: '3',
      name: 'Elara Vance',
      treeName: 'Vance Legacy',
      avatar: 'https://i.pravatar.cc/150?img=9',
      status: 'available',
    },
  ]);

  const [inviteStatus, setInviteStatus] = useState<Record<string, 'sent'>>({});

  if (!isOpen) return null;

  const handleInvite = (guestId: string): void => {
    setInviteStatus({ ...inviteStatus, [guestId]: 'sent' });
    console.log('Invited guest:', guestId);
  };

  const handleDone = (): void => {
    setSearchQuery('');
    setInviteStatus({});
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      handleDone();
    }
  };

  return (
    <div className="external-guests-overlay" onClick={handleOverlayClick}>
      <div className="external-guests-modal" onClick={(e) => e.stopPropagation()}>
        <div className="external-guests-header">
          <div>
            <h2 className="external-guests-title">Invite External Guests</h2>
            <p className="external-guests-subtitle">Search for relatives in other family trees</p>
          </div>
          <button className="external-guests-close" onClick={handleDone} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="external-guests-body">
          {/* Search Box */}
          <div className="external-search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth="2"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              className="external-search-input"
              placeholder="Search by name, email, or tree name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Suggested Connections */}
          <div className="suggested-section">
            <h3 className="suggested-title">SUGGESTED CONNECTIONS</h3>
            <div className="connections-list">
              {suggestedConnections.map((connection) => {
                const status = inviteStatus[connection.id] || connection.status;
                return (
                  <div key={connection.id} className="connection-item">
                    <img src={connection.avatar} alt={connection.name} className="connection-avatar" />
                    <div className="connection-info">
                      <div className="connection-name">{connection.name}</div>
                      <div className="connection-tree">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                        </svg>
                        <span>{connection.treeName}</span>
                      </div>
                    </div>
                    {status === 'sent' ? (
                      <div className="status-sent">Sent</div>
                    ) : (
                      <button 
                        className="btn-invite" 
                        onClick={() => handleInvite(connection.id)}
                      >
                        Invite
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="external-guests-footer">
          <button type="button" className="btn-done" onClick={handleDone}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteExternalGuestsModal;
