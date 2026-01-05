import React from 'react';
import MemberCard from './MemberCard';
import PlaceholderCard from './PlaceholderCard';
import ConnectionLines from './ConnectionLines';
import { TreeNodeProps, FamilyMember } from '../types/components';
import './TreeNode.scss';

const TreeNode: React.FC<TreeNodeProps> = ({ 
  node,
  allMembers,
  relationships,
  isRoot = false, 
  isSelected = false, 
  isHighlighted = false, 
  onMemberClick, 
  onPlaceholderClick,
  showPlaceholders = true,
  depth = 0,
  maxDepth = 1,
  zoomLevel = 100,
  searchResults = [],
  rootCardRef
}) => {
  if (!node) {
    return null;
  }

  const { member, parents, children, spouse } = node;

  // Helper function to check if a member should be highlighted
  const isMemberHighlighted = (memberId: string): boolean => {
    return searchResults.length > 0 && searchResults.includes(memberId);
  };

  // Helper function to check if a member should be dimmed (when search is active but member doesn't match)
  const isMemberDimmed = (memberId: string): boolean => {
    return searchResults.length > 0 && !searchResults.includes(memberId);
  };

  // Determine relationship label
  const getRelationshipLabel = (relationMember: FamilyMember, relationType: string): string => {
    if (isRoot && relationMember.id === member.id) {
      return 'Me / Root';
    }
    
    // Determine label based on relationship type
    switch (relationType) {
      case 'father':
        return 'Father';
      case 'mother':
        return 'Mother';
      case 'spouse':
        return relationMember.gender === 'male' ? 'Husband' : 'Wife';
      case 'child':
        return relationMember.gender === 'male' ? 'Son' : 'Daughter';
      default:
        return 'Family Member';
    }
  };

  // Check if parents exist
  const hasFather = parents.some(p => p.member.gender === 'male');
  const hasMother = parents.some(p => p.member.gender === 'female');
  const hasSpouse = spouse !== null;
  const shouldRecurse = depth < maxDepth;

  return (
    <div className="tree-node">
      {/* Connection Lines */}
      <ConnectionLines node={node} zoomLevel={zoomLevel} />
      
      {/* Parents Section */}
      {(parents.length > 0 || showPlaceholders) && (
        <div className="tree-node-parents">
          {/* Father */}
          {hasFather ? (
            parents
              .filter(p => p.member.gender === 'male')
              .map(parent => (
                <div key={parent.member.id} className="tree-node-parent">
                  <MemberCard
                    member={parent.member}
                    relationshipLabel={getRelationshipLabel(parent.member, 'father')}
                    isRoot={false}
                    isSelected={parent.member.id === (isSelected ? member.id : null)}
                    isHighlighted={isMemberHighlighted(parent.member.id)}
                    isDimmed={isMemberDimmed(parent.member.id)}
                    onClick={onMemberClick}
                  />
                </div>
              ))
          ) : showPlaceholders && (
            <div className="tree-node-parent">
              <PlaceholderCard
                type="father"
                label="Add Father"
                onClick={() => onPlaceholderClick && onPlaceholderClick('father', member.id)}
              />
            </div>
          )}

          {/* Mother */}
          {hasMother ? (
            parents
              .filter(p => p.member.gender === 'female')
              .map(parent => (
                <div key={parent.member.id} className="tree-node-parent">
                  <MemberCard
                    member={parent.member}
                    relationshipLabel={getRelationshipLabel(parent.member, 'mother')}
                    isRoot={false}
                    isSelected={parent.member.id === (isSelected ? member.id : null)}
                    isHighlighted={isMemberHighlighted(parent.member.id)}
                    isDimmed={isMemberDimmed(parent.member.id)}
                    onClick={onMemberClick}
                  />
                </div>
              ))
          ) : showPlaceholders && (
            <div className="tree-node-parent">
              <PlaceholderCard
                type="mother"
                label="Add Mother"
                onClick={() => onPlaceholderClick && onPlaceholderClick('mother', member.id)}
              />
            </div>
          )}
        </div>
      )}

      {/* Current Member and Spouse Section */}
      <div className="tree-node-current">
        <div className="tree-node-member-row">
          {/* Current Member */}
          <div className="tree-node-member">
            <MemberCard
              ref={isRoot ? rootCardRef : null}
              member={member}
              relationshipLabel={getRelationshipLabel(member, isRoot ? 'root' : 'member')}
              isRoot={isRoot}
              isSelected={isSelected}
              isHighlighted={isMemberHighlighted(member.id)}
              isDimmed={isMemberDimmed(member.id)}
              onClick={onMemberClick}
            />
          </div>

          {/* Spouse */}
          {hasSpouse ? (
            <div className="tree-node-spouse">
              <MemberCard
                member={spouse.member}
                relationshipLabel={getRelationshipLabel(spouse.member, 'spouse')}
                isRoot={false}
                isSelected={spouse.member.id === (isSelected ? member.id : null)}
                isHighlighted={isMemberHighlighted(spouse.member.id)}
                isDimmed={isMemberDimmed(spouse.member.id)}
                onClick={onMemberClick}
              />
            </div>
          ) : showPlaceholders && (
            <div className="tree-node-spouse">
              <PlaceholderCard
                type="spouse"
                label="Add Spouse"
                onClick={() => onPlaceholderClick && onPlaceholderClick('spouse', member.id)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Children Section */}
      {(children.length > 0 || showPlaceholders) && (
        <div className="tree-node-children">
          {children.map(child => (
            <div key={child.member.id} className="tree-node-child">
              <MemberCard
                member={child.member}
                relationshipLabel={getRelationshipLabel(child.member, 'child')}
                isRoot={false}
                isSelected={child.member.id === (isSelected ? member.id : null)}
                isHighlighted={isMemberHighlighted(child.member.id)}
                isDimmed={isMemberDimmed(child.member.id)}
                onClick={onMemberClick}
              />
            </div>
          ))}
          {showPlaceholders && (
            <div className="tree-node-child">
              <PlaceholderCard
                type="child"
                label="Add Child"
                onClick={() => onPlaceholderClick && onPlaceholderClick('child', member.id)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Memoize TreeNode to prevent unnecessary re-renders
export default React.memo(TreeNode);
