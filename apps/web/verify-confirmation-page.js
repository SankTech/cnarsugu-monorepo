/**
 * Verification script for Confirmation Page (Task 33)
 * 
 * This script verifies that the confirmation page is properly implemented
 * with all required features.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Confirmation Page Implementation...\n');

let allChecksPassed = true;

// ============================================================================
// Helper Functions
// ============================================================================

function checkFile(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    console.log(`✅ ${description}`);
    return true;
  } else {
    console.log(`❌ ${description}`);
    allChecksPassed = false;
    return false;
  }
}

function checkFileContains(filePath, searchStrings, description) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ ${description} - File not found`);
    allChecksPassed = false;
    return false;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  const allFound = searchStrings.every(str => content.includes(str));
  
  if (allFound) {
    console.log(`✅ ${description}`);
    return true;
  } else {
    console.log(`❌ ${description}`);
    const missing = searchStrings.filter(str => !content.includes(str));
    console.log(`   Missing: ${missing.join(', ')}`);
    allChecksPassed = false;
    return false;
  }
}

// ============================================================================
// File Structure Checks
// ============================================================================

console.log('📁 Checking File Structure...\n');

checkFile(
  'src/app/confirmation/page.tsx',
  'Confirmation page exists'
);

console.log('');

// ============================================================================
// Component Implementation Checks
// ============================================================================

console.log('🔧 Checking Component Implementation...\n');

checkFileContains(
  'src/app/confirmation/page.tsx',
  [
    "'use client'",
    'export default function ConfirmationPage',
    'useAppSelector',
    'useAppDispatch',
  ],
  'Confirmation page is a client component with Redux hooks'
);

checkFileContains(
  'src/app/confirmation/page.tsx',
  [
    'const productSelection = useAppSelector',
    'const paymentState = useAppSelector',
    'const totalPrice = useAppSelector(selectTotalPrice)',
  ],
  'Confirmation page reads product selection and payment state'
);

checkFileContains(
  'src/app/confirmation/page.tsx',
  [
    "paymentState.status !== 'SUCCESS'",
    'router.push',
  ],
  'Confirmation page redirects if payment not successful'
);

console.log('');

// ============================================================================
// Product-Specific Confirmation Checks
// ============================================================================

console.log('🚗 Checking Product-Specific Confirmation...\n');

checkFileContains(
  'src/app/confirmation/page.tsx',
  [
    'ProductType.AUTO',
    'autoSelection',
    'AUTO_FORMULA_LABELS',
  ],
  'Auto product confirmation implemented'
);

checkFileContains(
  'src/app/confirmation/page.tsx',
  [
    'ProductType.MOTO',
    'motoSelection',
    'MOTO_FORMULA_LABELS',
  ],
  'Moto product confirmation implemented'
);

checkFileContains(
  'src/app/confirmation/page.tsx',
  [
    'ProductType.MULTIRISK_PRO',
    'multirisqueSelection',
  ],
  'Multirisk Pro product confirmation implemented'
);

checkFileContains(
  'src/app/confirmation/page.tsx',
  [
    'ProductType.IAC',
    'iacAddOn',
  ],
  'IAC product confirmation implemented'
);

console.log('');

// ============================================================================
// Receipt Download Checks
// ============================================================================

console.log('📄 Checking Receipt Download Feature...\n');

checkFileContains(
  'src/app/confirmation/page.tsx',
  [
    'handleDownloadReceipt',
    'generateReceiptText',
    'isDownloading',
  ],
  'Receipt download functionality implemented'
);

checkFileContains(
  'src/app/confirmation/page.tsx',
  [
    'const blob = new Blob',
    'window.URL.createObjectURL',
    'a.download',
  ],
  'Receipt download uses browser download API'
);

checkFileContains(
  'src/app/confirmation/page.tsx',
  [
    'Télécharger le reçu',
    'onClick={handleDownloadReceipt}',
  ],
  'Download receipt button exists'
);

console.log('');

// ============================================================================
// UI Elements Checks
// ============================================================================

console.log('🎨 Checking UI Elements...\n');

checkFileContains(
  'src/app/confirmation/page.tsx',
  [
    'Souscription confirmée',
    'Paiement réussi',
  ],
  'Success message displayed'
);

checkFileContains(
  'src/app/confirmation/page.tsx',
  [
    'paymentState.paymentId',
    'Numéro de confirmation',
  ],
  'Payment ID displayed'
);

checkFileContains(
  'src/app/confirmation/page.tsx',
  [
    'Récapitulatif de votre souscription',
    'formatPrice(totalPrice)',
  ],
  'Product summary displayed'
);

checkFileContains(
  'src/app/confirmation/page.tsx',
  [
    'Prochaines étapes',
    'email de confirmation',
  ],
  'Next steps section exists'
);

checkFileContains(
  'src/app/confirmation/page.tsx',
  [
    'Nouvelle souscription',
    'clearProductSelection',
    'resetPaymentForm',
  ],
  'New subscription button with state reset'
);

checkFileContains(
  'src/app/confirmation/page.tsx',
  [
    'Besoin d\'aide',
    'service client',
  ],
  'Support information displayed'
);

console.log('');

// ============================================================================
// Coverage Display Checks
// ============================================================================

console.log('📋 Checking Coverage Display...\n');

checkFileContains(
  'src/app/confirmation/page.tsx',
  [
    'Garanties incluses',
    'autoSelection.coverages',
    'motoSelection.coverages',
  ],
  'Coverage details displayed for Auto and Moto'
);

checkFileContains(
  'src/app/confirmation/page.tsx',
  [
    'multirisqueSelection.coverageDetails.chapters',
    'chapter.items',
  ],
  'Coverage chapters displayed for Multirisk Pro'
);

checkFileContains(
  'src/app/confirmation/page.tsx',
  [
    'iacAddOn.deathCapital',
    'iacAddOn.disabilityCapital',
    'iacAddOn.treatmentCapital',
  ],
  'IAC coverage details displayed'
);

console.log('');

// ============================================================================
// Payment Page Integration Check
// ============================================================================

console.log('🔗 Checking Payment Page Integration...\n');

checkFileContains(
  'src/app/payment/page.tsx',
  [
    "router.push('/confirmation')",
  ],
  'Payment page navigates to confirmation page'
);

console.log('');

// ============================================================================
// Summary
// ============================================================================

console.log('='.repeat(60));
if (allChecksPassed) {
  console.log('✅ All verification checks passed!');
  console.log('\nConfirmation page is properly implemented with:');
  console.log('  • Product-specific confirmation displays');
  console.log('  • Receipt download functionality');
  console.log('  • Payment success validation');
  console.log('  • Coverage details for all product types');
  console.log('  • Next steps and support information');
  console.log('  • New subscription flow');
  process.exit(0);
} else {
  console.log('❌ Some verification checks failed.');
  console.log('Please review the output above for details.');
  process.exit(1);
}
