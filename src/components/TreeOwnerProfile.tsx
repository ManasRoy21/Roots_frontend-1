import React from 'react';
import './TreeOwnerProfile.scss';

interface TreeOwner {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  photoUrl?: string;
}

interface TreeOwnerProfileProps {
  treeOwner: TreeOwner;
  onAddParents: () => void;
  onAddSpouse: () => void;
  onAddChildren: () => void;
  hasSpouse?: boolean;
}

/**
 * TreeOwnerProfile component displays the tree owner's profile information
 * in the sidebar, including their photo, name, and birth year.
 */
const TreeOwnerProfile: React.FC<TreeOwnerProfileProps> = ({ 
  treeOwner, 
  onAddParents, 
  onAddSpouse, 
  onAddChildren, 
  hasSpouse = false 
}) => {
  // Extract birth year from dateOfBirth (format: YYYY-MM-DD or DD/MM/YYYY)
  const getBirthYear = (dateOfBirth?: string): string | null => {
    if (!dateOfBirth) return null;
    
    // Try parsing as YYYY-MM-DD format first
    const isoMatch = dateOfBirth.match(/^(\d{4})-\d{2}-\d{2}$/);
    if (isoMatch) {
      return isoMatch[1];
    }
    
    // Try parsing as DD/MM/YYYY format
    const dmyMatch = dateOfBirth.match(/^\d{2}\/\d{2}\/(\d{4})$/);
    if (dmyMatch) {
      return dmyMatch[1];
    }
    
    // Fallback: try to extract any 4-digit year
    const yearMatch = dateOfBirth.match(/\d{4}/);
    return yearMatch ? yearMatch[0] : null;
  };

  const birthYear = getBirthYear(treeOwner.dateOfBirth);

  return (
    <div className="tree-owner-profile">
      <div className="tree-owner-header">
        <div className="tree-owner-photo-container">
          {treeOwner.photoUrl ? (
            <img 
              src={treeOwner.photoUrl} 
              alt={`${treeOwner.firstName} ${treeOwner.lastName}`}
              className="tree-owner-photo"
              loading="lazy"
            />
          ) : (
            <div className="tree-owner-photo-placeholder">
              {treeOwner.firstName.charAt(0)}{treeOwner.lastName.charAt(0)}
            </div>
          )}
        </div>
        <div className="tree-owner-info">
          <h2 className="tree-owner-name">
            {treeOwner.firstName} {treeOwner.lastName}
          </h2>
          <p className="tree-owner-label">Tree Owner</p>
          {birthYear && (
            <p className="tree-owner-birth-year">Born {birthYear}</p>
          )}
        </div>
      </div>

      <div className="tree-owner-actions">
        <h3 className="tree-owner-actions-heading">GROW YOUR TREE</h3>
        <p className="tree-owner-actions-description">
          You are the first person in this tree. Start adding your immediate family to build your history.
        </p>
        <div className="tree-owner-action-buttons">
          <button 
            className="tree-owner-action-button"
            onClick={onAddParents}
            aria-label="Add parents to family tree"
          >
            <svg className="action-button-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <div className="action-button-content">
              <span className="action-button-text">Add Parents</span>
              <span className="action-button-subtext">Father & Mother</span>
            </div>
          </button>
          <button 
            className="tree-owner-action-button"
            onClick={onAddSpouse}
            aria-label={hasSpouse ? "View spouse" : "Add spouse to family tree"}
            disabled={hasSpouse}
          >
            <svg className="action-button-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <div className="action-button-content">
              <span className="action-button-text">
                {hasSpouse ? 'Spouse Added' : 'Add Spouse'}
              </span>
              <span className="action-button-subtext">Partner / Wife / Husband</span>
            </div>
          </button>
          <button 
            className="tree-owner-action-button"
            onClick={onAddChildren}
            aria-label="Add children to family tree"
          >
            <svg className="action-button-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="9" cy="7" r="4" strokeWidth="2"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
            </svg>
            <div className="action-button-content">
              <span className="action-button-text">Add Children</span>
              <span className="action-button-subtext">Son / Daughter</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TreeOwnerProfile;