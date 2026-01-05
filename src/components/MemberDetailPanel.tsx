import React, { useMemo } from 'react';
import RelationshipExplorer from './RelationshipExplorer';
import TreeStatistics from './TreeStatistics';
import './MemberDetailPanel.scss';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  photoUrl?: string;
  location?: string;
}

interface Relationship {
  id: string;
  fromUserId: string;
  toUserId: string;
  relationshipType: string;
  specificLabel?: string;
}

interface MemberDetailPanelProps {
  selectedMember?: Member | null;
  allMembers?: Member[];
  relationships?: Relationship[];
  treeOwner?: Member | null;
  onProfileClick: () => void;
  onEditClick: () => void;
  onAddRelativeClick: () => void;
  onRelatedMemberClick: (memberId: string) => void;
  onTracePath: (startId: string, targetId: string) => void;
}

interface RelatedMemberInfo {
  member: Member;
  relationship: Relationship;
}

/**
 * MemberDetailPanel component displays detailed information about a selected family member
 * in the sidebar, including their photo, personal details, action buttons, and related members.
 */
const MemberDetailPanel: React.FC<MemberDetailPanelProps> = ({ 
  selectedMember, 
  allMembers = [],
  relationships = [],
  treeOwner,
  onProfileClick, 
  onEditClick, 
  onAddRelativeClick,
  onRelatedMemberClick,
  onTracePath 
}) => {
  // Extract birth year from dateOfBirth
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

  // Get initials for a member
  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Get relationship label for display
  const getRelationshipLabel = (relationship: Relationship): string => {
    const typeLabels: Record<string, string> = {
      parent: 'Parent',
      child: 'Child',
      sibling: 'Sibling',
      spouse: 'Spouse',
      grandparent: 'Grandparent',
      grandchild: 'Grandchild',
      aunt: 'Aunt',
      uncle: 'Uncle',
      cousin: 'Cousin',
      other: 'Relative'
    };
    
    return relationship.specificLabel || typeLabels[relationship.relationshipType] || 'Relative';
  };

  // Find all related members
  const relatedMembers = useMemo((): RelatedMemberInfo[] => {
    if (!selectedMember || !relationships || !allMembers) return [];

    const related: RelatedMemberInfo[] = [];
    const relatedIds = new Set<string>();

    // Find relationships where this member is involved
    relationships.forEach(rel => {
      let relatedMemberId: string | null = null;
      let relationshipInfo: Relationship | null = null;

      if (rel.fromUserId === selectedMember.id) {
        relatedMemberId = rel.toUserId;
        relationshipInfo = rel;
      } else if (rel.toUserId === selectedMember.id) {
        relatedMemberId = rel.fromUserId;
        relationshipInfo = rel;
      }

      if (relatedMemberId && !relatedIds.has(relatedMemberId) && relationshipInfo) {
        const relatedMember = allMembers.find(m => m.id === relatedMemberId);
        if (relatedMember) {
          relatedIds.add(relatedMemberId);
          related.push({
            member: relatedMember,
            relationship: relationshipInfo
          });
        }
      }
    });

    return related;
  }, [selectedMember, relationships, allMembers]);

  if (!selectedMember) {
    return null;
  }

  const birthYear = getBirthYear(selectedMember.dateOfBirth);

  return (
    <div className="member-detail-panel">
      {/* Member Profile Section */}
      <div className="member-detail-header">
        <div className="member-detail-photo-container">
          {selectedMember.photoUrl ? (
            <img 
              src={selectedMember.photoUrl} 
              alt={`${selectedMember.firstName} ${selectedMember.lastName}`}
              className="member-detail-photo"
              loading="lazy"
            />
          ) : (
            <div className="member-detail-photo-placeholder">
              {getInitials(selectedMember.firstName, selectedMember.lastName)}
            </div>
          )}
        </div>
        
        <div className="member-detail-info">
          <h2 className="member-detail-name">
            {selectedMember.firstName} {selectedMember.lastName}
          </h2>
          {birthYear && (
            <p className="member-detail-birth-year">Born {birthYear}</p>
          )}
          {selectedMember.location && (
            <p className="member-detail-location">{selectedMember.location}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="member-detail-actions">
        <button 
          className="member-detail-action-button primary"
          onClick={onProfileClick}
          aria-label="View member profile"
        >
          Profile
        </button>
        <button 
          className="member-detail-action-button secondary"
          onClick={onEditClick}
          aria-label="Edit member information"
        >
          Edit
        </button>
      </div>

      <button 
        className="member-detail-add-relative-button"
        onClick={onAddRelativeClick}
        aria-label="Add relative to this member"
      >
        <span className="add-relative-icon">+</span>
        <span className="add-relative-text">Add Relative</span>
      </button>

      {/* Related Members List */}
      {relatedMembers.length > 0 && (
        <div className="member-detail-related">
          <h3 className="member-detail-related-heading">Related Members</h3>
          <div className="member-detail-related-list">
            {relatedMembers.map(({ member, relationship }) => (
              <div 
                key={member.id}
                className="related-member-item"
                onClick={() => onRelatedMemberClick(member.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onRelatedMemberClick(member.id);
                  }
                }}
                aria-label={`View ${member.firstName} ${member.lastName}, ${getRelationshipLabel(relationship)}`}
              >
                <div className="related-member-photo-container">
                  {member.photoUrl ? (
                    <img 
                      src={member.photoUrl} 
                      alt={`${member.firstName} ${member.lastName}`}
                      className="related-member-photo"
                      loading="lazy"
                    />
                  ) : (
                    <div className="related-member-photo-placeholder">
                      {getInitials(member.firstName, member.lastName)}
                    </div>
                  )}
                  <div className="related-member-initials-badge">
                    {getInitials(member.firstName, member.lastName)}
                  </div>
                </div>
                <div className="related-member-info">
                  <p className="related-member-name">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="related-member-relationship">
                    {getRelationshipLabel(relationship)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Relationship Explorer */}
      {treeOwner && (
        <RelationshipExplorer
          startMember={treeOwner}
          allMembers={allMembers}
          relationships={relationships}
          onTracePath={onTracePath}
        />
      )}

      {/* Tree Statistics */}
      {treeOwner && allMembers && allMembers.length > 0 && (
        <TreeStatistics
          members={allMembers}
          relationships={relationships}
          rootMemberId={treeOwner.id}
        />
      )}
    </div>
  );
};

export default MemberDetailPanel;