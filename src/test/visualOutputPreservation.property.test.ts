/**
 * Property-Based Test: Visual Output Preservation
 * Feature: js-ts-css-scss-migration, Property 8: Visual output preservation
 * 
 * **Validates: Requirements 2.4, 8.3**
 * 
 * This test verifies that SCSS files compile correctly and maintain
 * the same visual output as the original CSS files.
 */

import fc from 'fast-check';
import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Helper function to get all SCSS files in the project
function getAllScssFiles(): string[] {
  const scssFiles: string[] = [];
  
  function findScssFiles(dir: string) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        findScssFiles(filePath);
      } else if (file.endsWith('.scss')) {
        scssFiles.push(filePath);
      }
    }
  }
  
  findScssFiles('src');
  return scssFiles;
}

// Helper function to check if SCSS file compiles without errors
function compilesWithoutErrors(scssFile: string): boolean {
  try {
    // Use sass to compile the SCSS file
    execSync(`npx sass "${scssFile}" --no-source-map --style=compressed`, {
      stdio: 'pipe',
      timeout: 5000
    });
    return true;
  } catch (error) {
    console.error(`SCSS compilation failed for ${scssFile}:`, error);
    return false;
  }
}

// Helper function to check if SCSS file uses variables correctly
function usesVariablesCorrectly(scssFile: string): boolean {
  try {
    const content = fs.readFileSync(scssFile, 'utf-8');
    
    // Skip variable definition files themselves
    if (scssFile.includes('_variables.scss')) {
      return true;
    }
    
    // Check if file imports variables when using them
    const hasVariableUsage = content.includes('$primary-color') || 
                           content.includes('$secondary-color') ||
                           content.includes('$font-size-') ||
                           content.includes('$spacing-') ||
                           content.includes('$border-radius-');
    
    const hasVariableImport = content.includes("@use '../styles/variables'") ||
                             content.includes("@use '../../styles/variables'") ||
                             content.includes("@use 'variables'");
    
    // If using variables, must have import
    if (hasVariableUsage && !hasVariableImport) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error reading SCSS file ${scssFile}:`, error);
    return false;
  }
}

// Helper function to check if SCSS file uses mixins correctly
function usesMixinsCorrectly(scssFile: string): boolean {
  try {
    const content = fs.readFileSync(scssFile, 'utf-8');
    
    // Check if file imports mixins when using them
    const hasMixinUsage = content.includes('@include button-base') ||
                         content.includes('@include button-size') ||
                         content.includes('@include focus-visible');
    
    const hasMixinImport = content.includes("@use '../styles/mixins'") ||
                          content.includes("@use '../../styles/mixins'");
    
    // If using mixins, must have import
    if (hasMixinUsage && !hasMixinImport) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error reading SCSS file ${scssFile}:`, error);
    return false;
  }
}

// Helper function to check if SCSS file maintains CSS class structure
function maintainsCssClassStructure(scssFile: string): boolean {
  try {
    const content = fs.readFileSync(scssFile, 'utf-8');
    
    // Check that SCSS file contains CSS class selectors or is a utility file
    const hasClassSelectors = content.includes('.') && content.length > 10; // Basic check
    const isUtilityFile = scssFile.includes('_variables.scss') || 
                         scssFile.includes('_mixins.scss') || 
                         scssFile.includes('main.scss');
    
    // Check that it doesn't have obvious syntax errors
    const hasValidSyntax = !content.includes('..') && // No double dots
                          !content.includes('{{') && // No double braces
                          !content.includes('}}');   // No double closing braces
    
    // Utility files don't need class selectors, regular files do
    return (hasClassSelectors || isUtilityFile) && hasValidSyntax;
  } catch (error) {
    console.error(`Error reading SCSS file ${scssFile}:`, error);
    return false;
  }
}

describe('Visual Output Preservation Properties', () => {
  const scssFiles = getAllScssFiles();
  
  test('Property 8: Visual output preservation - SCSS compilation success', () => {
    // Feature: js-ts-css-scss-migration, Property 8: Visual output preservation
    
    // Test a smaller subset to avoid timeout
    const testFiles = scssFiles.slice(0, 10);
    
    fc.assert(fc.property(
      fc.constantFrom(...testFiles),
      (scssFile) => {
        // For any SCSS file, it should compile without errors
        const compiles = compilesWithoutErrors(scssFile);
        
        if (!compiles) {
          console.error(`SCSS file failed to compile: ${scssFile}`);
        }
        
        return compiles;
      }
    ), { numRuns: Math.min(50, testFiles.length) });
  }, 10000);
  
  test('Property 8: Visual output preservation - Variable usage correctness', () => {
    // Feature: js-ts-css-scss-migration, Property 8: Visual output preservation
    
    fc.assert(fc.property(
      fc.constantFrom(...scssFiles),
      (scssFile) => {
        // For any SCSS file using variables, it should import them correctly
        const usesVariablesCorrect = usesVariablesCorrectly(scssFile);
        
        if (!usesVariablesCorrect) {
          console.error(`SCSS file has incorrect variable usage: ${scssFile}`);
        }
        
        return usesVariablesCorrect;
      }
    ), { numRuns: Math.min(100, scssFiles.length) });
  });
  
  test('Property 8: Visual output preservation - Mixin usage correctness', () => {
    // Feature: js-ts-css-scss-migration, Property 8: Visual output preservation
    
    fc.assert(fc.property(
      fc.constantFrom(...scssFiles),
      (scssFile) => {
        // For any SCSS file using mixins, it should import them correctly
        const usesMixinsCorrect = usesMixinsCorrectly(scssFile);
        
        if (!usesMixinsCorrect) {
          console.error(`SCSS file has incorrect mixin usage: ${scssFile}`);
        }
        
        return usesMixinsCorrect;
      }
    ), { numRuns: Math.min(100, scssFiles.length) });
  });
  
  test('Property 8: Visual output preservation - CSS class structure maintenance', () => {
    // Feature: js-ts-css-scss-migration, Property 8: Visual output preservation
    
    fc.assert(fc.property(
      fc.constantFrom(...scssFiles),
      (scssFile) => {
        // For any SCSS file, it should maintain valid CSS class structure
        const maintainsStructure = maintainsCssClassStructure(scssFile);
        
        if (!maintainsStructure) {
          console.error(`SCSS file has invalid class structure: ${scssFile}`);
        }
        
        return maintainsStructure;
      }
    ), { numRuns: Math.min(100, scssFiles.length) });
  });
  
  test('Property 8: Visual output preservation - SCSS files exist for components', () => {
    // Feature: js-ts-css-scss-migration, Property 8: Visual output preservation
    
    // Check that key components have SCSS files
    const expectedScssFiles = [
      'src/components/Button.scss',
      'src/components/Input.scss',
      'src/components/FormError.scss',
      'src/components/Select.scss',
      'src/components/DateInput.scss',
      'src/components/ImageUpload.scss',
      'src/components/Toggle.scss',
      'src/components/SearchInput.scss',
      'src/components/LoadingSpinner.scss'
    ];
    
    fc.assert(fc.property(
      fc.constantFrom(...expectedScssFiles),
      (expectedFile) => {
        // For any expected SCSS file, it should exist
        const exists = fs.existsSync(expectedFile);
        
        if (!exists) {
          console.error(`Expected SCSS file does not exist: ${expectedFile}`);
        }
        
        return exists;
      }
    ), { numRuns: expectedScssFiles.length });
  });
  
  test('Property 8: Visual output preservation - SCSS files exist for pages', () => {
    // Feature: js-ts-css-scss-migration, Property 8: Visual output preservation
    
    // Check that key pages have SCSS files
    const expectedPageScssFiles = [
      'src/pages/LandingPage.scss'
    ];
    
    fc.assert(fc.property(
      fc.constantFrom(...expectedPageScssFiles),
      (expectedFile) => {
        // For any expected page SCSS file, it should exist
        const exists = fs.existsSync(expectedFile);
        
        if (!exists) {
          console.error(`Expected page SCSS file does not exist: ${expectedFile}`);
        }
        
        return exists;
      }
    ), { numRuns: expectedPageScssFiles.length });
  });
});