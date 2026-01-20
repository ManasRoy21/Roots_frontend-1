import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import InviteCodeInput from '../components/InviteCodeInput';
import Button from '../components/Button';
import InviteService from '../services/InviteService';
import './JoinFamilyTreePage.scss';

interface Invitation {
  id: string;
  treeId: string;
  treeName: string;
  invitedBy: string;
  inviterName: string;
  invitedEmail: string;
  inviteCode: string;
  status: string;
  expiresAt: string;
  createdAt: string;
}

const JoinFamilyTreePage: React.FC = () => {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState<string>('');
  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>([]);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Mock mode for development
  const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

  // Load pending invitations on mount
  useEffect(() => {
    loadPendingInvitations();
  }, []);

  const loadPendingInvitations = async () => {
    try {
      setIsLoadingInvitations(true);
      
      if (MOCK_MODE) {
        // Mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        setPendingInvitations([
          {
            id: 'inv-1',
            treeId: 'tree-1',
            treeName: 'Garcia Family Tree',
            invitedBy: 'user-123',
            inviterName: 'Maria Garcia',
            invitedEmail: 'user@example.com',
            inviteCode: 'GAR-2025',
            status: 'pending',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ]);
      } else {
        const invitations = await InviteService.getPendingInvitations();
        setPendingInvitations(invitations);
      }
    } catch (err) {
      console.error('Failed to load pending invitations:', err);
      // Don't show error to user, just log it
    } finally {
      setIsLoadingInvitations(false);
    }
  };

  const handleJoinTree = async () => {
    if (!inviteCode.trim()) {
      setError('Please enter an invite code');
      return;
    }

    try {
      setIsValidating(true);
      setError(null);

      if (MOCK_MODE) {
        // Mock validation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate success
        navigate('/dashboard', {
          state: {
            message: 'Successfully joined family tree!',
          },
        });
      } else {
        // Validate and join tree
        await InviteService.validateInviteCode(inviteCode);
        await InviteService.joinTree(inviteCode);
        
        navigate('/dashboard', {
          state: {
            message: 'Successfully joined family tree!',
          },
        });
      }
    } catch (err) {
      setError(err.message || 'Invalid invite code. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      setIsJoining(true);
      setError(null);

      if (MOCK_MODE) {
        // Mock accept
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Remove from pending list
        setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId));
        
        navigate('/dashboard', {
          state: {
            message: 'Successfully joined family tree!',
          },
        });
      } else {
        await InviteService.acceptInvitation(invitationId);
        
        // Remove from pending list
        setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId));
        
        navigate('/dashboard', {
          state: {
            message: 'Successfully joined family tree!',
          },
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to accept invitation');
    } finally {
      setIsJoining(false);
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      if (MOCK_MODE) {
        // Mock decline
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Remove from pending list
        setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      } else {
        await InviteService.declineInvitation(invitationId);
        
        // Remove from pending list
        setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      }
    } catch (err) {
      console.error('Failed to decline invitation:', err);
      setError(err.message || 'Failed to decline invitation');
    }
  };

  const handleSearchMembers = () => {
    // TODO: Navigate to search interface
    console.log('Search for family members');
  };

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'today';
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  return (
    <div className="join-family-tree-page">
      <NavigationBar />
      
      <div className="join-tree-container" role="main" aria-label="Join family tree">
        <div className="join-tree-card">
          <div className="join-tree-icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Family tree icon">
              <path d="M24 8V20M24 20C20.6863 20 18 22.6863 18 26V40M24 20C27.3137 20 30 22.6863 30 26V40" stroke="#0d7377" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="24" cy="8" r="3" fill="#0d7377"/>
              <circle cx="18" cy="40" r="3" fill="#0d7377"/>
              <circle cx="30" cy="40" r="3" fill="#0d7377"/>
            </svg>
          </div>

          <h1 className="join-tree-title">Join a Family Tree</h1>
          <p className="join-tree-subtitle">
            Enter the unique 6-digit invite code shared by your family admin to connect with your relatives.
          </p>

          <div className="join-tree-form" role="form" aria-label="Join family tree with invite code">
            <InviteCodeInput
              value={inviteCode}
              onChange={setInviteCode}
              error={error}
              placeholder="Enter Invite Code (e.g. RIV-2025)"
            />

            <Button
              variant="primary"
              size="large"
              onClick={handleJoinTree}
              disabled={isValidating || !inviteCode.trim()}
              className="join-tree-button"
              aria-label={isValidating ? 'Validating invite code, please wait' : 'Join family tree with invite code'}
            >
              {isValidating ? 'Validating...' : 'Join Family Tree'}
              {!isValidating && (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '8px' }} aria-hidden="true">
                  <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </Button>
          </div>

          <div className="join-tree-divider">
            <span>OR</span>
          </div>

          <button className="join-tree-search-link" onClick={handleSearchMembers} aria-label="Search for a family member to join their tree">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2"/>
              <path d="M14 14L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Search for a family member
          </button>
        </div>

        {/* Pending Invitations */}
        {isLoadingInvitations && (
          <div className="pending-invitations-section" aria-labelledby="pending-invitations-title">
            <h2 id="pending-invitations-title" className="pending-invitations-title">PENDING INVITATIONS</h2>
            <div className="loading-invitations" role="status" aria-live="polite">
              Loading invitations...
            </div>
          </div>
        )}
        
        {!isLoadingInvitations && pendingInvitations.length > 0 && (
          <div className="pending-invitations-section" aria-labelledby="pending-invitations-title">
            <h2 id="pending-invitations-title" className="pending-invitations-title">PENDING INVITATIONS</h2>
            
            <div className="pending-invitations-list" role="list">
              {pendingInvitations.map((invitation) => (
                <div key={invitation.id} className="invitation-card" role="listitem" aria-label={`Invitation to join ${invitation.treeName}`}>
                  <div className="invitation-avatar" aria-hidden="true">
                    {invitation.treeName.charAt(0).toUpperCase()}
                  </div>
                  <div className="invitation-info">
                    <h3 className="invitation-tree-name">{invitation.treeName}</h3>
                    <p className="invitation-details">
                      Invited by {invitation.inviterName} • {getTimeAgo(invitation.createdAt)}
                    </p>
                  </div>
                  <div className="invitation-actions">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleDeclineInvitation(invitation.id)}
                      disabled={isJoining}
                      aria-label={`Decline invitation to ${invitation.treeName}`}
                    >
                      Decline
                    </Button>
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => handleAcceptInvitation(invitation.id)}
                      disabled={isJoining}
                      aria-label={`Accept invitation to ${invitation.treeName}`}
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinFamilyTreePage;
