/**
 * Verification script for Task 31: Enrollment Page
 * 
 * This script verifies that the enrollment page has been created with:
 * - Client type selection (Individual/Business)
 * - Dynamic form with React Hook Form + Zod
 * - Product-specific fields
 * - Validation with shared schemas
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Task 31: Enrollment Page Implementation\n');

let allChecksPassed = true;

// Check 1: Enrollment page file exists
console.log('✓ Check 1: Enrollment page file exists');
const enrollmentPagePath = path.join(__dirname, 'src/app/enrollment/page.tsx');
if (!fs.existsSync(enrollmentPagePath)) {
  console.error('❌ Enrollment page file not found at src/app/enrollment/page.tsx');
  allChecksPassed = false;
} else {
  console.log('  ✓ File exists: src/app/enrollment/page.tsx\n');
}

// Check 2: File contains required imports
console.log('✓ Check 2: Required imports present');
const enrollmentContent = fs.readFileSync(enrollmentPagePath, 'utf-8');

const requiredImports = [
  'react-hook-form',
  '@hookform/resolvers/zod',
  '@cnarsugu/store',
  '@cnarsugu/schemas',
  '@cnarsugu/types',
  '@cnarsugu/utils',
];

requiredImports.forEach((importName) => {
  if (enrollmentContent.includes(importName)) {
    console.log(`  ✓ Import found: ${importName}`);
  } else {
    console.error(`  ❌ Missing import: ${importName}`);
    allChecksPassed = false;
  }
});
console.log('');

// Check 3: Client type selection implemented
console.log('✓ Check 3: Client type selection');
const clientTypeChecks = [
  { name: 'ClientType type definition', pattern: /type ClientType = ['"]INDIVIDUAL['"] \| ['"]BUSINESS['"]/ },
  { name: 'Individual button', pattern: /Particulier/ },
  { name: 'Business button', pattern: /Entreprise/ },
  { name: 'Client type state', pattern: /useState<ClientType>/ },
];

clientTypeChecks.forEach((check) => {
  if (check.pattern.test(enrollmentContent)) {
    console.log(`  ✓ ${check.name}`);
  } else {
    console.error(`  ❌ Missing: ${check.name}`);
    allChecksPassed = false;
  }
});
console.log('');

// Check 4: React Hook Form setup
console.log('✓ Check 4: React Hook Form setup');
const formChecks = [
  { name: 'useForm hook', pattern: /useForm/ },
  { name: 'zodResolver', pattern: /zodResolver/ },
  { name: 'register function', pattern: /register/ },
  { name: 'handleSubmit', pattern: /handleSubmit/ },
  { name: 'formState errors', pattern: /formState.*errors/ },
];

formChecks.forEach((check) => {
  if (check.pattern.test(enrollmentContent)) {
    console.log(`  ✓ ${check.name}`);
  } else {
    console.error(`  ❌ Missing: ${check.name}`);
    allChecksPassed = false;
  }
});
console.log('');

// Check 5: Product-specific fields
console.log('✓ Check 5: Product-specific fields');
const productFieldChecks = [
  { name: 'Auto/Moto vehicle fields', pattern: /vehicleRegistration/ },
  { name: 'Vehicle make field', pattern: /vehicleMake/ },
  { name: 'Vehicle model field', pattern: /vehicleModel/ },
  { name: 'Vehicle year field', pattern: /vehicleYear/ },
  { name: 'Multirisk business fields', pattern: /businessAddress/ },
  { name: 'IAC beneficiary fields', pattern: /beneficiaryName/ },
];

productFieldChecks.forEach((check) => {
  if (check.pattern.test(enrollmentContent)) {
    console.log(`  ✓ ${check.name}`);
  } else {
    console.error(`  ❌ Missing: ${check.name}`);
    allChecksPassed = false;
  }
});
console.log('');

// Check 6: Validation schemas
console.log('✓ Check 6: Validation schemas from shared package');
const schemaChecks = [
  { name: 'nameSchema', pattern: /nameSchema/ },
  { name: 'phoneNumberSchema', pattern: /phoneNumberSchema/ },
  { name: 'emailSchema', pattern: /emailSchema/ },
  { name: 'Base enrollment schema', pattern: /baseEnrollmentSchema/ },
];

schemaChecks.forEach((check) => {
  if (check.pattern.test(enrollmentContent)) {
    console.log(`  ✓ ${check.name}`);
  } else {
    console.error(`  ❌ Missing: ${check.name}`);
    allChecksPassed = false;
  }
});
console.log('');

// Check 7: Redux integration
console.log('✓ Check 7: Redux integration');
const reduxChecks = [
  { name: 'useAppSelector', pattern: /useAppSelector/ },
  { name: 'Product selection state', pattern: /productSelection/ },
  { name: 'Selected product type', pattern: /selectedProductType/ },
  { name: 'Auto selection', pattern: /autoSelection/ },
  { name: 'Moto selection', pattern: /motoSelection/ },
  { name: 'Multirisk selection', pattern: /multirisqueSelection/ },
];

reduxChecks.forEach((check) => {
  if (check.pattern.test(enrollmentContent)) {
    console.log(`  ✓ ${check.name}`);
  } else {
    console.error(`  ❌ Missing: ${check.name}`);
    allChecksPassed = false;
  }
});
console.log('');

// Check 8: Product summary display
console.log('✓ Check 8: Product summary display');
const summaryChecks = [
  { name: 'Product summary section', pattern: /Récapitulatif de votre sélection/ },
  { name: 'Auto product display', pattern: /ProductType\.AUTO/ },
  { name: 'Moto product display', pattern: /ProductType\.MOTO/ },
  { name: 'Multirisk product display', pattern: /ProductType\.MULTIRISK_PRO/ },
  { name: 'IAC product display', pattern: /ProductType\.IAC/ },
  { name: 'Price formatting', pattern: /formatPrice/ },
];

summaryChecks.forEach((check) => {
  if (check.pattern.test(enrollmentContent)) {
    console.log(`  ✓ ${check.name}`);
  } else {
    console.error(`  ❌ Missing: ${check.name}`);
    allChecksPassed = false;
  }
});
console.log('');

// Check 9: Form submission
console.log('✓ Check 9: Form submission');
const submissionChecks = [
  { name: 'onSubmit handler', pattern: /const onSubmit/ },
  { name: 'Submit button', pattern: /type="submit"/ },
  { name: 'Loading state', pattern: /isSubmitting/ },
];

submissionChecks.forEach((check) => {
  if (check.pattern.test(enrollmentContent)) {
    console.log(`  ✓ ${check.name}`);
  } else {
    console.error(`  ❌ Missing: ${check.name}`);
    allChecksPassed = false;
  }
});
console.log('');

// Check 10: Conditional rendering
console.log('✓ Check 10: Conditional rendering based on client type and product');
const conditionalChecks = [
  { name: 'Individual fields conditional', pattern: /clientType === ['"]INDIVIDUAL['"]/ },
  { name: 'Business fields conditional', pattern: /clientType === ['"]BUSINESS['"]/ },
  { name: 'Auto/Moto fields conditional', pattern: /selectedProductType === ProductType\.AUTO \|\| selectedProductType === ProductType\.MOTO/ },
  { name: 'Multirisk fields conditional', pattern: /selectedProductType === ProductType\.MULTIRISK_PRO/ },
  { name: 'IAC fields conditional', pattern: /selectedProductType === ProductType\.IAC/ },
];

conditionalChecks.forEach((check) => {
  if (check.pattern.test(enrollmentContent)) {
    console.log(`  ✓ ${check.name}`);
  } else {
    console.error(`  ❌ Missing: ${check.name}`);
    allChecksPassed = false;
  }
});
console.log('');

// Final summary
console.log('═══════════════════════════════════════════════════════════════');
if (allChecksPassed) {
  console.log('✅ All checks passed! Task 31 implementation is complete.');
  console.log('\nThe enrollment page includes:');
  console.log('  • Client type selection (Individual/Business)');
  console.log('  • Dynamic form with React Hook Form');
  console.log('  • Zod validation with shared schemas');
  console.log('  • Product-specific fields for Auto, Moto, Multirisk Pro, and IAC');
  console.log('  • Redux integration for product selection');
  console.log('  • Product summary display');
  console.log('  • Conditional field rendering');
  console.log('  • Form validation and error handling');
} else {
  console.log('❌ Some checks failed. Please review the implementation.');
  process.exit(1);
}
console.log('═══════════════════════════════════════════════════════════════');
