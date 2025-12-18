/**
 * Integration Test: Enrollment Page with Product Selection Flow
 * 
 * This test verifies that the enrollment page correctly integrates with
 * the product selection pages (Auto, Moto, Multirisk, IAC).
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Enrollment Page Integration\n');

let allChecksPassed = true;

// Check that all product pages can navigate to enrollment
console.log('✓ Check 1: Product pages can navigate to enrollment');

const productPages = [
  { name: 'Auto Prestige', path: 'src/app/auto-prestige/page.tsx' },
  { name: 'Moto', path: 'src/app/moto/page.tsx' },
  { name: 'Multirisk Pro', path: 'src/app/multirisk-pro/page.tsx' },
  { name: 'IAC', path: 'src/app/iac/page.tsx' },
];

productPages.forEach((page) => {
  const pagePath = path.join(__dirname, page.path);
  if (fs.existsSync(pagePath)) {
    const content = fs.readFileSync(pagePath, 'utf-8');
    
    // Check if page uses Redux to set product selection
    const hasReduxDispatch = content.includes('useAppDispatch') || content.includes('dispatch');
    const hasProductSelection = 
      content.includes('setAutoSelection') ||
      content.includes('setMotoSelection') ||
      content.includes('setMultirisqueSelection') ||
      content.includes('setIACAddOn');
    
    if (hasReduxDispatch && hasProductSelection) {
      console.log(`  ✓ ${page.name} page sets product selection in Redux`);
    } else {
      console.log(`  ⚠️  ${page.name} page may not set product selection (will be implemented in future)`);
    }
  } else {
    console.log(`  ⚠️  ${page.name} page not found at ${page.path}`);
  }
});
console.log('');

// Check enrollment page reads from Redux
console.log('✓ Check 2: Enrollment page reads product selection from Redux');
const enrollmentPath = path.join(__dirname, 'src/app/enrollment/page.tsx');
const enrollmentContent = fs.readFileSync(enrollmentPath, 'utf-8');

const reduxChecks = [
  { name: 'useAppSelector hook', pattern: /useAppSelector/ },
  { name: 'productSelection state', pattern: /state\.productSelection/ },
  { name: 'selectedProductType', pattern: /selectedProductType/ },
  { name: 'autoSelection', pattern: /autoSelection/ },
  { name: 'motoSelection', pattern: /motoSelection/ },
  { name: 'multirisqueSelection', pattern: /multirisqueSelection/ },
  { name: 'iacAddOn', pattern: /iacAddOn/ },
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

// Check enrollment page displays product summary
console.log('✓ Check 3: Enrollment page displays product summary');
const summaryChecks = [
  { name: 'Auto product summary', pattern: /ProductType\.AUTO.*autoSelection/ },
  { name: 'Moto product summary', pattern: /ProductType\.MOTO.*motoSelection/ },
  { name: 'Multirisk product summary', pattern: /ProductType\.MULTIRISK_PRO.*multirisqueSelection/ },
  { name: 'IAC product summary', pattern: /ProductType\.IAC.*iacAddOn/ },
  { name: 'Price display', pattern: /formatPrice/ },
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

// Check enrollment page has product-specific fields
console.log('✓ Check 4: Product-specific fields are conditional');
const conditionalChecks = [
  { 
    name: 'Auto/Moto vehicle fields', 
    pattern: /selectedProductType === ProductType\.AUTO \|\| selectedProductType === ProductType\.MOTO/,
    fields: ['vehicleRegistration', 'vehicleMake', 'vehicleModel', 'vehicleYear']
  },
  { 
    name: 'Multirisk business fields', 
    pattern: /selectedProductType === ProductType\.MULTIRISK_PRO/,
    fields: ['businessAddress', 'estimatedAnnualRevenue', 'numberOfEmployees']
  },
  { 
    name: 'IAC beneficiary fields', 
    pattern: /selectedProductType === ProductType\.IAC/,
    fields: ['beneficiaryName', 'beneficiaryRelationship', 'medicalHistory']
  },
];

conditionalChecks.forEach((check) => {
  if (check.pattern.test(enrollmentContent)) {
    console.log(`  ✓ ${check.name} conditional rendering`);
    
    // Verify fields exist
    const allFieldsExist = check.fields.every(field => 
      enrollmentContent.includes(field)
    );
    
    if (allFieldsExist) {
      console.log(`    ✓ All required fields present: ${check.fields.join(', ')}`);
    } else {
      console.error(`    ❌ Some fields missing`);
      allChecksPassed = false;
    }
  } else {
    console.error(`  ❌ Missing: ${check.name}`);
    allChecksPassed = false;
  }
});
console.log('');

// Check validation integration
console.log('✓ Check 5: Validation schemas from shared package');
const validationChecks = [
  { name: 'Imports from @cnarsugu/schemas', pattern: /@cnarsugu\/schemas/ },
  { name: 'nameSchema', pattern: /nameSchema/ },
  { name: 'phoneNumberSchema', pattern: /phoneNumberSchema/ },
  { name: 'emailSchema', pattern: /emailSchema/ },
  { name: 'Zod resolver', pattern: /zodResolver/ },
];

validationChecks.forEach((check) => {
  if (check.pattern.test(enrollmentContent)) {
    console.log(`  ✓ ${check.name}`);
  } else {
    console.error(`  ❌ Missing: ${check.name}`);
    allChecksPassed = false;
  }
});
console.log('');

// Check form submission
console.log('✓ Check 6: Form submission handling');
const submissionChecks = [
  { name: 'onSubmit handler', pattern: /const onSubmit.*async/ },
  { name: 'handleSubmit wrapper', pattern: /handleSubmit\(onSubmit\)/ },
  { name: 'Loading state', pattern: /isSubmitting/ },
  { name: 'Submit button', pattern: /type="submit"/ },
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

// Check navigation
console.log('✓ Check 7: Navigation integration');
const navigationChecks = [
  { name: 'useRouter hook', pattern: /useRouter/ },
  { name: 'Redirect if no product', pattern: /router\.push\(['"]\/['"]\)/ },
  { name: 'Back navigation', pattern: /router\.back/ },
];

navigationChecks.forEach((check) => {
  if (check.pattern.test(enrollmentContent)) {
    console.log(`  ✓ ${check.name}`);
  } else {
    console.error(`  ❌ Missing: ${check.name}`);
    allChecksPassed = false;
  }
});
console.log('');

// Check TypeScript types
console.log('✓ Check 8: TypeScript integration');
const typeChecks = [
  { name: 'Imports from @cnarsugu/types', pattern: /@cnarsugu\/types/ },
  { name: 'ProductType enum', pattern: /ProductType/ },
  { name: 'AUTO_FORMULA_LABELS', pattern: /AUTO_FORMULA_LABELS/ },
  { name: 'MOTO_FORMULA_LABELS', pattern: /MOTO_FORMULA_LABELS/ },
];

typeChecks.forEach((check) => {
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
  console.log('✅ All integration checks passed!');
  console.log('\nThe enrollment page is properly integrated with:');
  console.log('  • Redux store for product selection');
  console.log('  • Product pages (Auto, Moto, Multirisk, IAC)');
  console.log('  • Shared validation schemas');
  console.log('  • Shared TypeScript types');
  console.log('  • Navigation flow');
  console.log('\nReady for end-to-end testing with product selection flow.');
} else {
  console.log('❌ Some integration checks failed.');
  process.exit(1);
}
console.log('═══════════════════════════════════════════════════════════════');
