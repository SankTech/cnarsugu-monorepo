#!/usr/bin/env node

// Cross-platform web build script (Node.js)

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Cross-Platform Web Build Script');
console.log('==================================');

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

function backupAndUseConfig(configFile) {
  const originalConfig = 'next.config.ts';
  const backupConfig = 'next.config.ts.backup';
  
  // Backup original
  if (fs.existsSync(originalConfig)) {
    fs.copyFileSync(originalConfig, backupConfig);
  }
  
  // Use new config
  if (fs.existsSync(configFile)) {
    fs.copyFileSync(configFile, originalConfig);
    return true;
  }
  
  return false;
}

function restoreConfig() {
  const originalConfig = 'next.config.ts';
  const backupConfig = 'next.config.ts.backup';
  
  if (fs.existsSync(backupConfig)) {
    fs.copyFileSync(backupConfig, originalConfig);
    fs.unlinkSync(backupConfig);
  }
}

async function main() {
  try {
    // Install dependencies
    if (!runCommand('pnpm install --frozen-lockfile', 'Installing dependencies')) {
      process.exit(1);
    }

    // Type check
    if (!runCommand('pnpm run type-check', 'Running type checks')) {
      console.log('⚠️  Type check failed, but continuing...');
    }

    // Lint
    if (!runCommand('pnpm run lint', 'Running linter')) {
      console.log('⚠️  Linting failed, but continuing...');
    }

    // Try building
    console.log('🏗️  Building application...');
    
    let buildSuccess = false;
    
    // Try normal build first
    console.log('🔄 Attempting normal build...');
    buildSuccess = runCommand('pnpm run build:windows', 'Normal build with cross-env');
    
    if (!buildSuccess) {
      console.log('❌ Normal build failed, trying safe build...');
      
      // Try safe build
      if (backupAndUseConfig('next.config.safe.ts')) {
        buildSuccess = runCommand('pnpm run build', 'Safe build');
        restoreConfig();
      }
    }
    
    if (!buildSuccess) {
      console.log('❌ Safe build failed, trying Windows build...');
      
      // Try Windows build
      if (backupAndUseConfig('next.config.windows.ts')) {
        buildSuccess = runCommand('pnpm run build', 'Windows build');
        restoreConfig();
      }
    }
    
    if (buildSuccess) {
      console.log('✅ Build completed successfully!');
      console.log('📁 Build output is in .next/ directory');
    } else {
      console.log('❌ All build attempts failed');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Build script failed:', error.message);
    restoreConfig();
    process.exit(1);
  }
}

main();