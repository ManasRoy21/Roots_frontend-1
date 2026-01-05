import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import fs from 'fs';
import path from 'path';

// Import the utility and service files to ensure they compile
import * as relationshipPath from './relationshipPath';
import * as treeLayout from './treeLayout';
import AuthService from '../services/AuthService';
import FamilyService from '../services/FamilyService';
import InviteService from '../services/InviteService';
import MemoryService from '../services/MemoryService';
import UserService from '../services/UserService';
import ValidationService from '../services/ValidationService';

describe('Utility and Service Typing Property Tests', () => {
  // Feature: js-ts-css-scss-migration, Property 10: API and utility typing
  // Validates: Requirements 4.3, 4.5
  it('should have proper TypeScript parameter and return types for all utility functions', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'findRelationshipPath',
          'buildTreeStructure',
          'calculateTreeLayout',
          'calculateTreeStatistics'
        ),
        (functionName) => {
          // Check relationshipPath utility functions
          if (functionName === 'findRelationshipPath') {
            const relationshipPathFile = path.resolve('src/utils/relationshipPath.ts');
            expect(fs.existsSync(relationshipPathFile)).toBe(true);
            
            const content = fs.readFileSync(relationshipPathFile, 'utf-8');
            
            // Verify function has proper TypeScript signature
            expect(content).toContain('export function findRelationshipPath(');
            expect(content).toMatch(/findRelationshipPath\s*\(\s*startId:\s*string/);
            expect(content).toMatch(/targetId:\s*string/);
            expect(content).toMatch(/relationships:\s*Relationship\[\]/);
            expect(content).toMatch(/allMembers:\s*FamilyMember\[\]/);
            expect(content).toMatch(/\):\s*RelationshipPath/);
            
            // Verify imports from types
            expect(content).toContain("import { FamilyMember, Relationship } from '../types/components'");
          }
          
          // Check treeLayout utility functions
          if (['buildTreeStructure', 'calculateTreeLayout', 'calculateTreeStatistics'].includes(functionName)) {
            const treeLayoutFile = path.resolve('src/utils/treeLayout.ts');
            expect(fs.existsSync(treeLayoutFile)).toBe(true);
            
            const content = fs.readFileSync(treeLayoutFile, 'utf-8');
            
            // Verify function has proper TypeScript signature
            expect(content).toContain(`export function ${functionName}(`);
            
            if (functionName === 'buildTreeStructure') {
              expect(content).toMatch(/buildTreeStructure\s*\(\s*members:\s*FamilyMember\[\]/);
              expect(content).toMatch(/relationships:\s*Relationship\[\]/);
              expect(content).toMatch(/rootMemberId:\s*string/);
              expect(content).toMatch(/\):\s*TreeNode\s*\|\s*null/);
            }
            
            if (functionName === 'calculateTreeLayout') {
              expect(content).toMatch(/calculateTreeLayout\s*\(\s*rootNode:\s*TreeNode\s*\|\s*null/);
              expect(content).toMatch(/\):\s*Map<string,\s*Position>/);
            }
            
            if (functionName === 'calculateTreeStatistics') {
              expect(content).toMatch(/calculateTreeStatistics\s*\(\s*members:\s*FamilyMember\[\]/);
              expect(content).toMatch(/rootNode:\s*TreeNode\s*\|\s*null/);
              expect(content).toMatch(/\):\s*TreeStatistics/);
            }
            
            // Verify imports from types
            expect(content).toContain("import { FamilyMember, Relationship } from '../types/components'");
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: js-ts-css-scss-migration, Property 10: API service typing
  // Validates: Requirements 4.3, 4.5
  it('should have proper TypeScript parameter and return types for all service functions', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'AuthService',
          'FamilyService', 
          'InviteService',
          'MemoryService',
          'UserService',
          'ValidationService'
        ),
        (serviceName) => {
          const serviceFile = path.resolve(`src/services/${serviceName}.ts`);
          expect(fs.existsSync(serviceFile)).toBe(true);
          
          const content = fs.readFileSync(serviceFile, 'utf-8');
          
          // Verify service has proper TypeScript imports
          if (serviceName !== 'ValidationService') {
            expect(content).toContain("import axios from 'axios'");
          }
          
          // Check specific service typing requirements
          switch (serviceName) {
            case 'AuthService':
              expect(content).toContain("import {");
              expect(content).toContain("RegisterRequest");
              expect(content).toContain("LoginRequest");
              expect(content).toContain("AuthResponse");
              expect(content).toMatch(/async register\s*\([^)]*email:\s*string/);
              expect(content).toMatch(/async register\s*\([^)]*password:\s*string/);
              expect(content).toMatch(/async register\s*\([^)]*fullName:\s*string/);
              expect(content).toMatch(/\):\s*Promise<AuthResponse>/);
              expect(content).toMatch(/async login\s*\([^)]*email:\s*string/);
              expect(content).toMatch(/async login\s*\([^)]*password:\s*string/);
              expect(content).toMatch(/async refreshToken\s*\(\s*\):\s*Promise<string>/);
              break;
              
            case 'FamilyService':
              expect(content).toContain("AddFamilyMemberRequest");
              expect(content).toContain("UpdateFamilyMemberRequest");
              expect(content).toContain("FamilyMember, Relationship");
              expect(content).toMatch(/async addFamilyMember\s*\([^)]*memberData:\s*AddFamilyMemberRequest/);
              expect(content).toMatch(/\):\s*Promise<FamilyMember>/);
              expect(content).toMatch(/async getFamilyMembers\s*\(\s*\):\s*Promise<FamilyMember\[\]>/);
              expect(content).toMatch(/async getRelationships\s*\(\s*\):\s*Promise<Relationship\[\]>/);
              break;
              
            case 'InviteService':
              expect(content).toContain("InviteResponse");
              expect(content).toMatch(/async validateInviteCode\s*\([^)]*inviteCode:\s*string/);
              expect(content).toMatch(/async joinTree\s*\([^)]*inviteCode:\s*string/);
              expect(content).toMatch(/async getPendingInvitations\s*\(\s*\):\s*Promise<InviteResponse\[\]>/);
              break;
              
            case 'MemoryService':
              expect(content).toContain("CreateMemoryRequest");
              expect(content).toContain("Memory, Album, FamilyMember");
              expect(content).toMatch(/async uploadPhotos\s*\(\s*files:\s*File\[\]/);
              expect(content).toMatch(/memoryData:\s*CreateMemoryRequest/);
              expect(content).toMatch(/onProgress\?\:\s*\([^)]*progress:\s*number/);
              expect(content).toMatch(/async getAlbums\s*\(\s*\):\s*Promise<Album\[\]>/);
              expect(content).toMatch(/async searchMembers\s*\([^)]*query:\s*string/);
              expect(content).toMatch(/\):\s*Promise<FamilyMember\[\]>/);
              break;
              
            case 'UserService':
              expect(content).toContain("User, UserProfile");
              expect(content).toMatch(/async getProfile\s*\([^)]*userId:\s*string/);
              expect(content).toMatch(/\):\s*Promise<UserProfile>/);
              expect(content).toMatch(/async updateProfile\s*\([^)]*data:\s*Partial<UserProfile>/);
              expect(content).toMatch(/async compressImage\s*\(\s*file:\s*File/);
              expect(content).toMatch(/maxWidth:\s*number\s*=\s*800/);
              expect(content).toMatch(/maxHeight:\s*number\s*=\s*800/);
              expect(content).toMatch(/quality:\s*number\s*=\s*0\.8/);
              expect(content).toMatch(/\):\s*Promise<Blob>/);
              expect(content).toMatch(/async uploadPhoto\s*\([^)]*file:\s*File/);
              expect(content).toMatch(/\):\s*Promise<string>/);
              break;
              
            case 'ValidationService':
              expect(content).toMatch(/validateEmail\s*\([^)]*email:\s*string/);
              expect(content).toMatch(/validatePassword\s*\([^)]*password:\s*string/);
              expect(content).toMatch(/validateRequired\s*\([^)]*value:\s*string/);
              expect(content).toMatch(/fieldName:\s*string/);
              expect(content).toMatch(/validateFileSize\s*\([^)]*file:\s*File/);
              expect(content).toMatch(/maxSizeMB:\s*number/);
              expect(content).toMatch(/validateFileType\s*\([^)]*file:\s*File/);
              expect(content).toMatch(/allowedTypes:\s*string\[\]/);
              // All validation functions should return ValidationResult
              expect(content).toMatch(/\):\s*ValidationResult/);
              break;
          }
          
          // Verify no .js imports (should be .ts or no extension)
          expect(content).not.toMatch(/from\s+['"][^'"]*\.js['"]/);
          
          // Verify async functions return Promises
          const asyncMatches = content.match(/async\s+\w+\s*\([^)]*\)/g);
          if (asyncMatches) {
            asyncMatches.forEach(asyncMatch => {
              const functionName = asyncMatch.match(/async\s+(\w+)/)?.[1];
              if (functionName && serviceName !== 'ValidationService') {
                // Find the return type for this function
                const returnTypeMatch = content.match(
                  new RegExp(`${asyncMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^:]*:\\s*Promise<[^>]+>`)
                );
                expect(returnTypeMatch).toBeTruthy();
              }
            });
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: js-ts-css-scss-migration, Property 10: Import statement correctness
  // Validates: Requirements 4.3, 4.5
  it('should have correct TypeScript import statements in all utility and service files', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'src/utils/relationshipPath.ts',
          'src/utils/treeLayout.ts',
          'src/services/AuthService.ts',
          'src/services/FamilyService.ts',
          'src/services/InviteService.ts',
          'src/services/MemoryService.ts',
          'src/services/UserService.ts',
          'src/services/ValidationService.ts'
        ),
        (filePath) => {
          const fullPath = path.resolve(filePath);
          expect(fs.existsSync(fullPath)).toBe(true);
          
          const content = fs.readFileSync(fullPath, 'utf-8');
          
          // Verify no .js imports
          expect(content).not.toMatch(/from\s+['"][^'"]*\.js['"]/);
          
          // Verify proper relative imports for types
          if (content.includes("from '../types/")) {
            expect(content).toMatch(/from\s+['"]\.\.\/types\/[^'"]*['"]/);
            // Should not have .ts extension in imports
            expect(content).not.toMatch(/from\s+['"]\.\.\/types\/[^'"]*\.ts['"]/);
          }
          
          // Verify proper imports for services that depend on other services
          if (filePath.includes('MemoryService.ts')) {
            expect(content).toContain("import UserService from './UserService'");
          }
          
          // Verify axios imports for API services
          if (filePath.includes('services/') && !filePath.includes('ValidationService')) {
            expect(content).toContain("import axios from 'axios'");
          }
          
          // Verify type imports are properly structured
          const typeImports = content.match(/import\s*{[^}]+}\s*from\s*['"][^'"]*types[^'"]*['"]/g);
          if (typeImports) {
            typeImports.forEach(importStatement => {
              // Should have proper destructuring syntax
              expect(importStatement).toMatch(/import\s*{\s*\w+/);
              expect(importStatement).toMatch(/}\s*from/);
              
              // Should not import default and named exports together incorrectly
              expect(importStatement).not.toMatch(/import\s+\w+\s*,\s*{/);
            });
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: js-ts-css-scss-migration, Property 10: Error handling typing
  // Validates: Requirements 4.3, 4.5
  it('should have properly typed error handling in service functions', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'AuthService',
          'FamilyService',
          'InviteService', 
          'MemoryService',
          'UserService'
        ),
        (serviceName) => {
          const serviceFile = path.resolve(`src/services/${serviceName}.ts`);
          const content = fs.readFileSync(serviceFile, 'utf-8');
          
          // Services with complex error handling should have try-catch blocks
          const servicesWithErrorHandling = ['FamilyService', 'InviteService', 'MemoryService'];
          
          if (servicesWithErrorHandling.includes(serviceName)) {
            // Verify proper error handling with types
            expect(content).toMatch(/catch\s*\(\s*error:\s*any\s*\)/);
            
            // Verify error response handling
            expect(content).toContain('error.response?.status');
            
            // Verify proper error throwing with typed messages
            expect(content).toMatch(/throw new Error\s*\(/);
            
            // Services with validation should have ValidationError interface
            if (['FamilyService', 'MemoryService'].includes(serviceName)) {
              expect(content).toContain('ValidationError');
              expect(content).toContain('isValidationError: boolean');
            }
            
            // Services with retry logic should have proper typing
            expect(content).toMatch(/retryWithBackoff\s*=\s*async\s*<T>\s*\(/);
            expect(content).toMatch(/fn:\s*\(\)\s*=>\s*Promise<T>/);
            expect(content).toMatch(/maxRetries:\s*number\s*=\s*3/);
            expect(content).toMatch(/\):\s*Promise<T>/);
          } else {
            // For simpler services like AuthService and UserService, just verify they have proper TypeScript typing
            expect(content).toMatch(/async\s+\w+\s*\([^)]*\):\s*Promise</);
            
            // Should still have proper parameter typing
            expect(content).toMatch(/\w+:\s*(string|number|boolean|File)/);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: js-ts-css-scss-migration, Property 10: Generic type usage
  // Validates: Requirements 4.3, 4.5
  it('should use proper generic types for reusable functions and interfaces', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'retryWithBackoff',
          'axios.post',
          'axios.get',
          'axios.put'
        ),
        (genericFunction) => {
          // Check that services use proper generic typing with axios
          const serviceFiles = [
            'src/services/AuthService.ts',
            'src/services/FamilyService.ts',
            'src/services/InviteService.ts',
            'src/services/MemoryService.ts',
            'src/services/UserService.ts'
          ];
          
          let foundGenericUsage = false;
          
          serviceFiles.forEach(serviceFile => {
            if (fs.existsSync(path.resolve(serviceFile))) {
              const content = fs.readFileSync(path.resolve(serviceFile), 'utf-8');
              
              if (genericFunction === 'retryWithBackoff') {
                if (content.includes('retryWithBackoff')) {
                  expect(content).toMatch(/retryWithBackoff\s*=\s*async\s*<T>/);
                  expect(content).toMatch(/Promise<T>/);
                  foundGenericUsage = true;
                }
              } else if (genericFunction.startsWith('axios.')) {
                const axiosMethod = genericFunction.split('.')[1];
                if (content.includes(`axios.${axiosMethod}`)) {
                  // Should have typed axios calls
                  expect(content).toMatch(new RegExp(`axios\\.${axiosMethod}<[^>]+>`));
                  foundGenericUsage = true;
                }
              }
            }
          });
          
          // At least one service should use the generic function
          if (genericFunction === 'retryWithBackoff') {
            expect(foundGenericUsage).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});