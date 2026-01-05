/**
 * Tree Layout Algorithm
 * Calculates node positions for family tree visualization
 */

import { FamilyMember, Relationship } from '../types/components';

const CARD_WIDTH = 200;
const CARD_HEIGHT = 120;
const HORIZONTAL_SPACING = 40;
const VERTICAL_SPACING = 80;

// Internal interfaces for tree structure
interface TreeNode {
  member: FamilyMember;
  parents: TreeNode[];
  children: TreeNode[];
  spouse: TreeNode | null;
  siblings: TreeNode[];
  level: number;
  position: { x: number; y: number };
}

interface Position {
  x: number;
  y: number;
}

interface TreeStatistics {
  memberCount: number;
  generationCount: number;
}

interface RelationshipEdge {
  memberId: string;
  type: string;
}

/**
 * Build a tree structure from family members and relationships
 * @param members - Array of family member objects
 * @param relationships - Array of relationship objects
 * @param rootMemberId - ID of the root member (tree owner)
 * @returns Tree node structure or null if no members or root not found
 */
export function buildTreeStructure(
  members: FamilyMember[], 
  relationships: Relationship[], 
  rootMemberId: string
): TreeNode | null {
  if (!members || members.length === 0) {
    return null;
  }

  const memberMap = new Map(members.map(m => [m.id, m]));
  const nodeMap = new Map<string, TreeNode>();

  // Initialize nodes
  members.forEach(member => {
    nodeMap.set(member.id, {
      member,
      parents: [],
      children: [],
      spouse: null,
      siblings: [],
      level: 0,
      position: { x: 0, y: 0 }
    });
  });

  // Build relationships
  relationships.forEach(rel => {
    const fromNode = nodeMap.get(rel.fromUserId);
    const toNode = nodeMap.get(rel.toUserId);
    
    if (!fromNode || !toNode) return;

    switch (rel.relationshipType) {
      case 'parent':
        // fromUser is parent of toUser
        toNode.parents.push(fromNode);
        if (!fromNode.children.includes(toNode)) {
          fromNode.children.push(toNode);
        }
        break;
      case 'child':
        // fromUser is child of toUser
        fromNode.parents.push(toNode);
        if (!toNode.children.includes(fromNode)) {
          toNode.children.push(fromNode);
        }
        break;
      case 'spouse':
        // Bidirectional spouse relationship
        fromNode.spouse = toNode;
        toNode.spouse = fromNode;
        break;
      case 'sibling':
        // Bidirectional sibling relationship
        if (!fromNode.siblings.includes(toNode)) {
          fromNode.siblings.push(toNode);
        }
        if (!toNode.siblings.includes(fromNode)) {
          toNode.siblings.push(fromNode);
        }
        break;
    }
  });

  const rootNode = nodeMap.get(rootMemberId);
  if (!rootNode) {
    return null;
  }

  // Calculate levels (generations)
  calculateLevels(rootNode, 0, new Set<string>());

  return rootNode;
}

/**
 * Calculate generation levels for each node
 * @param node - Tree node
 * @param level - Current level
 * @param visited - Set of visited node IDs
 */
function calculateLevels(node: TreeNode, level: number, visited: Set<string>): void {
  if (!node || visited.has(node.member.id)) {
    return;
  }

  visited.add(node.member.id);
  node.level = level;

  // Parents are one level up (negative)
  node.parents.forEach(parent => {
    calculateLevels(parent, level - 1, visited);
  });

  // Children are one level down (positive)
  node.children.forEach(child => {
    calculateLevels(child, level + 1, visited);
  });

  // Spouse is at the same level
  if (node.spouse) {
    calculateLevels(node.spouse, level, visited);
  }
}

/**
 * Calculate positions for all nodes in the tree
 * @param rootNode - Root tree node
 * @returns Map of member ID to position {x, y}
 */
export function calculateTreeLayout(rootNode: TreeNode | null): Map<string, Position> {
  if (!rootNode) {
    return new Map();
  }

  const positions = new Map<string, Position>();
  const levelNodes = new Map<number, TreeNode[]>(); // level -> array of nodes

  // Collect nodes by level
  collectNodesByLevel(rootNode, levelNodes, new Set<string>());

  // Calculate positions level by level
  const levels = Array.from(levelNodes.keys()).sort((a, b) => a - b);
  
  levels.forEach(level => {
    const nodes = levelNodes.get(level)!;
    const levelWidth = nodes.length * (CARD_WIDTH + HORIZONTAL_SPACING) - HORIZONTAL_SPACING;
    const startX = -levelWidth / 2;

    nodes.forEach((node, index) => {
      const x = startX + index * (CARD_WIDTH + HORIZONTAL_SPACING);
      const y = level * (CARD_HEIGHT + VERTICAL_SPACING);
      
      positions.set(node.member.id, { x, y });
      node.position = { x, y };
    });
  });

  return positions;
}

/**
 * Collect all nodes organized by level
 * @param node - Tree node
 * @param levelNodes - Map of level to nodes
 * @param visited - Set of visited node IDs
 */
function collectNodesByLevel(
  node: TreeNode, 
  levelNodes: Map<number, TreeNode[]>, 
  visited: Set<string>
): void {
  if (!node || visited.has(node.member.id)) {
    return;
  }

  visited.add(node.member.id);

  if (!levelNodes.has(node.level)) {
    levelNodes.set(node.level, []);
  }
  levelNodes.get(node.level)!.push(node);

  // Traverse all connected nodes
  node.parents.forEach(parent => collectNodesByLevel(parent, levelNodes, visited));
  node.children.forEach(child => collectNodesByLevel(child, levelNodes, visited));
  if (node.spouse) {
    collectNodesByLevel(node.spouse, levelNodes, visited);
  }
}

/**
 * Calculate tree statistics
 * @param members - Array of family member objects
 * @param rootNode - Root tree node
 * @returns Statistics object with memberCount and generationCount
 */
export function calculateTreeStatistics(
  members: FamilyMember[], 
  rootNode: TreeNode | null
): TreeStatistics {
  const memberCount = members ? members.length : 0;
  
  let generationCount = 0;
  if (rootNode) {
    const levels = new Set<number>();
    collectLevels(rootNode, levels, new Set<string>());
    generationCount = levels.size;
  }

  return {
    memberCount,
    generationCount
  };
}

/**
 * Collect all unique levels in the tree
 * @param node - Tree node
 * @param levels - Set of levels
 * @param visited - Set of visited node IDs
 */
function collectLevels(node: TreeNode, levels: Set<number>, visited: Set<string>): void {
  if (!node || visited.has(node.member.id)) {
    return;
  }

  visited.add(node.member.id);
  levels.add(node.level);

  node.parents.forEach(parent => collectLevels(parent, levels, visited));
  node.children.forEach(child => collectLevels(child, levels, visited));
  if (node.spouse) {
    collectLevels(node.spouse, levels, visited);
  }
}

/**
 * Find a path between two members in the tree
 * @param startMemberId - Starting member ID
 * @param endMemberId - Target member ID
 * @param relationships - Array of relationship objects
 * @param members - Array of family member objects
 * @returns Array of member IDs representing the path, or null if no path exists
 */
export function findRelationshipPath(
  startMemberId: string, 
  endMemberId: string, 
  relationships: Relationship[], 
  members: FamilyMember[]
): string[] | null {
  if (startMemberId === endMemberId) {
    return [startMemberId];
  }

  const memberMap = new Map(members.map(m => [m.id, m]));
  const adjacencyList = new Map<string, RelationshipEdge[]>();

  // Build adjacency list from relationships
  members.forEach(member => {
    adjacencyList.set(member.id, []);
  });

  relationships.forEach(rel => {
    if (!adjacencyList.has(rel.fromUserId)) {
      adjacencyList.set(rel.fromUserId, []);
    }
    if (!adjacencyList.has(rel.toUserId)) {
      adjacencyList.set(rel.toUserId, []);
    }

    // Add bidirectional edges
    adjacencyList.get(rel.fromUserId)!.push({
      memberId: rel.toUserId,
      type: rel.relationshipType
    });
    
    // Add reverse relationship
    const reverseType = getReverseRelationshipType(rel.relationshipType);
    adjacencyList.get(rel.toUserId)!.push({
      memberId: rel.fromUserId,
      type: reverseType
    });
  });

  // Breadth-first search to find shortest path
  const queue: string[][] = [[startMemberId]];
  const visited = new Set<string>([startMemberId]);

  while (queue.length > 0) {
    const path = queue.shift()!;
    const currentId = path[path.length - 1];

    if (currentId === endMemberId) {
      return path;
    }

    const neighbors = adjacencyList.get(currentId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.memberId)) {
        visited.add(neighbor.memberId);
        queue.push([...path, neighbor.memberId]);
      }
    }
  }

  return null; // No path found
}

/**
 * Get the reverse relationship type
 * @param type - Relationship type
 * @returns Reverse relationship type
 */
function getReverseRelationshipType(type: string): string {
  const reverseMap: Record<string, string> = {
    'parent': 'child',
    'child': 'parent',
    'spouse': 'spouse',
    'sibling': 'sibling',
    'grandparent': 'grandchild',
    'grandchild': 'grandparent'
  };
  return reverseMap[type] || type;
}