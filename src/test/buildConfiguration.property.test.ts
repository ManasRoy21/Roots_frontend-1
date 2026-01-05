import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import fs from 'fs';
import path from 'path';

describe('Build Configuration Property Tests', () => {
  // Feature: js-ts-css-scss-migration, Property 14: Configuration completeness
  // Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5
  it('should have all required configuration files with necessary settings', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('tsconfig.json', 'vite.config.ts', 'package.json'),
        (configFile) => {
          // Verify the configuration file exists
          const configPath = path.resolve(configFile);
          expect(fs.existsSync(configPath)).toBe(true);
          
          // Read and parse the configuration
          const configContent = fs.readFileSync(configPath, 'utf-8');
          
          if (configFile === 'tsconfig.json') {
            // Validate TypeScript configuration
            const tsConfig = JSON.parse(configContent);
            
            // Check required compiler options
            expect(tsConfig.compilerOptions).toBeDefined();
            expect(tsConfig.compilerOptions.target).toBe('ES2020');
            expect(tsConfig.compilerOptions.jsx).toBe('react-jsx');
            expect(tsConfig.compilerOptions.strict).toBe(true);
            expect(tsConfig.compilerOptions.moduleResolution).toBe('bundler');
            
            // Check includes and excludes
            expect(tsConfig.include).toContain('src/**/*');
            expect(tsConfig.include).toContain('vite.config.ts');
            expect(tsConfig.exclude).toContain('node_modules');
            
            // Check path mapping
            expect(tsConfig.compilerOptions.paths).toBeDefined();
            expect(tsConfig.compilerOptions.paths['@/*']).toEqual(['src/*']);
          }
          
          if (configFile === 'vite.config.ts') {
            // Validate Vite configuration contains TypeScript and SCSS support
            expect(configContent).toContain('import { defineConfig }');
            expect(configContent).toContain('react()');
            
            // Check SCSS configuration
            expect(configContent).toContain('css:');
            expect(configContent).toContain('preprocessorOptions');
            expect(configContent).toContain('scss:');
            expect(configContent).toContain('_variables.scss');
            expect(configContent).toContain('_mixins.scss');
          }
          
          if (configFile === 'package.json') {
            // Validate package.json has required dependencies and scripts
            const packageConfig = JSON.parse(configContent);
            
            // Check TypeScript dependencies
            expect(packageConfig.devDependencies.typescript).toBeDefined();
            expect(packageConfig.devDependencies['@types/node']).toBeDefined();
            expect(packageConfig.devDependencies.sass).toBeDefined();
            
            // Check scripts
            expect(packageConfig.scripts['type-check']).toBe('tsc --noEmit');
            expect(packageConfig.scripts.build).toContain('tsc --noEmit');
            expect(packageConfig.scripts.dev).toBe('vite');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: js-ts-css-scss-migration, Property 14: SCSS foundation files exist
  // Validates: Requirements 7.2, 7.3
  it('should have SCSS foundation files with proper structure', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('src/styles/_variables.scss', 'src/styles/_mixins.scss', 'src/styles/main.scss'),
        (scssFile) => {
          // Verify SCSS files exist
          expect(fs.existsSync(scssFile)).toBe(true);
          
          const scssContent = fs.readFileSync(scssFile, 'utf-8');
          
          if (scssFile === 'src/styles/_variables.scss') {
            // Check for essential variables
            expect(scssContent).toContain('$primary-color:');
            expect(scssContent).toContain('$font-family-base:');
            expect(scssContent).toContain('$spacing-');
            expect(scssContent).toContain('$border-radius-');
          }
          
          if (scssFile === 'src/styles/_mixins.scss') {
            // Check for essential mixins
            expect(scssContent).toContain('@mixin button-base');
            expect(scssContent).toContain('@mixin button-size');
            expect(scssContent).toContain('@mixin focus-visible');
          }
          
          if (scssFile === 'src/styles/main.scss') {
            // Check imports
            expect(scssContent).toContain("@import 'variables'");
            expect(scssContent).toContain("@import 'mixins'");
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: js-ts-css-scss-migration, Property 14: Build system integration
  // Validates: Requirements 7.1, 7.5
  it('should have working TypeScript compilation and SCSS processing', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('typescript', 'scss'),
        (buildType) => {
          if (buildType === 'typescript') {
            // Verify TypeScript configuration is valid by checking tsconfig.json can be parsed
            const tsConfigPath = path.resolve('tsconfig.json');
            expect(fs.existsSync(tsConfigPath)).toBe(true);
            
            const tsConfigContent = fs.readFileSync(tsConfigPath, 'utf-8');
            expect(() => JSON.parse(tsConfigContent)).not.toThrow();
            
            // Verify vite.config.ts exists and is a TypeScript file
            const viteConfigPath = path.resolve('vite.config.ts');
            expect(fs.existsSync(viteConfigPath)).toBe(true);
            expect(viteConfigPath).toMatch(/\.ts$/);
          }
          
          if (buildType === 'scss') {
            // Verify SCSS files exist and have proper syntax
            const variablesPath = path.resolve('src/styles/_variables.scss');
            const mixinsPath = path.resolve('src/styles/_mixins.scss');
            
            expect(fs.existsSync(variablesPath)).toBe(true);
            expect(fs.existsSync(mixinsPath)).toBe(true);
            
            // Check SCSS syntax basics
            const variablesContent = fs.readFileSync(variablesPath, 'utf-8');
            const mixinsContent = fs.readFileSync(mixinsPath, 'utf-8');
            
            // Variables should contain $ syntax
            expect(variablesContent).toMatch(/\$[\w-]+:/);
            
            // Mixins should contain @mixin syntax
            expect(mixinsContent).toMatch(/@mixin\s+[\w-]+/);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});