import React from 'react';
import './ConnectionLines.scss';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
}

interface TreeNode {
  member: Member;
  parents?: TreeNode[];
  spouse?: TreeNode;
  children?: TreeNode[];
}

interface ConnectionLinesProps {
  node?: TreeNode | null;
  zoomLevel?: number;
}

/**
 * ConnectionLines component draws SVG lines connecting family members
 * Handles parent-child, spouse, and sibling relationships
 */
const ConnectionLines: React.FC<ConnectionLinesProps> = ({ node, zoomLevel = 100 }) => {
  if (!node || !node.member) {
    return null;
  }

  const { parents, spouse, children } = node;
  
  // Scale factor based on zoom level
  const scale = zoomLevel / 100;
  
  // Line styling
  const lineStyle: React.CSSProperties = {
    stroke: '#cbd5e1',
    strokeWidth: 2 * scale,
    fill: 'none',
  };

  const renderLines = (): JSX.Element[] => {
    const lines: JSX.Element[] = [];

    // Parent-to-child vertical lines
    if (parents && parents.length > 0) {
      // Draw vertical line from parents section to current member
      // The line connects from the center point between parents down to the member
      lines.push(
        <line
          key="parent-to-member"
          x1="50%"
          y1="0"
          x2="50%"
          y2="40"
          style={lineStyle}
        />
      );

      // If both parents exist, draw horizontal line connecting them
      if (parents.length === 2) {
        lines.push(
          <line
            key="parents-horizontal"
            x1="30%"
            y1="0"
            x2="70%"
            y2="0"
            style={lineStyle}
          />
        );
      }
    }

    // Spouse horizontal line
    if (spouse) {
      lines.push(
        <line
          key="spouse-horizontal"
          x1="40%"
          y1="50%"
          x2="60%"
          y2="50%"
          style={lineStyle}
        />
      );
    }

    // Children lines
    if (children && children.length > 0) {
      // Draw vertical line from current member down to children level
      lines.push(
        <line
          key="member-to-children"
          x1="50%"
          y1="100%"
          x2="50%"
          y2="calc(100% + 40px)"
          style={lineStyle}
        />
      );

      // If multiple children, draw horizontal line connecting them
      if (children.length > 1) {
        const childSpacing = 100 / (children.length + 1);
        const firstChildX = childSpacing;
        const lastChildX = childSpacing * children.length;

        lines.push(
          <line
            key="children-horizontal"
            x1={`${firstChildX}%`}
            y1="calc(100% + 40px)"
            x2={`${lastChildX}%`}
            y2="calc(100% + 40px)"
            style={lineStyle}
          />
        );

        // Draw vertical lines from horizontal bar to each child
        children.forEach((child, index) => {
          const childX = childSpacing * (index + 1);
          lines.push(
            <line
              key={`child-vertical-${child.member.id}`}
              x1={`${childX}%`}
              y1="calc(100% + 40px)"
              x2={`${childX}%`}
              y2="calc(100% + 60px)"
              style={lineStyle}
            />
          );
        });
      } else if (children.length === 1) {
        // Single child - just extend the vertical line
        lines.push(
          <line
            key="single-child-vertical"
            x1="50%"
            y1="calc(100% + 40px)"
            x2="50%"
            y2="calc(100% + 60px)"
            style={lineStyle}
          />
        );
      }
    }

    return lines;
  };

  return (
    <svg className="connection-lines" style={{ transform: `scale(${scale})` }}>
      {renderLines()}
    </svg>
  );
};

export default ConnectionLines;