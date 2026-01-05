import { describe, it, expect } from 'vitest';
import { findRelationshipPath } from './relationshipPath';

describe('relationshipPath', () => {
  describe('findRelationshipPath', () => {
    it('should find direct parent-child relationship', () => {
      const members = [
        { id: '1', firstName: 'John', lastName: 'Doe' },
        { id: '2', firstName: 'Jane', lastName: 'Doe' }
      ];
      
      const relationships = [
        { 
          id: 'r1', 
          fromUserId: '1', 
          toUserId: '2', 
          relationshipType: 'parent',
          specificLabel: null
        }
      ];

      const result = findRelationshipPath('1', '2', relationships, members);
      
      expect(result.connected).toBe(true);
      expect(result.path).toHaveLength(1);
      expect(result.path[0].member.id).toBe('2');
      expect(result.path[0].relationship).toBe('Parent');
    });

    it('should find path through multiple relationships', () => {
      const members = [
        { id: '1', firstName: 'Grandparent', lastName: 'Smith' },
        { id: '2', firstName: 'Parent', lastName: 'Smith' },
        { id: '3', firstName: 'Child', lastName: 'Smith' }
      ];
      
      const relationships = [
        { 
          id: 'r1', 
          fromUserId: '1', 
          toUserId: '2', 
          relationshipType: 'parent',
          specificLabel: null
        },
        { 
          id: 'r2', 
          fromUserId: '2', 
          toUserId: '3', 
          relationshipType: 'parent',
          specificLabel: null
        }
      ];

      const result = findRelationshipPath('1', '3', relationships, members);
      
      expect(result.connected).toBe(true);
      expect(result.path).toHaveLength(2);
      expect(result.path[0].member.id).toBe('2');
      expect(result.path[1].member.id).toBe('3');
    });

    it('should return not connected when no path exists', () => {
      const members = [
        { id: '1', firstName: 'John', lastName: 'Doe' },
        { id: '2', firstName: 'Jane', lastName: 'Smith' }
      ];
      
      const relationships: any[] = [];

      const result = findRelationshipPath('1', '2', relationships, members);
      
      expect(result.connected).toBe(false);
      expect(result.description).toBe('Not connected');
      expect(result.path).toHaveLength(0);
    });

    it('should handle same person', () => {
      const members = [
        { id: '1', firstName: 'John', lastName: 'Doe' }
      ];
      
      const relationships: any[] = [];

      const result = findRelationshipPath('1', '1', relationships, members);
      
      expect(result.connected).toBe(true);
      expect(result.description).toBe('Same person');
      expect(result.path).toHaveLength(0);
    });

    it('should use specific labels when available', () => {
      const members = [
        { id: '1', firstName: 'John', lastName: 'Doe' },
        { id: '2', firstName: 'Jane', lastName: 'Doe' }
      ];
      
      const relationships = [
        { 
          id: 'r1', 
          fromUserId: '1', 
          toUserId: '2', 
          relationshipType: 'parent',
          specificLabel: 'Father'
        }
      ];

      const result = findRelationshipPath('1', '2', relationships, members);
      
      expect(result.connected).toBe(true);
      expect(result.path[0].relationship).toBe('Father');
    });

    it('should find shortest path in complex family tree', () => {
      const members = [
        { id: '1', firstName: 'Person', lastName: 'A' },
        { id: '2', firstName: 'Person', lastName: 'B' },
        { id: '3', firstName: 'Person', lastName: 'C' },
        { id: '4', firstName: 'Person', lastName: 'D' }
      ];
      
      // Create a graph where there are two paths from 1 to 4:
      // 1 -> 2 -> 4 (length 2)
      // 1 -> 3 -> 4 (length 2)
      // BFS should find one of them
      const relationships = [
        { id: 'r1', fromUserId: '1', toUserId: '2', relationshipType: 'parent', specificLabel: null },
        { id: 'r2', fromUserId: '1', toUserId: '3', relationshipType: 'parent', specificLabel: null },
        { id: 'r3', fromUserId: '2', toUserId: '4', relationshipType: 'parent', specificLabel: null },
        { id: 'r4', fromUserId: '3', toUserId: '4', relationshipType: 'sibling', specificLabel: null }
      ];

      const result = findRelationshipPath('1', '4', relationships, members);
      
      expect(result.connected).toBe(true);
      expect(result.path).toHaveLength(2); // Shortest path
    });
  });
});