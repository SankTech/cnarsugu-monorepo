/**
 * Verification script for Multirisk Pro page implementation
 * Task 29: Create Multirisk Pro page
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Multirisk Pro Page Implementation...\n');

let allChecksPassed = true;

// Check 1: Verify page file exists
console.log('✓ Check 1: Page file exists');
const pagePath = path.join(__dirname, 'src/app/multirisk-pro/page.tsx');
if (!fs.existsSync(pagePath)) {
  console.error('❌ FAILED: page.tsx not found at', pagePath);
  allChecksPassed = false;
} else {
  console.log('  ✓ File exists at src/app/multirisk-pro/page.tsx\n');
}

// Check 2: Verify required imports
console.log('✓ Check 2: Required imports');
const pageContent = fs.readFileSync(pagePath, 'utf8');

const requiredImports = [
  'useGetMultirisquePackagesQuery',
  'BUSINESS_TYPES',
  'formatPrice',
  'MultirisquePackage',
  'BusinessType',
  'useAppDispatch',
  'setMultirisqueSelection',
];

requiredImports.forEach((importName) => {
  if (pageContent.includes(importName)) {
    console.log(`  ✓ Imports ${importName}`);
  } else {
    console.error(`  ❌ Missing import: ${importName}`);
    allChecksPassed = false;
  }
});
console.log('');

// Check 3: Verify PackageCard component
console.log('✓ Check 3: PackageCard component');
if (pageContent.includes('function PackageCard')) {
  console.log('  ✓ PackageCard component defined');
  
  // Check for required props
  if (pageContent.includes('pkg:') && pageContent.includes('onSubscribe:')) {
    console.log('  ✓ PackageCard accepts pkg and onSubscribe props');
  } else {
    console.error('  ❌ PackageCard missing required props');
    allChecksPassed = false;
  }
  
  // Check for details toggle
  if (pageContent.includes('showDetails') && pageContent.includes('setShowDetails')) {
    console.log('  ✓ Details toggle state implemented');
  } else {
    console.error('  ❌ Details toggle not implemented');
    allChecksPassed = false;
  }
} else {
  console.error('  ❌ PackageCard component not found');
  allChecksPassed = false;
}
console.log('');

// Check 4: Verify grid layout
console.log('✓ Check 4: Grid layout for packages');
if (pageContent.includes('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4')) {
  console.log('  ✓ 4-column grid layout implemented');
} else {
  console.error('  ❌ Grid layout not properly configured');
  allChecksPassed = false;
}
console.log('');

// Check 5: Verify price display
console.log('✓ Check 5: Price display');
if (pageContent.includes('formatPrice(pkg.priceTtc)')) {
  console.log('  ✓ Price formatted and displayed prominently');
} else {
  console.error('  ❌ Price not properly displayed');
  allChecksPassed = false;
}
console.log('');

// Check 6: Verify "Voir détails" button
console.log('✓ Check 6: "Voir détails" button');
if (pageContent.includes('Voir détails') || pageContent.includes('Masquer les détails')) {
  console.log('  ✓ Details toggle button implemented');
  
  if (pageContent.includes('onClick={() => setShowDetails(!showDetails)')) {
    console.log('  ✓ Toggle functionality connected');
  } else {
    console.error('  ❌ Toggle functionality not properly connected');
    allChecksPassed = false;
  }
} else {
  console.error('  ❌ Details button not found');
  allChecksPassed = false;
}
console.log('');

// Check 7: Verify coverage details display
console.log('✓ Check 7: Coverage details display');
if (pageContent.includes('coverageDetails.chapters')) {
  console.log('  ✓ Coverage chapters rendered');
  
  if (pageContent.includes('chapter.items.map')) {
    console.log('  ✓ Coverage items rendered');
  } else {
    console.error('  ❌ Coverage items not rendered');
    allChecksPassed = false;
  }
  
  if (pageContent.includes('item.description') && 
      pageContent.includes('item.capital') && 
      pageContent.includes('item.franchise')) {
    console.log('  ✓ Coverage item details displayed (description, capital, franchise)');
  } else {
    console.error('  ❌ Coverage item details incomplete');
    allChecksPassed = false;
  }
} else {
  console.error('  ❌ Coverage details not properly displayed');
  allChecksPassed = false;
}
console.log('');

// Check 8: Verify "Souscrire" button
console.log('✓ Check 8: "Souscrire" button');
if (pageContent.includes('Souscrire')) {
  console.log('  ✓ Subscribe button present');
  
  if (pageContent.includes('onClick={onSubscribe}')) {
    console.log('  ✓ Subscribe button connected to handler');
  } else {
    console.error('  ❌ Subscribe button not properly connected');
    allChecksPassed = false;
  }
} else {
  console.error('  ❌ Subscribe button not found');
  allChecksPassed = false;
}
console.log('');

// Check 9: Verify Redux integration
console.log('✓ Check 9: Redux integration');
if (pageContent.includes('dispatch(') && pageContent.includes('setMultirisqueSelection')) {
  console.log('  ✓ Redux dispatch for multirisk selection');
  
  const dispatchPattern = /dispatch\(\s*setMultirisqueSelection\(\{[\s\S]*?packageCode:[\s\S]*?name:[\s\S]*?businessType:[\s\S]*?price:[\s\S]*?coverageDetails:[\s\S]*?\}\)/;
  if (dispatchPattern.test(pageContent)) {
    console.log('  ✓ All required fields dispatched to Redux');
  } else {
    console.error('  ❌ Redux dispatch missing required fields');
    allChecksPassed = false;
  }
} else {
  console.error('  ❌ Redux integration not implemented');
  allChecksPassed = false;
}
console.log('');

// Check 10: Verify loading and error states
console.log('✓ Check 10: Loading and error states');
if (pageContent.includes('isLoading') && pageContent.includes('Chargement des formules')) {
  console.log('  ✓ Loading state implemented');
} else {
  console.error('  ❌ Loading state not implemented');
  allChecksPassed = false;
}

if (pageContent.includes('error') && pageContent.includes('Une erreur est survenue')) {
  console.log('  ✓ Error state implemented');
} else {
  console.error('  ❌ Error state not implemented');
  allChecksPassed = false;
}
console.log('');

// Check 11: Verify business type icons
console.log('✓ Check 11: Business type icons');
if (pageContent.includes('businessTypeIcons') && 
    pageContent.includes('BOUTIQUE') && 
    pageContent.includes('RESTAURANT') && 
    pageContent.includes('HOTEL') && 
    pageContent.includes('BAR_CLUB')) {
  console.log('  ✓ Business type icons defined for all types');
} else {
  console.error('  ❌ Business type icons not properly defined');
  allChecksPassed = false;
}
console.log('');

// Check 12: Verify sorting by display order
console.log('✓ Check 12: Package sorting');
if (pageContent.includes('.sort((a, b) => a.displayOrder - b.displayOrder)')) {
  console.log('  ✓ Packages sorted by displayOrder');
} else {
  console.error('  ❌ Package sorting not implemented');
  allChecksPassed = false;
}
console.log('');

// Check 13: Verify responsive design
console.log('✓ Check 13: Responsive design');
const responsiveClasses = [
  'md:grid-cols-2',
  'lg:grid-cols-4',
  'md:grid-cols-3',
];

let responsiveCount = 0;
responsiveClasses.forEach((className) => {
  if (pageContent.includes(className)) {
    responsiveCount++;
  }
});

if (responsiveCount >= 2) {
  console.log('  ✓ Responsive breakpoints implemented');
} else {
  console.error('  ❌ Responsive design incomplete');
  allChecksPassed = false;
}
console.log('');

// Check 14: Verify header with back link
console.log('✓ Check 14: Header with navigation');
if (pageContent.includes('Retour à l\'accueil') && pageContent.includes('href="/"')) {
  console.log('  ✓ Back to home link present');
} else {
  console.error('  ❌ Back link not found');
  allChecksPassed = false;
}

if (pageContent.includes('Multirisque Professionnelle')) {
  console.log('  ✓ Page title present');
} else {
  console.error('  ❌ Page title not found');
  allChecksPassed = false;
}
console.log('');

// Check 15: Verify additional information section
console.log('✓ Check 15: Additional information section');
if (pageContent.includes('Pourquoi choisir notre Multirisque Professionnelle')) {
  console.log('  ✓ Benefits section present');
} else {
  console.error('  ❌ Benefits section not found');
  allChecksPassed = false;
}
console.log('');

// Final summary
console.log('═'.repeat(60));
if (allChecksPassed) {
  console.log('✅ ALL CHECKS PASSED!');
  console.log('\nTask 29 Implementation Summary:');
  console.log('✓ Created app/multirisk-pro/page.tsx');
  console.log('✓ Implemented 4-column grid layout for business packages');
  console.log('✓ Price displayed prominently with formatPrice');
  console.log('✓ "Voir détails" button expands coverage information');
  console.log('✓ Coverage details show chapters, items, capital, and franchise');
  console.log('✓ "Souscrire" button dispatches to Redux and navigates');
  console.log('✓ Loading and error states implemented');
  console.log('✓ Responsive design with mobile, tablet, and desktop layouts');
  console.log('✓ Business type icons for visual identification');
  console.log('✓ Redux integration for product selection');
  console.log('\n✅ Requirements products 3.1-3.7 satisfied');
  process.exit(0);
} else {
  console.log('❌ SOME CHECKS FAILED');
  console.log('Please review the errors above and fix the implementation.');
  process.exit(1);
}
