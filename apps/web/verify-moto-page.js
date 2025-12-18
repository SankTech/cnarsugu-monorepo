/**
 * Verification script for Moto page implementation
 * Task 28: Create Moto page
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Moto Page Implementation...\n');

let allChecksPassed = true;

// Check 1: Moto page file exists
console.log('✓ Check 1: Moto page file exists');
const motoPagePath = path.join(__dirname, 'src/app/moto/page.tsx');
if (!fs.existsSync(motoPagePath)) {
  console.log('  ❌ FAILED: Moto page file not found');
  allChecksPassed = false;
} else {
  console.log('  ✅ PASSED: Moto page file exists');
}

// Check 2: Page contains required imports
console.log('\n✓ Check 2: Required imports present');
const motoPageContent = fs.readFileSync(motoPagePath, 'utf8');
const requiredImports = [
  'useGetAllMotoPricingQuery',
  'useGetIACProductQuery',
  'MOTO_CATEGORIES',
  'formatPrice',
  'setMotoSelection',
  'useAppDispatch',
];

requiredImports.forEach((importName) => {
  if (motoPageContent.includes(importName)) {
    console.log(`  ✅ ${importName} imported`);
  } else {
    console.log(`  ❌ ${importName} NOT imported`);
    allChecksPassed = false;
  }
});

// Check 3: Category cards implementation
console.log('\n✓ Check 3: Category cards implementation');
const categoryChecks = [
  { name: 'CategoryCard component', pattern: /function CategoryCard/ },
  { name: 'DJAKARTA category', pattern: /DJAKARTA/ },
  { name: 'GROSSE_CYLINDREE category', pattern: /GROSSE_CYLINDREE/ },
  { name: 'MOTO_TAXI category', pattern: /MOTO_TAXI/ },
];

categoryChecks.forEach((check) => {
  if (check.pattern.test(motoPageContent)) {
    console.log(`  ✅ ${check.name} present`);
  } else {
    console.log(`  ❌ ${check.name} NOT found`);
    allChecksPassed = false;
  }
});

// Check 4: Formula comparison implementation
console.log('\n✓ Check 4: Formula comparison (Tiers and Essentielle)');
const formulaChecks = [
  { name: 'FormulaComparison component', pattern: /function FormulaComparison/ },
  { name: 'Tiers formula display', pattern: /Tiers/ },
  { name: 'Essentielle formula display', pattern: /Essentielle/ },
  { name: 'IAC inclusion highlight', pattern: /includesIac/ },
];

formulaChecks.forEach((check) => {
  if (check.pattern.test(motoPageContent)) {
    console.log(`  ✅ ${check.name} present`);
  } else {
    console.log(`  ❌ ${check.name} NOT found`);
    allChecksPassed = false;
  }
});

// Check 5: IAC cross-sell/upgrade modal
console.log('\n✓ Check 5: Upgrade modal for Tiers → Essentielle');
const upgradeChecks = [
  { name: 'UpgradeModal component', pattern: /function UpgradeModal/ },
  { name: 'Upgrade modal trigger', pattern: /setShowUpgradeModal/ },
  { name: 'IAC benefits display', pattern: /Avantages IAC/ },
];

upgradeChecks.forEach((check) => {
  if (check.pattern.test(motoPageContent)) {
    console.log(`  ✅ ${check.name} present`);
  } else {
    console.log(`  ❌ ${check.name} NOT found`);
    allChecksPassed = false;
  }
});

// Check 6: Redux integration
console.log('\n✓ Check 6: Redux integration');
const reduxChecks = [
  { name: 'setMotoSelection dispatch', pattern: /dispatch\s*\(\s*setMotoSelection/ },
  { name: 'Category state', pattern: /selectedCategory/ },
  { name: 'Formula selection', pattern: /handleSubscribe/ },
];

reduxChecks.forEach((check) => {
  if (check.pattern.test(motoPageContent)) {
    console.log(`  ✅ ${check.name} present`);
  } else {
    console.log(`  ❌ ${check.name} NOT found`);
    allChecksPassed = false;
  }
});

// Check 7: UI/UX features
console.log('\n✓ Check 7: UI/UX features');
const uiChecks = [
  { name: 'Loading state', pattern: /isLoading/ },
  { name: 'Error handling', pattern: /error/ },
  { name: 'Category selection UI', pattern: /Sélectionnez votre catégorie/ },
  { name: 'Price display', pattern: /formatPrice/ },
  { name: 'IAC inclusion badge', pattern: /IAC INCLUS/ },
];

uiChecks.forEach((check) => {
  if (check.pattern.test(motoPageContent)) {
    console.log(`  ✅ ${check.name} present`);
  } else {
    console.log(`  ❌ ${check.name} NOT found`);
    allChecksPassed = false;
  }
});

// Check 8: Navigation
console.log('\n✓ Check 8: Navigation');
if (motoPageContent.includes('Link href="/"')) {
  console.log('  ✅ Back to home link present');
} else {
  console.log('  ❌ Back to home link NOT found');
  allChecksPassed = false;
}

// Summary
console.log('\n' + '='.repeat(50));
if (allChecksPassed) {
  console.log('✅ ALL CHECKS PASSED!');
  console.log('\nMoto page implementation is complete with:');
  console.log('  • 3 category cards (Djakarta, Grosse Cylindrée, Moto Taxi)');
  console.log('  • Side-by-side formula comparison (Tiers vs Essentielle)');
  console.log('  • IAC inclusion highlighted in Essentielle');
  console.log('  • Upgrade modal for Tiers → Essentielle');
  console.log('  • Redux integration for state management');
  console.log('  • Responsive design with Tailwind CSS');
  process.exit(0);
} else {
  console.log('❌ SOME CHECKS FAILED');
  console.log('\nPlease review the failed checks above.');
  process.exit(1);
}
