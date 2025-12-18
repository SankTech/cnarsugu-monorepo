/**
 * Simple test file to verify schemas work correctly
 * Run with: node dist/test-schemas.js
 */

import {
  autoProductSelectionSchema,
  motoProductSelectionSchema,
  multirisqueProductSelectionSchema,
  iacAddOnSchema,
  createSubscriptionV2Schema,
  createPaymentV2Schema,
  validate,
} from './index.js';

console.log('Testing CNAR Sugu Validation Schemas...\n');

// Test Auto schema
console.log('1. Testing Auto Product Selection Schema...');
const autoData = {
  cvRange: { min: 2, max: 4, label: '2-4 CV' },
  formula: 'TIERS',
  price: 150000,
  coverages: ['Responsabilité Civile', 'Défense et Recours'],
  addIac: false,
};

const autoResult = validate(autoProductSelectionSchema, autoData);
if (autoResult.success) {
  console.log('✓ Auto schema validation passed');
} else {
  console.log('✗ Auto schema validation failed:', autoResult.errors);
}

// Test Moto schema
console.log('\n2. Testing Moto Product Selection Schema...');
const motoData = {
  category: 'DJAKARTA',
  formula: 'ESSENTIELLE',
  price: 75000,
  coverages: ['Responsabilité Civile', 'IAC'],
  includesIac: true,
};

const motoResult = validate(motoProductSelectionSchema, motoData);
if (motoResult.success) {
  console.log('✓ Moto schema validation passed');
} else {
  console.log('✗ Moto schema validation failed:', motoResult.errors);
}

// Test Multirisk schema
console.log('\n3. Testing Multirisk Product Selection Schema...');
const multiriskData = {
  packageCode: 'BOUTIQUE_STANDARD',
  name: 'Boutique Standard',
  businessType: 'BOUTIQUE',
  price: 500000,
  coverageDetails: {
    chapters: [
      {
        name: 'Incendie',
        items: [
          {
            description: 'Dommages par incendie',
            capital: 10000000,
            franchise: '10% avec minimum 50,000 FCFA',
          },
        ],
      },
    ],
  },
};

const multiriskResult = validate(
  multirisqueProductSelectionSchema,
  multiriskData
);
if (multiriskResult.success) {
  console.log('✓ Multirisk schema validation passed');
} else {
  console.log('✗ Multirisk schema validation failed:', multiriskResult.errors);
}

// Test IAC schema
console.log('\n4. Testing IAC Add-On Schema...');
const iacData = {
  selected: true,
  price: 5000,
  deathCapital: 1000000,
  disabilityCapital: 500000,
  treatmentCapital: 100000,
};

const iacResult = validate(iacAddOnSchema, iacData);
if (iacResult.success) {
  console.log('✓ IAC schema validation passed');
} else {
  console.log('✗ IAC schema validation failed:', iacResult.errors);
}

// Test Subscription schema
console.log('\n5. Testing Subscription V2 Schema...');
const subscriptionData = {
  coverage: 'Auto Prestige',
  insurance: 'CNAR',
  name: 'Diallo',
  surname: 'Mamadou',
  phoneNumber: '+224621234567',
  price: '150000',
  productType: 'AUTO',
  productDetails: {
    cvRange: { min: 2, max: 4, label: '2-4 CV' },
    formula: 'TIERS',
    addIac: false,
  },
};

const subscriptionResult = validate(
  createSubscriptionV2Schema,
  subscriptionData
);
if (subscriptionResult.success) {
  console.log('✓ Subscription schema validation passed');
} else {
  console.log(
    '✗ Subscription schema validation failed:',
    subscriptionResult.errors
  );
}

// Test Payment schema
console.log('\n6. Testing Payment V2 Schema...');
const paymentData = {
  idFromClient: 'SUB-12345',
  amount: '150000',
  totalAmount: '150000',
  recipientNumber: '+224621234567',
  serviceCode: 'OM',
  callback: 'https://api.cnarsugu.com/payment/callback',
  additionnalInfos: {
    recipientEmail: 'mamadou.diallo@example.com',
    recipientFirstName: 'Mamadou',
    recipientLastName: 'Diallo',
    destinataire: 'Mamadou Diallo',
  },
  productType: 'AUTO',
  includesIac: false,
};

const paymentResult = validate(createPaymentV2Schema, paymentData);
if (paymentResult.success) {
  console.log('✓ Payment schema validation passed');
} else {
  console.log('✗ Payment schema validation failed:', paymentResult.errors);
}

// Test validation errors
console.log('\n7. Testing Validation Error Handling...');
const invalidAutoData = {
  cvRange: { min: 5, max: 2, label: 'Invalid' }, // max < min
  formula: 'INVALID_FORMULA',
  price: -100, // negative price
  coverages: [], // empty array
};

const invalidResult = validate(autoProductSelectionSchema, invalidAutoData);
if (!invalidResult.success) {
  console.log('✓ Error handling works correctly');
  console.log('  Errors detected:');
  invalidResult.errors.forEach((err) => {
    console.log(`    - ${err.path}: ${err.message}`);
  });
} else {
  console.log('✗ Error handling failed - invalid data passed validation');
}

console.log('\n✅ All schema tests completed!');
