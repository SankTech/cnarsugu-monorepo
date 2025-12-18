/**
 * Verification script for Task 25: Next.js Web Application Setup
 * 
 * This script verifies that the Next.js app is properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Next.js Web Application Setup...\n');

const checks = [];

// Check 1: Verify package.json exists and has correct dependencies
try {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8')
  );
  
  const requiredDeps = [
    'next',
    'react',
    'react-dom',
    '@reduxjs/toolkit',
    'react-redux',
    'clsx',
    'tailwind-merge',
  ];
  
  const requiredWorkspaceDeps = [
    '@cnarsugu/types',
    '@cnarsugu/schemas',
    '@cnarsugu/store',
    '@cnarsugu/hooks',
    '@cnarsugu/utils',
  ];
  
  const missingDeps = requiredDeps.filter(
    dep => !packageJson.dependencies[dep]
  );
  
  const missingWorkspaceDeps = requiredWorkspaceDeps.filter(
    dep => !packageJson.dependencies[dep]
  );
  
  if (missingDeps.length === 0 && missingWorkspaceDeps.length === 0) {
    checks.push({ name: 'Dependencies', status: '✅', details: 'All required dependencies present' });
  } else {
    checks.push({ 
      name: 'Dependencies', 
      status: '❌', 
      details: `Missing: ${[...missingDeps, ...missingWorkspaceDeps].join(', ')}` 
    });
  }
} catch (error) {
  checks.push({ name: 'Dependencies', status: '❌', details: error.message });
}

// Check 2: Verify TypeScript configuration
try {
  const tsconfig = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'tsconfig.json'), 'utf8')
  );
  
  if (tsconfig.compilerOptions.strict === true) {
    checks.push({ name: 'TypeScript Strict Mode', status: '✅', details: 'Enabled' });
  } else {
    checks.push({ name: 'TypeScript Strict Mode', status: '❌', details: 'Not enabled' });
  }
} catch (error) {
  checks.push({ name: 'TypeScript Strict Mode', status: '❌', details: error.message });
}

// Check 3: Verify Next.js config exists
try {
  fs.accessSync(path.join(__dirname, 'next.config.ts'));
  checks.push({ name: 'Next.js Config', status: '✅', details: 'next.config.ts exists' });
} catch (error) {
  checks.push({ name: 'Next.js Config', status: '❌', details: 'next.config.ts missing' });
}

// Check 4: Verify Tailwind config exists
try {
  fs.accessSync(path.join(__dirname, 'tailwind.config.ts'));
  checks.push({ name: 'Tailwind Config', status: '✅', details: 'tailwind.config.ts exists' });
} catch (error) {
  checks.push({ name: 'Tailwind Config', status: '❌', details: 'tailwind.config.ts missing' });
}

// Check 5: Verify app directory structure
const requiredFiles = [
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/providers.tsx',
  'src/app/globals.css',
  'src/app/auto-prestige/page.tsx',
  'src/app/moto/page.tsx',
  'src/app/multirisk-pro/page.tsx',
  'src/app/iac/page.tsx',
];

const missingFiles = requiredFiles.filter(file => {
  try {
    fs.accessSync(path.join(__dirname, file));
    return false;
  } catch {
    return true;
  }
});

if (missingFiles.length === 0) {
  checks.push({ name: 'App Structure', status: '✅', details: 'All required files present' });
} else {
  checks.push({ 
    name: 'App Structure', 
    status: '❌', 
    details: `Missing: ${missingFiles.join(', ')}` 
  });
}

// Check 6: Verify environment files
try {
  fs.accessSync(path.join(__dirname, '.env.example'));
  fs.accessSync(path.join(__dirname, '.env.local'));
  checks.push({ name: 'Environment Files', status: '✅', details: '.env files present' });
} catch (error) {
  checks.push({ name: 'Environment Files', status: '❌', details: 'Missing .env files' });
}

// Check 7: Verify lib utilities
try {
  fs.accessSync(path.join(__dirname, 'src/lib/utils.ts'));
  checks.push({ name: 'Utility Functions', status: '✅', details: 'utils.ts exists' });
} catch (error) {
  checks.push({ name: 'Utility Functions', status: '❌', details: 'utils.ts missing' });
}

// Check 8: Verify ISR configuration in product pages
const productPages = [
  'src/app/auto-prestige/page.tsx',
  'src/app/moto/page.tsx',
  'src/app/multirisk-pro/page.tsx',
  'src/app/iac/page.tsx',
];

let isrConfigured = true;
productPages.forEach(page => {
  try {
    const content = fs.readFileSync(path.join(__dirname, page), 'utf8');
    if (!content.includes('export const revalidate')) {
      isrConfigured = false;
    }
  } catch {
    isrConfigured = false;
  }
});

if (isrConfigured) {
  checks.push({ name: 'ISR Configuration', status: '✅', details: 'Configured on all product pages' });
} else {
  checks.push({ name: 'ISR Configuration', status: '❌', details: 'Not configured on all pages' });
}

// Print results
console.log('Verification Results:\n');
checks.forEach(check => {
  console.log(`${check.status} ${check.name}`);
  console.log(`   ${check.details}\n`);
});

const allPassed = checks.every(check => check.status === '✅');

if (allPassed) {
  console.log('✅ All checks passed! Next.js app is properly configured.\n');
  process.exit(0);
} else {
  console.log('❌ Some checks failed. Please review the issues above.\n');
  process.exit(1);
}
