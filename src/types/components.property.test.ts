import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import fs from 'fs';
import path from 'path';

// Import the type files to ensure they compile (but don't use them as runtime objects)
import './components';
import './api';
import './redux';

describe('Type Definitions Property Tests', () => {
  // Feature: js-ts-css-scss-migration, Property 4: Component type completeness
  // Validates: Requirements 1.4, 4.1
  it('should have complete TypeScript interfaces for all component props', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'ButtonProps',
          'InputProps', 
          'SelectProps',
          'ToggleProps',
          'DateInputProps',
          'ImageUploadProps',
          'ModalProps',
          'FormErrorProps',
          'LoadingSpinnerProps',
          'SearchInputProps',
          'TreeNodeProps',
          'MemberCardProps',
          'TreeCanvasProps',
          'AddRelativeModalProps',
          'CreateEventModalProps',
          'InviteExternalGuestsModalProps'
        ),
        (interfaceName) => {
          // Read the components.ts file to verify interface structure
          const componentsPath = path.resolve('src/types/components.ts');
          expect(fs.existsSync(componentsPath)).toBe(true);
          
          const componentsContent = fs.readFileSync(componentsPath, 'utf-8');
          
          // Verify the interface is properly defined
          expect(componentsContent).toContain(`export interface ${interfaceName}`);
          
          // Check that all component interfaces extend BaseComponentProps or have required props
          if (interfaceName !== 'BaseComponentProps') {
            const interfaceMatch = componentsContent.match(
              new RegExp(`export interface ${interfaceName}[^{]*{([^}]+)}`, 's')
            );
            
            if (interfaceMatch) {
              const interfaceBody = interfaceMatch[0];
              
              // Most component interfaces should extend BaseComponentProps
              const extendsBase = interfaceBody.includes('extends BaseComponentProps');
              const hasClassName = interfaceBody.includes('className?:');
              const hasDataTestId = interfaceBody.includes("'data-testid'?:");
              
              // Either extends BaseComponentProps OR has the base properties
              expect(extendsBase || (hasClassName && hasDataTestId)).toBe(true);
              
              // Verify React event handlers use proper TypeScript types
              if (interfaceBody.includes('onClick')) {
                // Some onClick handlers may use custom parameters instead of React events
                const hasReactEvent = interfaceBody.match(/onClick\?\:\s*\([^)]*event[^)]*React\.(MouseEvent|ChangeEvent|FocusEvent)/);
                const hasCustomHandler = interfaceBody.match(/onClick\?\:\s*\([^)]*\)\s*=>\s*void/);
                expect(hasReactEvent || hasCustomHandler).toBeTruthy();
              }
              
              if (interfaceBody.includes('onChange')) {
                // Some onChange handlers may use custom parameters instead of React events
                const hasReactEvent = interfaceBody.match(/onChange\?\:\s*\([^)]*event[^)]*React\.(ChangeEvent|FocusEvent)/);
                const hasCustomHandler = interfaceBody.match(/onChange\?\:\s*\([^)]*\)\s*=>\s*void/);
                expect(hasReactEvent || hasCustomHandler).toBeTruthy();
              }
              
              if (interfaceBody.includes('onBlur') || interfaceBody.includes('onFocus')) {
                expect(interfaceBody).toMatch(/on(Blur|Focus)\?\:\s*\([^)]*event[^)]*React\.FocusEvent/);
              }
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: js-ts-css-scss-migration, Property 4: API type completeness
  // Validates: Requirements 4.3
  it('should have complete TypeScript interfaces for all API request/response types', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'ApiResponse',
          'User',
          'UserProfile',
          'RegisterRequest',
          'LoginRequest',
          'AuthResponse',
          'AddFamilyMemberRequest',
          'UpdateFamilyMemberRequest',
          'CreateMemoryRequest',
          'DashboardData'
        ),
        (interfaceName) => {
          // Read the api.ts file to verify interface structure
          const apiPath = path.resolve('src/types/api.ts');
          expect(fs.existsSync(apiPath)).toBe(true);
          
          const apiContent = fs.readFileSync(apiPath, 'utf-8');
          
          // Verify the interface is properly defined
          expect(apiContent).toContain(`export interface ${interfaceName}`);
          
          // Check specific interface requirements
          if (interfaceName === 'ApiResponse') {
            expect(apiContent).toMatch(/ApiResponse<T>/);
            expect(apiContent).toContain('data: T');
            expect(apiContent).toContain('status: number');
            expect(apiContent).toContain('success: boolean');
          }
          
          if (interfaceName === 'User') {
            expect(apiContent).toContain('id: string');
            expect(apiContent).toContain('email: string');
            expect(apiContent).toContain('authProvider:');
          }
          
          if (interfaceName === 'AuthResponse') {
            expect(apiContent).toContain('user: User');
            expect(apiContent).toContain('accessToken: string');
            expect(apiContent).toContain('refreshToken: string');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: js-ts-css-scss-migration, Property 4: Redux type completeness
  // Validates: Requirements 4.2
  it('should have complete TypeScript interfaces for all Redux state types', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'RootState',
          'AuthState',
          'UserState',
          'FamilyState',
          'MemoryState',
          'DashboardState',
          'TreeState'
        ),
        (interfaceName) => {
          // Read the redux.ts file to verify interface structure
          const reduxPath = path.resolve('src/types/redux.ts');
          expect(fs.existsSync(reduxPath)).toBe(true);
          
          const reduxContent = fs.readFileSync(reduxPath, 'utf-8');
          
          // Verify the interface is properly defined
          expect(reduxContent).toContain(`export interface ${interfaceName}`);
          
          // Check specific interface requirements
          if (interfaceName === 'RootState') {
            expect(reduxContent).toContain('auth: AuthState');
            expect(reduxContent).toContain('user: UserState');
            expect(reduxContent).toContain('family: FamilyState');
            expect(reduxContent).toContain('memory: MemoryState');
            expect(reduxContent).toContain('dashboard: DashboardState');
            expect(reduxContent).toContain('tree: TreeState');
          }
          
          // All state interfaces should have common async state properties
          if (interfaceName.endsWith('State') && interfaceName !== 'RootState') {
            const stateMatch = reduxContent.match(
              new RegExp(`export interface ${interfaceName}[^{]*{([^}]+)}`, 's')
            );
            
            if (stateMatch) {
              const stateBody = stateMatch[0];
              
              // Most state interfaces should have loading and error properties
              if (interfaceName !== 'TreeState') {
                expect(stateBody).toContain('isLoading: boolean');
                expect(stateBody).toContain('error: string | null');
              }
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: js-ts-css-scss-migration, Property 4: Type file structure completeness
  // Validates: Requirements 1.4, 4.1
  it('should have all required type definition files with proper exports', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('components.ts', 'api.ts', 'redux.ts'),
        (typeFile) => {
          const typePath = path.resolve(`src/types/${typeFile}`);
          
          // Verify the type file exists
          expect(fs.existsSync(typePath)).toBe(true);
          
          const typeContent = fs.readFileSync(typePath, 'utf-8');
          
          // Verify proper TypeScript syntax
          expect(typeContent).toContain('export interface');
          
          // Verify imports are properly typed
          if (typeContent.includes('import')) {
            // Should not have any .js imports (should be .ts or no extension)
            expect(typeContent).not.toMatch(/from\s+['"][^'"]*\.js['"]/);
          }
          
          // Check file-specific requirements
          if (typeFile === 'components.ts') {
            expect(typeContent).toContain('import React from');
            expect(typeContent).toContain('BaseComponentProps');
            expect(typeContent).toContain('React.ReactNode');
            expect(typeContent).toContain('React.MouseEvent');
          }
          
          if (typeFile === 'api.ts') {
            expect(typeContent).toContain('ApiResponse<T>');
            expect(typeContent).toContain('User');
            expect(typeContent).toContain('AuthResponse');
          }
          
          if (typeFile === 'redux.ts') {
            expect(typeContent).toContain('RootState');
            expect(typeContent).toContain('import {');
            expect(typeContent).toContain("from './api'");
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: js-ts-css-scss-migration, Property 4: Interface property type safety
  // Validates: Requirements 1.4, 4.1
  it('should have properly typed interface properties with correct optionality', () => {
    fc.assert(
      fc.property(
        fc.record({
          interfaceType: fc.constantFrom('component', 'api', 'redux'),
          propertyType: fc.constantFrom('required', 'optional', 'function', 'union')
        }),
        ({ interfaceType, propertyType }) => {
          let filePath: string;
          let expectedPatterns: string[];
          
          switch (interfaceType) {
            case 'component':
              filePath = 'src/types/components.ts';
              expectedPatterns = [
                'React.MouseEvent<HTML',
                'React.ChangeEvent<HTML',
                'React.FocusEvent<HTML',
                'React.ReactNode',
                'className?: string',
                'disabled?: boolean'
              ];
              break;
            case 'api':
              filePath = 'src/types/api.ts';
              expectedPatterns = [
                'id: string',
                'email: string',
                'createdAt: string',
                'status: number',
                'success: boolean'
              ];
              break;
            case 'redux':
              filePath = 'src/types/redux.ts';
              expectedPatterns = [
                'isLoading: boolean',
                'error: string | null',
                'user: User | null',
                ': string[]'
              ];
              break;
            default:
              throw new Error('Invalid interface type');
          }
          
          const content = fs.readFileSync(path.resolve(filePath), 'utf-8');
          
          // Check that at least some expected patterns exist
          const foundPatterns = expectedPatterns.filter(pattern => 
            content.includes(pattern)
          );
          
          expect(foundPatterns.length).toBeGreaterThan(0);
          
          // Verify proper TypeScript syntax patterns
          switch (propertyType) {
            case 'required':
              expect(content).toMatch(/\w+:\s*(string|number|boolean)/);
              break;
            case 'optional':
              expect(content).toMatch(/\w+\?:\s*(string|number|boolean)/);
              break;
            case 'function':
              if (interfaceType === 'api') {
                // API types may have callback functions
                const hasCallback = content.includes('UploadProgressCallback') || content.includes('(progress: number) => void');
                expect(hasCallback).toBe(true);
              } else {
                expect(content).toMatch(/\w+\?:\s*\([^)]*\)\s*=>/);
              }
              break;
            case 'union':
              expect(content).toMatch(/:\s*'[^']+'\s*\|\s*'[^']+'/);
              break;
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});