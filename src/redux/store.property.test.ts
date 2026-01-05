import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import fs from 'fs';
import path from 'path';

// Import the store to ensure it compiles
import { store, useAppDispatch, useAppSelector } from './store';
import type { RootState, AppDispatch } from './store';

describe('Redux Store Property Tests', () => {
  // Feature: js-ts-css-scss-migration, Property 5: Redux type integration
  // Validates: Requirements 1.5, 4.2, 6.5
  it('should have strongly typed Redux store with proper state interfaces', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('auth', 'user', 'family', 'memory', 'dashboard', 'tree'),
        (sliceName) => {
          // Verify the store has the expected slice
          const state = store.getState();
          expect(state).toHaveProperty(sliceName);
          
          // Verify the slice has the expected structure
          const slice = state[sliceName as keyof RootState];
          expect(slice).toBeDefined();
          
          // Check that most slices have common async state properties
          if (sliceName !== 'tree') {
            expect(slice).toHaveProperty('isLoading');
            expect(slice).toHaveProperty('error');
            expect(typeof (slice as any).isLoading).toBe('boolean');
            expect((slice as any).error === null || typeof (slice as any).error === 'string').toBe(true);
          }
          
          // Check slice-specific properties
          switch (sliceName) {
            case 'auth':
              expect(slice).toHaveProperty('user');
              expect(slice).toHaveProperty('isAuthenticated');
              expect(typeof (slice as any).isAuthenticated).toBe('boolean');
              break;
            case 'user':
              expect(slice).toHaveProperty('profile');
              break;
            case 'family':
              expect(slice).toHaveProperty('familyMembers');
              expect(slice).toHaveProperty('relationships');
              expect(Array.isArray((slice as any).familyMembers)).toBe(true);
              expect(Array.isArray((slice as any).relationships)).toBe(true);
              break;
            case 'memory':
              expect(slice).toHaveProperty('memories');
              expect(slice).toHaveProperty('albums');
              expect(slice).toHaveProperty('uploadProgress');
              expect(Array.isArray((slice as any).memories)).toBe(true);
              expect(Array.isArray((slice as any).albums)).toBe(true);
              expect(typeof (slice as any).uploadProgress).toBe('number');
              break;
            case 'dashboard':
              expect(slice).toHaveProperty('dashboardData');
              expect(slice).toHaveProperty('sectionLoading');
              expect(slice).toHaveProperty('sectionErrors');
              expect(typeof (slice as any).sectionLoading).toBe('object');
              expect(typeof (slice as any).sectionErrors).toBe('object');
              break;
            case 'tree':
              expect(slice).toHaveProperty('selectedMemberId');
              expect(slice).toHaveProperty('searchQuery');
              expect(slice).toHaveProperty('searchResults');
              expect(slice).toHaveProperty('zoomLevel');
              expect(slice).toHaveProperty('panOffset');
              expect(typeof (slice as any).searchQuery).toBe('string');
              expect(Array.isArray((slice as any).searchResults)).toBe(true);
              expect(typeof (slice as any).zoomLevel).toBe('number');
              expect(typeof (slice as any).panOffset).toBe('object');
              break;
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: js-ts-css-scss-migration, Property 5: Typed hooks functionality
  // Validates: Requirements 1.5, 4.2
  it('should have properly typed useAppDispatch and useAppSelector hooks', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('useAppDispatch', 'useAppSelector'),
        (hookName) => {
          // Verify the hooks are properly defined in the store file
          const storeContent = fs.readFileSync(path.resolve('src/redux/store.ts'), 'utf-8');
          
          if (hookName === 'useAppDispatch') {
            expect(storeContent).toContain('export const useAppDispatch');
            expect(storeContent).toContain('useDispatch<AppDispatch>()');
            expect(storeContent).toContain('import { TypedUseSelectorHook, useDispatch, useSelector }');
          }
          
          if (hookName === 'useAppSelector') {
            expect(storeContent).toContain('export const useAppSelector: TypedUseSelectorHook<RootState>');
            expect(storeContent).toContain('useSelector');
            expect(storeContent).toContain('import { TypedUseSelectorHook, useDispatch, useSelector }');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: js-ts-css-scss-migration, Property 5: Store TypeScript file structure
  // Validates: Requirements 1.5, 4.2, 6.5
  it('should have properly structured TypeScript store configuration', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('store.ts', 'store.js'),
        (fileName) => {
          const filePath = path.resolve(`src/redux/${fileName}`);
          
          if (fileName === 'store.ts') {
            // Verify the TypeScript store file exists
            expect(fs.existsSync(filePath)).toBe(true);
            
            const storeContent = fs.readFileSync(filePath, 'utf-8');
            
            // Verify TypeScript-specific imports and exports
            expect(storeContent).toContain('import { TypedUseSelectorHook, useDispatch, useSelector }');
            expect(storeContent).toContain('export type RootState');
            expect(storeContent).toContain('export type AppDispatch');
            expect(storeContent).toContain('export const useAppDispatch');
            expect(storeContent).toContain('export const useAppSelector: TypedUseSelectorHook<RootState>');
            
            // Verify proper TypeScript typing
            expect(storeContent).toContain('ReturnType<typeof store.getState>');
            expect(storeContent).toContain('typeof store.dispatch');
            expect(storeContent).toContain('useDispatch<AppDispatch>()');
            
            // Verify all reducers are imported
            expect(storeContent).toContain('authReducer');
            expect(storeContent).toContain('userReducer');
            expect(storeContent).toContain('familyReducer');
            expect(storeContent).toContain('memoryReducer');
            expect(storeContent).toContain('dashboardReducer');
            expect(storeContent).toContain('treeReducer');
            
            // Verify middleware configuration is preserved
            expect(storeContent).toContain('serializableCheck');
            expect(storeContent).toContain('ignoredActions');
            expect(storeContent).toContain('ignoredPaths');
          }
          
          if (fileName === 'store.js') {
            // The old JavaScript file should still exist for now during migration
            // This test ensures we don't break existing functionality
            const jsExists = fs.existsSync(filePath);
            const tsExists = fs.existsSync(path.resolve('src/redux/store.ts'));
            
            // Either the old JS file exists OR the new TS file exists (or both during migration)
            expect(jsExists || tsExists).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: js-ts-css-scss-migration, Property 5: Redux middleware type safety
  // Validates: Requirements 4.2, 6.5
  it('should have properly typed Redux middleware configuration', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('serializableCheck', 'devTools'),
        (middlewareFeature) => {
          const storeContent = fs.readFileSync(path.resolve('src/redux/store.ts'), 'utf-8');
          
          if (middlewareFeature === 'serializableCheck') {
            // Verify serializable check configuration
            expect(storeContent).toContain('serializableCheck:');
            expect(storeContent).toContain('ignoredActions:');
            expect(storeContent).toContain('ignoredPaths:');
            
            // Verify specific ignored actions for File objects
            expect(storeContent).toContain("'memory/uploadPhotos/pending'");
            expect(storeContent).toContain("'memory/uploadPhotos/fulfilled'");
            expect(storeContent).toContain("'memory.uploadingFiles'");
          }
          
          if (middlewareFeature === 'devTools') {
            // Verify devTools configuration
            expect(storeContent).toContain('devTools:');
            expect(storeContent).toContain("process.env.NODE_ENV !== 'production'");
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: js-ts-css-scss-migration, Property 5: Type inference validation
  // Validates: Requirements 1.5, 4.2
  it('should properly infer types from store configuration', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('RootState', 'AppDispatch'),
        (typeName) => {
          const storeContent = fs.readFileSync(path.resolve('src/redux/store.ts'), 'utf-8');
          
          if (typeName === 'RootState') {
            // Verify RootState is properly inferred from store
            expect(storeContent).toContain('export type RootState = ReturnType<typeof store.getState>');
            
            // Verify the store has all expected reducers
            const state = store.getState();
            expect(state).toHaveProperty('auth');
            expect(state).toHaveProperty('user');
            expect(state).toHaveProperty('family');
            expect(state).toHaveProperty('memory');
            expect(state).toHaveProperty('dashboard');
            expect(state).toHaveProperty('tree');
          }
          
          if (typeName === 'AppDispatch') {
            // Verify AppDispatch is properly inferred from store
            expect(storeContent).toContain('export type AppDispatch = typeof store.dispatch');
            
            // Verify dispatch function exists and is callable
            const dispatch = store.dispatch;
            expect(typeof dispatch).toBe('function');
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});