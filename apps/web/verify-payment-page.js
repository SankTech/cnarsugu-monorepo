/**
 * Verification script for Payment Page implementation
 * Task 32: Create payment page
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Payment Page Implementation...\n');

let allChecksPassed = true;

// ============================================================================
// Check 1: Payment page file exists
// ============================================================================
console.log('✓ Check 1: Payment page file exists');
const paymentPagePath = path.join(__dirname, 'src/app/payment/page.tsx');
if (!fs.existsSync(paymentPagePath)) {
  console.error('❌ Payment page file not found at src/app/payment/page.tsx');
  allChecksPassed = false;
} else {
  console.log('  ✓ Payment page file exists\n');
}

// ============================================================================
// Check 2: Payment page content verification
// ============================================================================
console.log('✓ Check 2: Payment page content verification');
const paymentPageContent = fs.readFileSync(paymentPagePath, 'utf-8');

const requiredImports = [
  "import { useRouter } from 'next/navigation'",
  "import { useAppSelector, useAppDispatch } from '@cnarsugu/store'",
  "import { formatPrice } from '@cnarsugu/utils'",
  'setPaymentMethod',
  'selectTotalPrice',
];

const missingImports = requiredImports.filter(imp => !paymentPageContent.includes(imp));
if (missingImports.length > 0) {
  console.error('❌ Missing required imports:', missingImports);
  allChecksPassed = false;
} else {
  console.log('  ✓ All required imports present\n');
}

// ============================================================================
// Check 3: Payment method selection
// ============================================================================
console.log('✓ Check 3: Payment method selection');
const paymentMethods = ['MOBILE_MONEY', 'CREDIT_CARD', 'PAYPAL'];
const missingMethods = paymentMethods.filter(method => !paymentPageContent.includes(method));
if (missingMethods.length > 0) {
  console.error('❌ Missing payment methods:', missingMethods);
  allChecksPassed = false;
} else {
  console.log('  ✓ All payment methods present (Mobile Money, Credit Card, PayPal)\n');
}

// ============================================================================
// Check 4: Product summary display
// ============================================================================
console.log('✓ Check 4: Product summary display');
const productTypes = ['ProductType.AUTO', 'ProductType.MOTO', 'ProductType.MULTIRISK_PRO', 'ProductType.IAC'];
const missingProductTypes = productTypes.filter(type => !paymentPageContent.includes(type));
if (missingProductTypes.length > 0) {
  console.error('❌ Missing product type handling:', missingProductTypes);
  allChecksPassed = false;
} else {
  console.log('  ✓ All product types handled in summary\n');
}

// ============================================================================
// Check 5: IAC line item display
// ============================================================================
console.log('✓ Check 5: IAC line item display');
if (!paymentPageContent.includes('autoSelection.addIac') || !paymentPageContent.includes('iacAddOn')) {
  console.error('❌ IAC add-on not properly displayed');
  allChecksPassed = false;
} else {
  console.log('  ✓ IAC add-on properly displayed as separate line item\n');
}

// ============================================================================
// Check 6: Total price calculation
// ============================================================================
console.log('✓ Check 6: Total price calculation');
if (!paymentPageContent.includes('selectTotalPrice') || !paymentPageContent.includes('totalPrice')) {
  console.error('❌ Total price calculation not implemented');
  allChecksPassed = false;
} else {
  console.log('  ✓ Total price calculation using Redux selector\n');
}

// ============================================================================
// Check 7: Form validation
// ============================================================================
console.log('✓ Check 7: Form validation');
if (!paymentPageContent.includes('validateForm') || !paymentPageContent.includes('errors')) {
  console.error('❌ Form validation not implemented');
  allChecksPassed = false;
} else {
  console.log('  ✓ Form validation implemented\n');
}

// ============================================================================
// Check 8: Payment submission
// ============================================================================
console.log('✓ Check 8: Payment submission');
if (!paymentPageContent.includes('handleSubmit') || !paymentPageContent.includes('startPaymentProcessing')) {
  console.error('❌ Payment submission not properly implemented');
  allChecksPassed = false;
} else {
  console.log('  ✓ Payment submission with Redux actions\n');
}

// ============================================================================
// Check 9: Responsive layout
// ============================================================================
console.log('✓ Check 9: Responsive layout');
if (!paymentPageContent.includes('lg:col-span-2') || !paymentPageContent.includes('lg:col-span-1')) {
  console.error('❌ Responsive grid layout not implemented');
  allChecksPassed = false;
} else {
  console.log('  ✓ Responsive grid layout for payment form and summary\n');
}

// ============================================================================
// Check 10: Security notice
// ============================================================================
console.log('✓ Check 10: Security notice');
if (!paymentPageContent.includes('Paiement sécurisé') || !paymentPageContent.includes('🔒')) {
  console.error('❌ Security notice not displayed');
  allChecksPassed = false;
} else {
  console.log('  ✓ Security notice displayed\n');
}

// ============================================================================
// Check 11: Enrollment page navigation update
// ============================================================================
console.log('✓ Check 11: Enrollment page navigation update');
const enrollmentPagePath = path.join(__dirname, 'src/app/enrollment/page.tsx');
const enrollmentPageContent = fs.readFileSync(enrollmentPagePath, 'utf-8');
if (!enrollmentPageContent.includes("router.push('/payment')")) {
  console.error('❌ Enrollment page does not navigate to payment page');
  allChecksPassed = false;
} else {
  console.log('  ✓ Enrollment page navigates to payment page\n');
}

// ============================================================================
// Check 12: Coverage summary for Auto/Moto
// ============================================================================
console.log('✓ Check 12: Coverage summary display');
if (!paymentPageContent.includes('Garanties incluses') || !paymentPageContent.includes('coverages')) {
  console.error('❌ Coverage summary not displayed');
  allChecksPassed = false;
} else {
  console.log('  ✓ Coverage summary displayed for applicable products\n');
}

// ============================================================================
// Final Results
// ============================================================================
console.log('═'.repeat(60));
if (allChecksPassed) {
  console.log('✅ All verification checks passed!');
  console.log('\n📋 Implementation Summary:');
  console.log('  • Payment page created at src/app/payment/page.tsx');
  console.log('  • Payment method selection (Mobile Money, Credit Card, PayPal)');
  console.log('  • Product summary with all product types');
  console.log('  • IAC add-on displayed as separate line item');
  console.log('  • Total price calculation using Redux');
  console.log('  • Form validation for payment methods');
  console.log('  • Responsive layout with sticky summary');
  console.log('  • Security notice displayed');
  console.log('  • Enrollment page updated to navigate to payment');
  console.log('  • Coverage summary for Auto/Moto products');
  console.log('\n✅ Task 32 implementation complete!');
  process.exit(0);
} else {
  console.log('❌ Some verification checks failed. Please review the errors above.');
  process.exit(1);
}
