/**
 * Property-Based Test: Validation Consistency
 * 
 * **Feature: schemas, Property 1: Validation consistency across platforms**
 * 
 * This test verifies that the same input produces the same validation result
 * regardless of where it's used (web, mobile, backend).
 * 
 * The property being tested: For any valid input data, validating it multiple
 * times should always produce the same result (idempotent validation).
 */

import * as fc from 'fast-check';
import {
  autoProductSelectionSchema,
  motoProductSelectionSchema,
  multirisqueProductSelectionSchema,
  iacAddOnSchema,
  validate,
} from './index.js';

// ============================================================================
// Generators for property-based testing
// ============================================================================

/**
 * Generator for CV range
 */
const cvRangeArb = fc.record({
  min: fc.integer({ min: 1, max: 50 }),
  max: fc.integer({ min: 1, max: 50 }),
  label: fc.string({ minLength: 1, maxLength: 20 }),
}).filter((range) => range.max >= range.min);

/**
 * Generator for Auto product selection
 */
const autoProductArb = fc.record({
  cvRange: cvRangeArb,
  formula: fc.constantFrom('TIERS', 'ESSENTIELLE', 'ETENDUE', 'CONFORT'),
  price: fc.integer({ min: 1, max: 10000000 }),
  coverages: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 10 }),
  addIac: fc.boolean(),
});

/**
 * Generator for Moto product selection
 */
const motoProductArb = fc.record({
  category: fc.constantFrom('DJAKARTA', 'GROSSE_CYLINDREE', 'MOTO_TAXI'),
  formula: fc.constantFrom('TIERS', 'ESSENTIELLE'),
  price: fc.integer({ min: 1, max: 10000000 }),
  coverages: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 10 }),
  includesIac: fc.boolean(),
});

/**
 * Generator for coverage item
 */
const coverageItemArb = fc.record({
  description: fc.string({ minLength: 1, maxLength: 200 }),
  capital: fc.integer({ min: 0, max: 100000000 }),
  franchise: fc.string({ minLength: 1, maxLength: 100 }),
});

/**
 * Generator for coverage chapter
 */
const coverageChapterArb = fc.record({
  name: fc.string({ minLength: 1, maxLength: 100 }),
  items: fc.array(coverageItemArb, { minLength: 1, maxLength: 5 }),
});

/**
 * Generator for Multirisk product selection
 */
const multiriskProductArb = fc.record({
  packageCode: fc.string({ minLength: 1, maxLength: 50 })
    .map(s => s.toUpperCase().replace(/[^A-Z0-9_]/g, '_'))
    .filter(s => s.length > 0),
  name: fc.string({ minLength: 1, maxLength: 255 }),
  businessType: fc.constantFrom('BOUTIQUE', 'RESTAURANT', 'HOTEL', 'BAR_CLUB'),
  price: fc.integer({ min: 1, max: 10000000 }),
  coverageDetails: fc.record({
    chapters: fc.array(coverageChapterArb, { minLength: 1, maxLength: 5 }),
  }),
});

/**
 * Generator for IAC add-on
 */
const iacAddOnArb = fc.record({
  selected: fc.boolean(),
  price: fc.integer({ min: 1, max: 100000 }),
  deathCapital: fc.integer({ min: 1, max: 10000000 }),
  disabilityCapital: fc.integer({ min: 1, max: 10000000 }),
  treatmentCapital: fc.integer({ min: 1, max: 10000000 }),
});

// Note: phoneNumberArb and nameArb generators are available for future tests

// ============================================================================
// Property Tests
// ============================================================================

describe('Validation Consistency Property Tests', () => {
  /**
   * Property 1: Idempotent validation
   * Validating the same data multiple times should always produce the same result
   */
  test('Auto product validation is idempotent', () => {
    fc.assert(
      fc.property(autoProductArb, (data) => {
        const result1 = validate(autoProductSelectionSchema, data);
        const result2 = validate(autoProductSelectionSchema, data);
        const result3 = validate(autoProductSelectionSchema, data);

        // All results should have the same success status
        expect(result1.success).toBe(result2.success);
        expect(result2.success).toBe(result3.success);

        // If successful, all should have the same data
        if (result1.success && result2.success && result3.success) {
          expect(result1.data).toEqual(result2.data);
          expect(result2.data).toEqual(result3.data);
        }

        // If failed, all should have the same errors
        if (!result1.success && !result2.success && !result3.success) {
          expect(result1.errors).toEqual(result2.errors);
          expect(result2.errors).toEqual(result3.errors);
        }
      }),
      { numRuns: 100 }
    );
  });

  test('Moto product validation is idempotent', () => {
    fc.assert(
      fc.property(motoProductArb, (data) => {
        const result1 = validate(motoProductSelectionSchema, data);
        const result2 = validate(motoProductSelectionSchema, data);

        expect(result1.success).toBe(result2.success);

        if (result1.success && result2.success) {
          expect(result1.data).toEqual(result2.data);
        }
      }),
      { numRuns: 100 }
    );
  });

  test('Multirisk product validation is idempotent', () => {
    fc.assert(
      fc.property(multiriskProductArb, (data) => {
        const result1 = validate(multirisqueProductSelectionSchema, data);
        const result2 = validate(multirisqueProductSelectionSchema, data);

        expect(result1.success).toBe(result2.success);

        if (result1.success && result2.success) {
          expect(result1.data).toEqual(result2.data);
        }
      }),
      { numRuns: 100 }
    );
  });

  test('IAC add-on validation is idempotent', () => {
    fc.assert(
      fc.property(iacAddOnArb, (data) => {
        const result1 = validate(iacAddOnSchema, data);
        const result2 = validate(iacAddOnSchema, data);

        expect(result1.success).toBe(result2.success);

        if (result1.success && result2.success) {
          expect(result1.data).toEqual(result2.data);
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2: Valid data always validates successfully
   * If we generate data that conforms to the schema, it should always validate
   */
  test('Generated valid Auto data always validates', () => {
    fc.assert(
      fc.property(autoProductArb, (data) => {
        const result = validate(autoProductSelectionSchema, data);
        expect(result.success).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  test('Generated valid Moto data always validates', () => {
    fc.assert(
      fc.property(motoProductArb, (data) => {
        const result = validate(motoProductSelectionSchema, data);
        expect(result.success).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  test('Generated valid IAC data always validates', () => {
    fc.assert(
      fc.property(iacAddOnArb, (data) => {
        const result = validate(iacAddOnSchema, data);
        expect(result.success).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3: Invalid data always fails validation
   * Data that violates schema constraints should always fail
   */
  test('Negative prices always fail validation', () => {
    fc.assert(
      fc.property(
        autoProductArb,
        fc.integer({ min: -1000000, max: -1 }),
        (data, negativePrice) => {
          const invalidData = { ...data, price: negativePrice };
          const result = validate(autoProductSelectionSchema, invalidData);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Empty coverage arrays always fail validation', () => {
    fc.assert(
      fc.property(autoProductArb, (data) => {
        const invalidData = { ...data, coverages: [] };
        const result = validate(autoProductSelectionSchema, invalidData);
        expect(result.success).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  test('Invalid CV ranges always fail validation', () => {
    fc.assert(
      fc.property(
        autoProductArb,
        fc.integer({ min: 10, max: 50 }),
        fc.integer({ min: 1, max: 5 }),
        (data, min, max) => {
          // Create invalid range where max < min
          const invalidData = {
            ...data,
            cvRange: { min, max, label: `${min}-${max} CV` },
          };
          const result = validate(autoProductSelectionSchema, invalidData);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});
