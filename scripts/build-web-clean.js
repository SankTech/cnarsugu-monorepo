#!/usr/bin/env node

// Clean build script for Next.js 15 compatibility

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Clean Web Build Script (Next.js 15)');
console.log('=====================================');

const webDir = path.join(__dirname, '..', 'apps', 'web');
process.chdir(webDir);

function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

function cleanBuildArtifacts() {
  console.log('🧹 Cleaning build artifacts...');
  
  const pathsToClean = [
    '.next',
    'out',
    'dist',
    'node_modules/.cache',
    'tsconfig.tsbuildinfo'
  ];
  
  pathsToClean.forEach(pathToClean => {
    if (fs.existsSync(pathToClean)) {
      console.log(`   Removing ${pathToClean}...`);
      fs.rmSync(pathToClean, { recursive: true, force: true });
    }
  });
}

async function main() {
  try {
    // Clean previous builds
    cleanBuildArtifacts();

    // Install dependencies
    if (!runCommand('pnpm install --frozen-lockfile', 'Installing dependencies')) {
      process.exit(1);
    }

    // Use Next.js 15 compatible config
    console.log('📋 Using Next.js 15 compatible configuration...');
    if (fs.existsSync('next.config.v15.ts')) {
      fs.copyFileSync('next.config.ts', 'next.config.ts.backup');
      fs.copyFileSync('next.config.v15.ts', 'next.config.ts');
    }

    // Build
    console.log('🏗️  Building with Next.js 15 compatibility...');
    const buildSuccess = runCommand('cross-env NODE_ENV=production next build', 'Clean build');

    // Restore original config
    if (fs.existsSync('next.config.ts.backup')) {
      fs.copyFileSync('next.config.ts.backup', 'next.config.ts');
      fs.unlinkSync('next.config.ts.backup');
    }

    if (buildSuccess) {
      console.log('✅ Clean build completed successfully!');
      console.log('📁 Build output is in .next/ directory');
    } else {
      console.log('❌ Clean build failed');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Clean build script failed:', error.message);
    
    // Restore config if backup exists
    if (fs.existsSync('next.config.ts.backup')) {
      fs.copyFileSync('next.config.ts.backup', 'next.config.ts');
      fs.unlinkSync('next.config.ts.backup');
    }
    
    process.exit(1);
  }
}

main();