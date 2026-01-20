import React from 'react';
import './TreeOverview.scss';

interface TreeOverviewProps {
  memberCount?: number;
  generationCount?: number;
  onTreeClick?: (type: 'members' | 'generations') => void;
}

const TreeOverview: React.FC<TreeOverviewProps> = ({ 
  memberCount = 0, 
  generationCount = 0, 
  onTreeClick 
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>, type: 'members' | 'generations') => {
    if (e.key === 'Enter' || e.key === ' ') {
      onTreeClick && onTreeClick(type);
    }
  };

  return (
    <section className="dashboard-section tree-overview">
      <h2>Tree Overview</h2>
      <div className="tree-stats">
        <div 
          className="stat-card" 
          onClick={() => onTreeClick && onTreeClick('members')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => handleKeyPress(e, 'members')}
        >
          <div className="stat-value">{memberCount}</div>
          <div className="stat-label">Members</div>
        </div>
        <div 
          className="stat-card"
          onClick={() => onTreeClick && onTreeClick('generations')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => handleKeyPress(e, 'generations')}
        >
          <div className="stat-value">{generationCount}</div>
          <div className="stat-label">Generations</div>
        </div>
      </div>
    </section>
  );
};

export default TreeOverview;