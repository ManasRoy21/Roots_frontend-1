/**
 * Utility functions for calculating relationship paths between family members
 */

import { FamilyMember, Relationship } from '../types/components';

// Internal interfaces for relationship graph
interface RelationshipEdge {
  memberId: string;
  relationshipType: string;
  specificLabel?: string;
  direction: 'forward' | 'reverse';
}

interface PathStep {
  member: FamilyMember;
  relationship: string;
}

interface RelationshipPath {
  path: PathStep[];
  description: string;
  connected: boolean;
}

/**
 * Builds a graph representation of family relationships
 * @param relationships - Array of relationship objects
 * @returns Map of member IDs to their connected members with relationship types
 */
function buildRelationshipGraph(relationships: Relationship[]): Map<string, RelationshipEdge[]> {
  const graph = new Map<string, RelationshipEdge[]>();

  relationships.forEach(rel => {
    // Add forward edge
    if (!graph.has(rel.fromUserId)) {
      graph.set(rel.fromUserId, []);
    }
    graph.get(rel.fromUserId)!.push({
      memberId: rel.toUserId,
      relationshipType: rel.relationshipType,
      specificLabel: rel.specificLabel,
      direction: 'forward'
    });

    // Add reverse edge (relationships are bidirectional)
    if (!graph.has(rel.toUserId)) {
      graph.set(rel.toUserId, []);
    }
    graph.get(rel.toUserId)!.push({
      memberId: rel.fromUserId,
      relationshipType: getInverseRelationship(rel.relationshipType),
      specificLabel: rel.specificLabel,
      direction: 'reverse'
    });
  });

  return graph;
}

/**
 * Gets the inverse relationship type
 * @param relationshipType - The original relationship type
 * @returns The inverse relationship type
 */
function getInverseRelationship(relationshipType: string): string {
  const inverseMap: Record<string, string> = {
    'parent': 'child',
    'child': 'parent',
    'spouse': 'spouse',
    'sibling': 'sibling',
    'grandparent': 'grandchild',
    'grandchild': 'grandparent',
    'aunt': 'nephew/niece',
    'uncle': 'nephew/niece',
    'cousin': 'cousin',
    'other': 'other'
  };

  return inverseMap[relationshipType] || relationshipType;
}

/**
 * Finds the shortest path between two family members using BFS
 * @param startId - ID of the starting member
 * @param targetId - ID of the target member
 * @param relationships - Array of relationship objects
 * @param allMembers - Array of all family member objects
 * @returns Path object with members and relationships, or null if not connected
 */
export function findRelationshipPath(
  startId: string, 
  targetId: string, 
  relationships: Relationship[], 
  allMembers: FamilyMember[]
): RelationshipPath {
  if (startId === targetId) {
    return {
      path: [],
      description: 'Same person',
      connected: true
    };
  }

  const graph = buildRelationshipGraph(relationships);
  
  // BFS to find shortest path
  const queue: string[][] = [[startId]];
  const visited = new Set<string>([startId]);

  while (queue.length > 0) {
    const path = queue.shift()!;
    const currentId = path[path.length - 1];

    // Get neighbors
    const neighbors = graph.get(currentId) || [];

    for (const neighbor of neighbors) {
      if (neighbor.memberId === targetId) {
        // Found the target! Build the complete path
        const completePath = [...path, targetId];
        return buildPathDescription(completePath, graph, allMembers);
      }

      if (!visited.has(neighbor.memberId)) {
        visited.add(neighbor.memberId);
        queue.push([...path, neighbor.memberId]);
      }
    }
  }

  // No path found
  return {
    path: [],
    description: 'Not connected',
    connected: false
  };
}

/**
 * Builds a human-readable description of the relationship path
 * @param pathIds - Array of member IDs in the path
 * @param graph - Relationship graph
 * @param allMembers - Array of all family member objects
 * @returns Path object with description
 */
function buildPathDescription(
  pathIds: string[], 
  graph: Map<string, RelationshipEdge[]>, 
  allMembers: FamilyMember[]
): RelationshipPath {
  const memberMap = new Map(allMembers.map(m => [m.id, m]));
  const pathSteps: PathStep[] = [];

  for (let i = 0; i < pathIds.length - 1; i++) {
    const fromId = pathIds[i];
    const toId = pathIds[i + 1];
    const fromMember = memberMap.get(fromId);
    const toMember = memberMap.get(toId);

    // Find the relationship between these two members
    const neighbors = graph.get(fromId) || [];
    const relationship = neighbors.find(n => n.memberId === toId);

    if (fromMember && toMember && relationship) {
      pathSteps.push({
        member: toMember,
        relationship: relationship.specificLabel || formatRelationshipType(relationship.relationshipType)
      });
    }
  }

  // Build description string
  const description = pathSteps
    .map(step => `${step.member.firstName} ${step.member.lastName} (${step.relationship})`)
    .join(' → ');

  return {
    path: pathSteps,
    description: description || 'Connected',
    connected: true
  };
}

/**
 * Formats a relationship type into a human-readable label
 * @param relationshipType - The relationship type
 * @returns Formatted relationship label
 */
function formatRelationshipType(relationshipType: string): string {
  const labelMap: Record<string, string> = {
    'parent': 'Parent',
    'child': 'Child',
    'spouse': 'Spouse',
    'sibling': 'Sibling',
    'grandparent': 'Grandparent',
    'grandchild': 'Grandchild',
    'aunt': 'Aunt',
    'uncle': 'Uncle',
    'cousin': 'Cousin',
    'nephew/niece': 'Nephew/Niece',
    'other': 'Relative'
  };

  return labelMap[relationshipType] || relationshipType;
}