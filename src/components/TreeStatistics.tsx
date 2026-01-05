import React, { useMemo } from 'react';
import { buildTreeStructure, calculateTreeStatistics } from '../utils/treeLayout';
import './TreeStatistics.scss';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
}

interface Relationship {
  id: string;
  fromUserId: string;
  toUserId: string;
  relationshipType: string;
}

interface TreeStatisticsProps {
  members: Member[];
  relationships: Relationship[];
  rootMemberId: string;
}

interface Statistics {
  memberCount: number;
  generationCount: number;
}

/**
 * TreeStatistics component displays statistics about the family tree,
 * including total member count and generation count.
 */
const TreeStatistics: React.FC<TreeStatisticsProps> = ({ members, relationships, rootMemberId }) => {
  // Calculate statistics whenever members or relationships change
  const statistics: Statistics = useMemo(() => {
    if (!members || members.length === 0) {
      return { memberCount: 0, generationCount: 0 };
    }

    const rootNode = buildTreeStructure(members, relationships, rootMemberId);
    return calculateTreeStatistics(members, rootNode);
  }, [members, relationships, rootMemberId]);

  // Format member count with appropriate label
  const formatMemberCount = (count: number): string => {
    if (count === 0) return '0 Members';
    if (count === 1) return '1 Member';
    return `${count} Members`;
  };

  // Format generation count with appropriate label
  const formatGenerationCount = (count: number): string => {
    if (count === 0) return '0 Generations';
    if (count === 1) return '1 Generation';
    return `${count} Generations`;
  };

  return (
    <div className="tree-statistics">
      <h3 className="tree-statistics-heading">Tree Statistics</h3>
      <div className="tree-statistics-content">
        <div className="tree-statistic-item">
          <span className="tree-statistic-label">Total Members</span>
          <span className="tree-statistic-value" aria-label={formatMemberCount(statistics.memberCount)}>
            {formatMemberCount(statistics.memberCount)}
          </span>
        </div>
        <div className="tree-statistic-item">
          <span className="tree-statistic-label">Generations</span>
          <span className="tree-statistic-value" aria-label={formatGenerationCount(statistics.generationCount)}>
            {formatGenerationCount(statistics.generationCount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TreeStatistics;