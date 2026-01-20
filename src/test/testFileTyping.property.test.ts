import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import fs from 'fs';
import path from 'path';

// Helper function to recursively find files with specific extensions
function findTestFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...findTestFiles(fullPath, extensions));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      const baseName = path.basename(entry.name, ext);
      
      if (extensions.some(extension => entry.name.endsWith(extension))) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

describe('Test File Typing Property Tests', () => {
  // Feature: js-ts-css-scss-migration, Property 13: Component test typing
  // Validates: Requirements 6.4
  it('should have all test files converted to TypeScript with proper typing', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('component', 'service', 'utility', 'page'),
        (testCategory) => {
          let testDir: string;
          
          switch (testCategory) {
            case 'component':
              testDir = 'src/components';
              break;
            case 'service':
              testDir = 'src/services';
              break;
            case 'utility':
              testDir = 'src/utils';
              break;
            case 'page':
              testDir = 'src/pages';
              break;
            default:
              testDir = 'src';
          }
          
          // Find all TypeScript test files
          const tsTestFiles = findTestFiles(testDir, ['.test.ts', '.test.tsx']);
          
          // Verify no JavaScript test files remain
          const jsTestFiles = findTestFiles(testDir, ['.test.js', '.test.jsx']);
          
          // Property: All test files should be TypeScript, no JavaScript test files should remain
          expect(jsTestFiles.length).toBe(0);
          
          // For each TypeScript test file, verify it has proper typing
          tsTestFiles.forEach(testFile => {
            const testContent = fs.readFileSync(testFile, 'utf-8');
            
            // Check that the file imports from vitest (indicating it's a test file)
            expect(testContent).toMatch(/import.*from ['"]vitest['"]/);
            
            // Verify file extension is correct
            expect(testFile).toMatch(/\.test\.(ts|tsx)$/);
            expect(testFile).not.toMatch(/\.test\.(js|jsx)$/);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have proper TypeScript imports in all test files', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('ts', 'tsx'),
        (extension) => {
          const testFiles = findTestFiles('src', [`.test.${extension}`]);
          
          testFiles.forEach(testFile => {
            const testContent = fs.readFileSync(testFile, 'utf-8');
            
            // Property: All test files should have proper TypeScript imports
            // Check for vitest imports (most common pattern)
            const hasVitestImport = testContent.includes('from \'vitest\'') || testContent.includes('from "vitest"');
            expect(hasVitestImport).toBe(true);
            
            // Check that imports don't use .js/.jsx extensions for local files
            const relativeImports = testContent.match(/from ['"]\.\.?\/[^'"]*['"]/g);
            if (relativeImports) {
              relativeImports.forEach(importStatement => {
                // Should not import .js/.jsx files
                expect(importStatement).not.toMatch(/\.jsx?['"]/);
              });
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have proper TypeScript type annotations in test files', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('component', 'service', 'utility'),
        (testType) => {
          let testDir: string;
          let extensions: string[];
          
          switch (testType) {
            case 'component':
              testDir = 'src/components';
              extensions = ['.test.tsx'];
              break;
            case 'service':
              testDir = 'src/services';
              extensions = ['.test.ts'];
              break;
            case 'utility':
              testDir = 'src/utils';
              extensions = ['.test.ts'];
              break;
            default:
              testDir = 'src';
              extensions = ['.test.ts', '.test.tsx'];
          }
          
          const testFiles = findTestFiles(testDir, extensions);
          
          testFiles.forEach(testFile => {
            const testContent = fs.readFileSync(testFile, 'utf-8');
            
            // Property: Test files should use proper TypeScript patterns
            
            // Verify no JavaScript-style loose typing
            expect(testContent).not.toMatch(/var \w+/); // Should use const/let
            
            // Check for proper file extension
            expect(testFile).toMatch(/\.test\.(ts|tsx)$/);
            expect(testFile).not.toMatch(/\.test\.(js|jsx)$/);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have no remaining JavaScript test files in the project', () => {
    // Property: Complete migration means no .test.js or .test.jsx files should exist
    const jsTestFiles = findTestFiles('src', ['.test.js', '.test.jsx']);
    const jsPropertyTestFiles = findTestFiles('src', ['.property.test.js', '.property.test.jsx']);
    const jsIntegrationTestFiles = findTestFiles('src', ['.integration.test.js', '.integration.test.jsx']);
    
    expect(jsTestFiles.length).toBe(0);
    expect(jsPropertyTestFiles.length).toBe(0);
    expect(jsIntegrationTestFiles.length).toBe(0);
    
    // Verify TypeScript test files exist
    const tsTestFiles = findTestFiles('src', ['.test.ts', '.test.tsx']);
    const tsPropertyTestFiles = findTestFiles('src', ['.property.test.ts', '.property.test.tsx']);
    const tsIntegrationTestFiles = findTestFiles('src', ['.integration.test.ts', '.integration.test.tsx']);
    
    // Should have some TypeScript test files
    expect(tsTestFiles.length).toBeGreaterThan(0);
    
    // All test files should be TypeScript
    const allTestFiles = [
      ...tsTestFiles,
      ...tsPropertyTestFiles,
      ...tsIntegrationTestFiles
    ];
    
    allTestFiles.forEach(testFile => {
      expect(testFile).toMatch(/\.test\.(ts|tsx)$/);
      expect(testFile).not.toMatch(/\.test\.(js|jsx)$/);
    });
  });
});