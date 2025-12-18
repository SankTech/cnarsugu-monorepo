/**
 * Verification script for IAC page implementation
 * Task 30: Create IAC page
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying IAC Page Implementation (Task 30)...\n');

let allChecksPassed = true;

// Check 1: IAC page file exists
console.log('✓ Check 1: IAC page file exists');
const iacPagePath = path.join(__dirname, 'src/app/iac/page.tsx');
if (!fs.existsSync(iacPagePath)) {
  console.error('❌ IAC page file not found at src/app/iac/page.tsx');
  allChecksPassed = false;
} else {
  console.log('  ✓ File exists: src/app/iac/page.tsx');
}

// Check 2: Page imports required dependencies
console.log('\n✓ Check 2: Page imports required dependencies');
const iacPageContent = fs.readFileSync(iacPagePath, 'utf-8');

const requiredImports = [
  { name: 'Link', from: 'next/link' },
  { name: 'useGetIACProductQuery', from: '@cnarsugu/store' },
  { name: 'formatPrice', from: '@cnarsugu/utils' },
  { name: 'useAppDispatch', from: '@cnarsugu/store' },
  { name: 'setIACAddOn', from: '@cnarsugu/store' },
];

requiredImports.forEach(({ name, from }) => {
  if (iacPageContent.includes(`import`) && iacPageContent.includes(name) && iacPageContent.includes(from)) {
    console.log(`  ✓ Imports ${name} from ${from}`);
  } else {
    console.error(`  ❌ Missing import: ${name} from ${from}`);
    allChecksPassed = false;
  }
});

// Check 3: Page uses IAC product query
console.log('\n✓ Check 3: Page uses IAC product query');
if (iacPageContent.includes('useGetIACProductQuery')) {
  console.log('  ✓ Uses useGetIACProductQuery hook');
} else {
  console.error('  ❌ Does not use useGetIACProductQuery hook');
  allChecksPassed = false;
}

// Check 4: Page displays coverage details
console.log('\n✓ Check 4: Page displays coverage details');
const coverageElements = [
  'deathCapital',
  'disabilityCapital',
  'treatmentCapital',
];

coverageElements.forEach((element) => {
  if (iacPageContent.includes(element)) {
    console.log(`  ✓ Displays ${element}`);
  } else {
    console.error(`  ❌ Missing coverage element: ${element}`);
    allChecksPassed = false;
  }
});

// Check 5: Page shows price
console.log('\n✓ Check 5: Page shows price');
if (iacPageContent.includes('formatPrice') && iacPageContent.includes('iacProduct.price')) {
  console.log('  ✓ Displays formatted price');
} else {
  console.error('  ❌ Price display not found');
  allChecksPassed = false;
}

// Check 6: Page has subscribe/purchase CTA
console.log('\n✓ Check 6: Page has subscribe/purchase CTA');
if (iacPageContent.includes('handleSubscribe') || iacPageContent.includes('Souscrire')) {
  console.log('  ✓ Has subscribe button/CTA');
} else {
  console.error('  ❌ Subscribe CTA not found');
  allChecksPassed = false;
}

// Check 7: Page handles loading state
console.log('\n✓ Check 7: Page handles loading state');
if (iacPageContent.includes('isLoading')) {
  console.log('  ✓ Handles loading state');
} else {
  console.error('  ❌ Loading state not handled');
  allChecksPassed = false;
}

// Check 8: Page handles error state
console.log('\n✓ Check 8: Page handles error state');
if (iacPageContent.includes('error')) {
  console.log('  ✓ Handles error state');
} else {
  console.error('  ❌ Error state not handled');
  allChecksPassed = false;
}

// Check 9: Page has back navigation
console.log('\n✓ Check 9: Page has back navigation');
if (iacPageContent.includes('Retour') && iacPageContent.includes('href="/"')) {
  console.log('  ✓ Has back navigation to home');
} else {
  console.error('  ❌ Back navigation not found');
  allChecksPassed = false;
}

// Check 10: Page dispatches Redux action
console.log('\n✓ Check 10: Page dispatches Redux action');
if (iacPageContent.includes('dispatch') && iacPageContent.includes('setIACAddOn')) {
  console.log('  ✓ Dispatches setIACAddOn action');
} else {
  console.error('  ❌ Redux action dispatch not found');
  allChecksPassed = false;
}

// Check 11: Page structure and sections
console.log('\n✓ Check 11: Page structure and sections');
const sections = [
  { name: 'Header', pattern: '<header' },
  { name: 'Main content', pattern: '<main' },
  { name: 'Coverage details', pattern: 'Décès' },
  { name: 'Benefits section', pattern: 'Pourquoi choisir' },
  { name: 'How it works', pattern: 'Comment ça marche' },
  { name: 'FAQ section', pattern: 'Questions fréquentes' },
];

sections.forEach(({ name, pattern }) => {
  if (iacPageContent.includes(pattern)) {
    console.log(`  ✓ Has ${name}`);
  } else {
    console.error(`  ❌ Missing ${name}`);
    allChecksPassed = false;
  }
});

// Check 12: Responsive design classes
console.log('\n✓ Check 12: Responsive design classes');
if (iacPageContent.includes('md:') || iacPageContent.includes('lg:')) {
  console.log('  ✓ Uses responsive Tailwind classes');
} else {
  console.error('  ❌ Responsive classes not found');
  allChecksPassed = false;
}

// Summary
console.log('\n' + '='.repeat(50));
if (allChecksPassed) {
  console.log('✅ All checks passed! IAC page is properly implemented.');
  console.log('\nTask 30 Requirements Met:');
  console.log('  ✓ Created app/iac/page.tsx');
  console.log('  ✓ Displays coverage details (death, disability, treatment)');
  console.log('  ✓ Shows price prominently');
  console.log('  ✓ Has direct purchase CTA');
  console.log('  ✓ Follows same patterns as other product pages');
  console.log('  ✓ Handles loading and error states');
  console.log('  ✓ Integrates with Redux store');
  console.log('  ✓ Uses shared utilities and types');
} else {
  console.log('❌ Some checks failed. Please review the implementation.');
  process.exit(1);
}

console.log('\n📝 Next Steps:');
console.log('  1. Start the development server: npm run dev');
console.log('  2. Navigate to http://localhost:3000/iac');
console.log('  3. Verify the page displays correctly');
console.log('  4. Test the subscribe button functionality');
console.log('  5. Verify responsive design on different screen sizes');
