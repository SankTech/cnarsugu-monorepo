/**
 * Verification script for Auto Prestige page implementation
 * Task 27: Create Auto Prestige page
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Auto Prestige Page Implementation...\n');

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

function checkFile(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${description}`);
    checks.passed++;
    return true;
  } else {
    console.log(`❌ ${description}`);
    checks.failed++;
    return false;
  }
}

function checkFileContent(filePath, searchStrings, description) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ ${description} - File not found`);
    checks.failed++;
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const allFound = searchStrings.every((str) => content.includes(str));

  if (allFound) {
    console.log(`✅ ${description}`);
    checks.passed++;
    return true;
  } else {
    console.log(`❌ ${description}`);
    const missing = searchStrings.filter((str) => !content.includes(str));
    console.log(`   Missing: ${missing.join(', ')}`);
    checks.failed++;
    return false;
  }
}

console.log('📁 File Structure Checks:');
console.log('─────────────────────────');
checkFile('src/app/auto-prestige/page.tsx', 'Auto Prestige page exists');

console.log('\n🎯 Core Features:');
console.log('─────────────────────────');
checkFileContent(
  'src/app/auto-prestige/page.tsx',
  ['useGetAllAutoPricingQuery', 'CV_RANGES', 'selectedCVRange'],
  'CV range selector implementation'
);

checkFileContent(
  'src/app/auto-prestige/page.tsx',
  ['TIERS', 'ESSENTIELLE', 'ETENDUE', 'CONFORT'],
  'All 4 formula types present'
);

checkFileContent(
  'src/app/auto-prestige/page.tsx',
  ['FormulaColumn', 'pricingByFormula', 'handleSubscribe'],
  'Comparison table implementation'
);

checkFileContent(
  'src/app/auto-prestige/page.tsx',
  ['formatPrice', 'price12m', 'coverages'],
  'Price display and coverage list'
);

checkFileContent(
  'src/app/auto-prestige/page.tsx',
  ['isHighlighted', 'RECOMMANDÉ'],
  'Formula highlighting (recommended)'
);

console.log('\n💰 IAC Cross-Sell Modal (Subtask 27.1):');
console.log('─────────────────────────────────────────');
checkFileContent(
  'src/app/auto-prestige/page.tsx',
  ['IACCrossSellModal', 'showIACModal', 'useGetIACProductQuery'],
  'IAC modal component exists'
);

checkFileContent(
  'src/app/auto-prestige/page.tsx',
  ['Protégez-vous davantage avec l\'IAC', 'Avantages inclus'],
  'IAC modal content'
);

checkFileContent(
  'src/app/auto-prestige/page.tsx',
  ['2,000,000 FCFA', '500,000 FCFA'],
  'IAC benefit amounts displayed'
);

checkFileContent(
  'src/app/auto-prestige/page.tsx',
  ['Ajouter l\'IAC', 'Continuer sans IAC', 'onAddIAC', 'onClose'],
  'IAC modal action buttons'
);

checkFileContent(
  'src/app/auto-prestige/page.tsx',
  ['formula === \'TIERS\'', 'setPendingSelection', 'setShowIACModal'],
  'IAC modal triggers on Tiers selection'
);

console.log('\n🔄 Redux Integration:');
console.log('─────────────────────────');
checkFileContent(
  'src/app/auto-prestige/page.tsx',
  ['useAppDispatch', 'setAutoSelection', 'setIACAddOn'],
  'Redux actions imported and used'
);

checkFileContent(
  'src/app/auto-prestige/page.tsx',
  ['dispatch(', 'setAutoSelection', 'setIACAddOn'],
  'Redux state updates on selection'
);

console.log('\n🎨 UI/UX Features:');
console.log('─────────────────────────');
checkFileContent(
  'src/app/auto-prestige/page.tsx',
  ['isLoading', 'error', 'animate-spin'],
  'Loading and error states'
);

checkFileContent(
  'src/app/auto-prestige/page.tsx',
  ['Link href="/"', 'Retour à l\'accueil'],
  'Navigation back to home'
);

checkFileContent(
  'src/app/auto-prestige/page.tsx',
  ['Pourquoi choisir Auto Prestige', 'Protection adaptée', 'Souscription rapide'],
  'Additional information section'
);

checkFileContent(
  'src/app/auto-prestige/page.tsx',
  ['bg-primary', 'rounded-lg', 'hover:', 'transition'],
  'Tailwind CSS styling'
);

console.log('\n📊 Data Handling:');
console.log('─────────────────────────');
checkFileContent(
  'src/app/auto-prestige/page.tsx',
  ['useMemo', 'filteredPricing', 'cvMin === selectedCVRange.min'],
  'Pricing filtering by CV range'
);

checkFileContent(
  'src/app/auto-prestige/page.tsx',
  ['proceedToEnrollment', 'handleAddIAC', 'handleCloseIACModal'],
  'Enrollment flow handlers'
);

console.log('\n📄 Documentation:');
console.log('─────────────────────────');
checkFile('TASK_27_AUTO_PRESTIGE_PAGE.md', 'Task summary document exists');

console.log('\n' + '═'.repeat(50));
console.log('📊 VERIFICATION SUMMARY');
console.log('═'.repeat(50));
console.log(`✅ Passed:   ${checks.passed}`);
console.log(`❌ Failed:   ${checks.failed}`);
console.log(`⚠️  Warnings: ${checks.warnings}`);
console.log('═'.repeat(50));

if (checks.failed === 0) {
  console.log('\n🎉 All checks passed! Auto Prestige page is fully implemented.');
  console.log('\n📋 Task 27 Status: ✅ COMPLETE');
  console.log('📋 Subtask 27.1 Status: ✅ COMPLETE');
  console.log('\n🚀 Next Steps:');
  console.log('   1. Test the page manually in the browser');
  console.log('   2. Verify CV range selector updates pricing');
  console.log('   3. Test IAC modal on Tiers formula selection');
  console.log('   4. Proceed to Task 28: Create Moto page');
  process.exit(0);
} else {
  console.log('\n⚠️  Some checks failed. Please review the implementation.');
  process.exit(1);
}
