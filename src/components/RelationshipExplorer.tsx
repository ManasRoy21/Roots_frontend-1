import React, { useState } from 'react';
import { findRelationshipPath } from '../utils/relationshipPath';
import './RelationshipExplorer.scss';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
}

interface Relationship {
  id: string;
  fromUserId: string;
  toUserId: string;
  relationshipType: string;
  specificLabel?: string;
}

interface RelationshipExplorerProps {
  startMember?: Member | null;
  allMembers: Member[];
  relationships: Relationship[];
  onTracePath: (startId: string, targetId: string) => void;
}

/**
 * RelationshipExplorer component allows users to find and trace relationship paths
 * between two family members in the tree.
 */
const RelationshipExplorer: React.FC<RelationshipExplorerProps> = ({ 
  startMember, 
  allMembers, 
  relationships,
  onTracePath 
}) => {
  const [targetMemberId, setTargetMemberId] = useState<string>('');
  const [pathResult, setPathResult] = useState<any>(null);

  const handleTargetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetMemberId(e.target.value);
    // Clear previous path result when target changes
    setPathResult(null);
  };

  const handleTracePath = () => {
    if (targetMemberId && startMember) {
      // Calculate the path using BFS
      const result = findRelationshipPath(
        startMember.id,
        targetMemberId,
        relationships,
        allMembers
      );
      setPathResult(result);
      
      // Also call the parent callback if provided
      if (onTracePath) {
        onTracePath(startMember.id, targetMemberId);
      }
    }
  };

  // Filter out the start member from the dropdown
  const availableMembers = allMembers.filter(m => m.id !== startMember?.id);

  return (
    <div className="relationship-explorer">
      <h3 className="relationship-explorer-heading">Relationship Explorer</h3>
      
      <div className="relationship-explorer-fields">
        {/* Start Field */}
        <div className="relationship-explorer-field">
          <label htmlFor="start-member" className="relationship-explorer-label">
            Start
          </label>
          <div className="relationship-explorer-start-display">
            {startMember ? (
              <>
                {startMember.photoUrl ? (
                  <img 
                    src={startMember.photoUrl} 
                    alt={`${startMember.firstName} ${startMember.lastName}`}
                    className="relationship-explorer-photo"
                  />
                ) : (
                  <div className="relationship-explorer-photo-placeholder">
                    {startMember.firstName.charAt(0)}{startMember.lastName.charAt(0)}
                  </div>
                )}
                <span className="relationship-explorer-name">
                  {startMember.firstName} {startMember.lastName}
                </span>
              </>
            ) : (
              <span className="relationship-explorer-name">No member selected</span>
            )}
          </div>
        </div>

        {/* Target Field */}
        <div className="relationship-explorer-field">
          <label htmlFor="target-member" className="relationship-explorer-label">
            Target
          </label>
          <select
            id="target-member"
            className="relationship-explorer-select"
            value={targetMemberId}
            onChange={handleTargetChange}
            aria-label="Select target family member"
          >
            <option value="">Choose relative...</option>
            {availableMembers.map(member => (
              <option key={member.id} value={member.id}>
                {member.firstName} {member.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Trace Path Button */}
      <button
        className="relationship-explorer-button"
        onClick={handleTracePath}
        disabled={!targetMemberId}
        aria-label="Trace relationship path"
      >
        Trace Path
      </button>

      {/* Path Result Display */}
      {pathResult && (
        <div className="relationship-explorer-result">
          {pathResult.connected ? (
            <>
              <h4 className="relationship-explorer-result-title">Relationship Path:</h4>
              <p className="relationship-explorer-result-description">
                {pathResult.description}
              </p>
              {pathResult.path.length > 0 && (
                <div className="relationship-explorer-path-steps">
                  {pathResult.path.map((step: any, index: number) => (
                    <div key={index} className="relationship-explorer-path-step">
                      <span className="relationship-explorer-path-arrow">→</span>
                      <span className="relationship-explorer-path-member">
                        {step.member.firstName} {step.member.lastName}
                      </span>
                      <span className="relationship-explorer-path-relationship">
                        ({step.relationship})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="relationship-explorer-not-connected">
              <p className="relationship-explorer-result-description">
                These family members are not connected in the tree.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RelationshipExplorer;