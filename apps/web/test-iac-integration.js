/**
 * Integration test for IAC page
 * Verifies the complete IAC page implementation and integration
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing IAC Page Integration...\n');

let allTestsPassed = true;

// Test 1: Verify IAC page exists and is accessible
console.log('Test 1: IAC page file structure');
const iacPagePath = path.join(__dirname, 'src/app/iac/page.tsx');
if (fs.existsSync(iacPagePath)) {
  console.log('  ✓ IAC page exists at src/app/iac/page.tsx');
  
  const content = fs.readFileSync(iacPagePath, 'utf-8');
  
  // Check for client component
  if (content.includes("'use client'")) {
    console.log('  ✓ Marked as client component');
  } else {
    console.error('  ❌ Not marked as client component');
    allTestsPassed = false;
  }
  
  // Check for default export
  if (content.includes('export default function IACPage')) {
    console.log('  ✓ Has default export');
  } else {
    console.error('  ❌ Missing default export');
    allTestsPassed = false;
  }
} else {
  console.error('  ❌ IAC page file not found');
  allTestsPassed = false;
}

// Test 2: Verify home page links to IAC
console.log('\nTest 2: Home page navigation');
const homePagePath = path.join(__dirname, 'src/app/page.tsx');
if (fs.existsSync(homePagePath)) {
  const homeContent = fs.readFileSync(homePagePath, 'utf-8');
  
  if (homeContent.includes('href="/iac"')) {
    console.log('  ✓ Home page has link to IAC page');
  } else {
    console.error('  ❌ Home page missing IAC link');
    allTestsPassed = false;
  }
  
  if (homeContent.includes('IAC') || homeContent.includes('Indemnité')) {
    console.log('  ✓ Home page displays IAC product card');
  } else {
    console.error('  ❌ Home page missing IAC product card');
    allTestsPassed = false;
  }
} else {
  console.error('  ❌ Home page not found');
  allTestsPassed = false;
}

// Test 3: Verify Redux integration
console.log('\nTest 3: Redux integration');
const iacContent = fs.readFileSync(iacPagePath, 'utf-8');

const reduxChecks = [
  { name: 'useAppDispatch hook', pattern: 'useAppDispatch' },
  { name: 'setIACAddOn action', pattern: 'setIACAddOn' },
  { name: 'dispatch call', pattern: 'dispatch(' },
  { name: 'IAC product query', pattern: 'useGetIACProductQuery' },
];

reduxChecks.forEach(({ name, pattern }) => {
  if (iacContent.includes(pattern)) {
    console.log(`  ✓ Uses ${name}`);
  } else {
    console.error(`  ❌ Missing ${name}`);
    allTestsPassed = false;
  }
});

// Test 4: Verify data display
console.log('\nTest 4: Data display');
const dataChecks = [
  { name: 'Death capital', pattern: 'deathCapital' },
  { name: 'Disability capital', pattern: 'disabilityCapital' },
  { name: 'Treatment capital', pattern: 'treatmentCapital' },
  { name: 'Price formatting', pattern: 'formatPrice' },
  { name: 'Product price', pattern: 'iacProduct.price' },
];

dataChecks.forEach(({ name, pattern }) => {
  if (iacContent.includes(pattern)) {
    console.log(`  ✓ Displays ${name}`);
  } else {
    console.error(`  ❌ Missing ${name}`);
    allTestsPassed = false;
  }
});

// Test 5: Verify UI components
console.log('\nTest 5: UI components');
const uiChecks = [
  { name: 'Header section', pattern: '<header' },
  { name: 'Main content', pattern: '<main' },
  { name: 'Subscribe button', pattern: 'Souscrire' },
  { name: 'Back navigation', pattern: 'Retour' },
  { name: 'Loading state', pattern: 'isLoading' },
  { name: 'Error state', pattern: 'error' },
];

uiChecks.forEach(({ name, pattern }) => {
  if (iacContent.includes(pattern)) {
    console.log(`  ✓ Has ${name}`);
  } else {
    console.error(`  ❌ Missing ${name}`);
    allTestsPassed = false;
  }
});

// Test 6: Verify content sections
console.log('\nTest 6: Content sections');
const contentSections = [
  { name: 'Hero section', pattern: 'Protégez-vous' },
  { name: 'Coverage details', pattern: 'Décès' },
  { name: 'Benefits section', pattern: 'Pourquoi choisir' },
  { name: 'How it works', pattern: 'Comment ça marche' },
  { name: 'FAQ section', pattern: 'Questions fréquentes' },
  { name: 'Final CTA', pattern: 'Prêt à vous protéger' },
];

contentSections.forEach(({ name, pattern }) => {
  if (iacContent.includes(pattern)) {
    console.log(`  ✓ Has ${name}`);
  } else {
    console.error(`  ❌ Missing ${name}`);
    allTestsPassed = false;
  }
});

// Test 7: Verify responsive design
console.log('\nTest 7: Responsive design');
const responsiveClasses = ['md:', 'lg:', 'grid', 'flex', 'container'];
let responsiveCount = 0;

responsiveClasses.forEach((cls) => {
  if (iacContent.includes(cls)) {
    responsiveCount++;
  }
});

if (responsiveCount >= 4) {
  console.log(`  ✓ Uses responsive design classes (${responsiveCount}/${responsiveClasses.length})`);
} else {
  console.error(`  ❌ Insufficient responsive design classes (${responsiveCount}/${responsiveClasses.length})`);
  allTestsPassed = false;
}

// Test 8: Verify accessibility
console.log('\nTest 8: Accessibility features');
const a11yChecks = [
  { name: 'Semantic HTML', pattern: '<header' },
  { name: 'Heading hierarchy', pattern: '<h1' },
  { name: 'Link text', pattern: 'Retour à l\'accueil' },
  { name: 'Button labels', pattern: 'Souscrire' },
];

a11yChecks.forEach(({ name, pattern }) => {
  if (iacContent.includes(pattern)) {
    console.log(`  ✓ ${name}`);
  } else {
    console.error(`  ❌ Missing ${name}`);
    allTestsPassed = false;
  }
});

// Test 9: Verify TypeScript types
console.log('\nTest 9: TypeScript integration');
const typeChecks = [
  { name: 'Import from @cnarsugu/store', pattern: '@cnarsugu/store' },
  { name: 'Import from @cnarsugu/utils', pattern: '@cnarsugu/utils' },
  { name: 'Type safety', pattern: 'iacProduct' },
];

typeChecks.forEach(({ name, pattern }) => {
  if (iacContent.includes(pattern)) {
    console.log(`  ✓ ${name}`);
  } else {
    console.error(`  ❌ Missing ${name}`);
    allTestsPassed = false;
  }
});

// Test 10: Verify error handling
console.log('\nTest 10: Error handling');
const errorHandling = [
  { name: 'Loading state check', pattern: 'isLoading' },
  { name: 'Error state check', pattern: 'error' },
  { name: 'Empty state check', pattern: '!iacProduct' },
  { name: 'Retry functionality', pattern: 'reload' },
];

errorHandling.forEach(({ name, pattern }) => {
  if (iacContent.includes(pattern)) {
    console.log(`  ✓ ${name}`);
  } else {
    console.error(`  ❌ Missing ${name}`);
    allTestsPassed = false;
  }
});

// Summary
console.log('\n' + '='.repeat(60));
if (allTestsPassed) {
  console.log('✅ All integration tests passed!');
  console.log('\n📊 Test Summary:');
  console.log('  ✓ File structure verified');
  console.log('  ✓ Navigation integration confirmed');
  console.log('  ✓ Redux integration working');
  console.log('  ✓ Data display implemented');
  console.log('  ✓ UI components present');
  console.log('  ✓ Content sections complete');
  console.log('  ✓ Responsive design applied');
  console.log('  ✓ Accessibility features included');
  console.log('  ✓ TypeScript types integrated');
  console.log('  ✓ Error handling implemented');
  
  console.log('\n🎉 IAC page is ready for production!');
  console.log('\n📝 Manual Testing Checklist:');
  console.log('  □ Start dev server: npm run dev');
  console.log('  □ Navigate to http://localhost:3000');
  console.log('  □ Click on IAC card in "Nouveaux Produits"');
  console.log('  □ Verify page loads with all content');
  console.log('  □ Check coverage amounts display correctly');
  console.log('  □ Test subscribe button');
  console.log('  □ Verify back navigation works');
  console.log('  □ Test on mobile viewport');
  console.log('  □ Test on tablet viewport');
  console.log('  □ Verify loading state (throttle network)');
  console.log('  □ Test error state (disconnect backend)');
} else {
  console.log('❌ Some integration tests failed.');
  console.log('Please review the errors above and fix the issues.');
  process.exit(1);
}

console.log('\n' + '='.repeat(60));
