import { z } from 'zod';

// ============================================================================
// IAC (Incapacité Accident Corporel) Schemas
// ============================================================================

/**
 * IAC product entity schema
 */
export const iacProductSchema = z.object({
  id: z.number().int().positive(),
  price: z.number().positive('Le prix doit être positif'),
  deathCapital: z
    .number()
    .positive('Le capital décès doit être positif')
    .int('Le capital décès doit être un entier'),
  disabilityCapital: z
    .number()
    .positive('Le capital invalidité doit être positif')
    .int('Le capital invalidité doit être un entier'),
  treatmentCapital: z
    .number()
    .positive('Le capital soins doit être positif')
    .int('Le capital soins doit être un entier'),
  description: z.string().optional(),
  active: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * IAC add-on selection schema
 */
export const iacAddOnSchema = z.object({
  selected: z.boolean(),
  price: z.number().positive('Le prix doit être positif'),
  deathCapital: z
    .number()
    .positive('Le capital décès doit être positif')
    .int('Le capital décès doit être un entier'),
  disabilityCapital: z
    .number()
    .positive('Le capital invalidité doit être positif')
    .int('Le capital invalidité doit être un entier'),
  treatmentCapital: z
    .number()
    .positive('Le capital soins doit être positif')
    .int('Le capital soins doit être un entier'),
});

/**
 * IAC enrollment data schema
 */
export const iacEnrollmentSchema = z.object({
  beneficiaryName: z
    .string()
    .min(2, 'Le nom du bénéficiaire doit contenir au moins 2 caractères')
    .max(100, 'Le nom du bénéficiaire ne peut pas dépasser 100 caractères')
    .optional(),
  beneficiaryRelationship: z
    .string()
    .min(2, 'La relation doit contenir au moins 2 caractères')
    .max(50, 'La relation ne peut pas dépasser 50 caractères')
    .optional(),
  beneficiaryPhone: z
    .string()
    .regex(/^(\+?224)?[0-9]{9,12}$/, 'Format de numéro de téléphone invalide')
    .optional(),
  medicalHistory: z
    .string()
    .max(1000, 'Les antécédents médicaux ne peuvent pas dépasser 1000 caractères')
    .optional(),
});

/**
 * IAC cross-sell eligibility schema
 */
export const iacCrossSellEligibilitySchema = z.object({
  eligible: z.boolean(),
  productType: z.enum(['AUTO', 'MOTO']),
  formula: z.string().min(1),
  reason: z.string().optional(),
});

/**
 * IAC standalone purchase schema
 */
export const iacStandalonePurchaseSchema = z
  .object({
    addToExistingPolicy: z.boolean().default(false),
    existingPolicyNumber: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.addToExistingPolicy && !data.existingPolicyNumber) {
        return false;
      }
      return true;
    },
    {
      message: 'Le numéro de police est requis pour ajouter à une police existante',
      path: ['existingPolicyNumber'],
    }
  );

// ============================================================================
// Type exports
// ============================================================================

export type IACProduct = z.infer<typeof iacProductSchema>;
export type IACAddOn = z.infer<typeof iacAddOnSchema>;
export type IACEnrollment = z.infer<typeof iacEnrollmentSchema>;
export type IACCrossSellEligibility = z.infer<typeof iacCrossSellEligibilitySchema>;
export type IACStandalonePurchase = z.infer<typeof iacStandalonePurchaseSchema>;
