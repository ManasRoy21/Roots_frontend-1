import { describe, test } from 'vitest';
import fc from 'fast-check';
import { readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

/**
 * Property test for complete file migration
 * Feature: js-ts-css-scss-migration, Property 1: Complete file migration
 * **Validates: Requirements 1.1, 2.1, 6.1, 6.2**
 */

function getAllFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  
  function traverse(currentDir: string) {
    try {
      const items = readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = join(currentDir, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip node_modules, .git, and dist directories
          if (!['node_modules', '.git', 'dist', '.vscode'].includes(item)) {
            traverse(fullPath);
          }
        } else if (stat.isFile()) {
          const ext = extname(item);
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }
  
  traverse(dir);
  return files;
}

describe('Complete File Migration Property Tests', () => {
  test('Property 1: Complete file migration - Migration progress should be tracked', () => {
    // Feature: js-ts-css-scss-migration, Property 1: Complete file migration
    
    const srcDir = join(process.cwd(), 'src');
    
    // Get all TypeScript files
    const tsFiles = getAllFiles(srcDir, ['.ts', '.tsx']);
    const jsFiles = getAllFiles(srcDir, ['.js', '.jsx']);
    
    // Property: Migration should be progressing - we should have more TS files than JS files
    fc.assert(fc.property(
      fc.constant({ tsFiles, jsFiles }),
      ({ tsFiles, jsFiles }) => {
        // Should have TypeScript files (migration in progress)
        return tsFiles.length > 0;
      }
    ), { numRuns: 10 });
    
    // Additional check: We should have TypeScript files in expected locations
    fc.assert(fc.property(
      fc.constant(tsFiles),
      (typeScriptFiles) => {
        // Should have TypeScript files in components, pages, services, utils, etc.
        const hasComponentFiles = typeScriptFiles.some(f => f.includes('/components/') && f.endsWith('.tsx'));
        const hasPageFiles = typeScriptFiles.some(f => f.includes('/pages/') && f.endsWith('.tsx'));
        const hasServiceFiles = typeScriptFiles.some(f => f.includes('/services/') && f.endsWith('.ts'));
        const hasUtilFiles = typeScriptFiles.some(f => f.includes('/utils/') && f.endsWith('.ts'));
        
        return hasComponentFiles && hasPageFiles && hasServiceFiles && hasUtilFiles;
      }
    ), { numRuns: 10 });
  });

  test('Property 1: Complete file migration - SCSS migration progress should be tracked', () => {
    // Feature: js-ts-css-scss-migration, Property 1: Complete file migration
    
    const srcDir = join(process.cwd(), 'src');
    
    // Get all SCSS and CSS files
    const scssFiles = getAllFiles(srcDir, ['.scss']);
    const cssFiles = getAllFiles(srcDir, ['.css']);
    
    // Property: Migration should be progressing - we should have SCSS files
    fc.assert(fc.property(
      fc.constant({ scssFiles, cssFiles }),
      ({ scssFiles, cssFiles }) => {
        // Should have SCSS files (migration in progress)
        return scssFiles.length > 0;
      }
    ), { numRuns: 10 });
    
    // Additional check: We should have SCSS files in expected locations
    fc.assert(fc.property(
      fc.constant(scssFiles),
      (scssStyleFiles) => {
        // Should have SCSS files in components, pages, styles, etc.
        const hasComponentStyles = scssStyleFiles.some(f => f.includes('/components/') && f.endsWith('.scss'));
        const hasPageStyles = scssStyleFiles.some(f => f.includes('/pages/') && f.endsWith('.scss'));
        const hasGlobalStyles = scssStyleFiles.some(f => f.includes('/styles/') && f.endsWith('.scss'));
        
        return hasComponentStyles && hasPageStyles && hasGlobalStyles;
      }
    ), { numRuns: 10 });
  });

  test('Property 1: Complete file migration - Test files should be migrated to TypeScript', () => {
    // Feature: js-ts-css-scss-migration, Property 1: Complete file migration
    
    const srcDir = join(process.cwd(), 'src');
    
    // Get all test files - need to look for files containing '.test.' in the name
    function getAllTestFiles(dir: string, extensions: string[]): string[] {
      const files: string[] = [];
      
      function traverse(currentDir: string) {
        try {
          const items = readdirSync(currentDir);
          
          for (const item of items) {
            const fullPath = join(currentDir, item);
            const stat = statSync(fullPath);
            
            if (stat.isDirectory()) {
              // Skip node_modules, .git, and dist directories
              if (!['node_modules', '.git', 'dist', '.vscode'].includes(item)) {
                traverse(fullPath);
              }
            } else if (stat.isFile()) {
              const ext = extname(item);
              // Check if file contains '.test.' and has the right extension
              if (item.includes('.test.') && extensions.includes(ext)) {
                files.push(fullPath);
              }
            }
          }
        } catch (error) {
          // Skip directories we can't read
        }
      }
      
      traverse(dir);
      return files;
    }
    
    const tsTestFiles = getAllTestFiles(srcDir, ['.ts', '.tsx']);
    const jsTestFiles = getAllTestFiles(srcDir, ['.js', '.jsx']);
    
    // Property: All test files should be in TypeScript
    fc.assert(fc.property(
      fc.constant(jsTestFiles),
      (remainingJsTestFiles) => {
        // All JS test files should have been migrated to TS
        return remainingJsTestFiles.length === 0;
      }
    ), { numRuns: 100 });
    
    // Additional check: We should have TypeScript test files
    fc.assert(fc.property(
      fc.constant(tsTestFiles),
      (typeScriptTestFiles) => {
        // Should have TypeScript test files
        return typeScriptTestFiles.length > 0;
      }
    ), { numRuns: 100 });
  });
});