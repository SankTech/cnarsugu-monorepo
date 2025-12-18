import { z } from 'zod';
import { cvRangeSchema, validateCVRange } from './common.schemas.js';

// ============================================================================
// Auto Insurance Schemas
// ============================================================================

/**
 * Auto formula type enum
 */
export const autoFormulaTypeSchema = z.enum([
  'TIERS',
  'ESSENTIELLE',
  'ETENDUE',
  'CONFORT',
]);

/**
 * Auto pricing query schema
 */
export const autoPricingQuerySchema = z
  .object({
    cvMin: z
      .number()
      .int('Le CV minimum doit être un entier')
      .min(1, 'Le CV minimum doit être au moins 1')
      .max(50, 'Le CV minimum ne peut pas dépasser 50'),
    cvMax: z
      .number()
      .int('Le CV maximum doit être un entier')
      .min(1, 'Le CV maximum doit être au moins 1')
      .max(50, 'Le CV maximum ne peut pas dépasser 50'),
  })
  .refine((data) => data.cvMax >= data.cvMin, {
    message: 'Le CV maximum doit être supérieur ou égal au CV minimum',
    path: ['cvMax'],
  });

/**
 * Auto product selection schema
 */
export const autoProductSelectionSchema = z.object({
  cvRange: cvRangeSchema.refine(validateCVRange, {
    message: 'Plage de CV invalide (doit être entre 1 et 50)',
  }),
  formula: autoFormulaTypeSchema,
  price: z.number().positive('Le prix doit être positif'),
  coverages: z
    .array(z.string())
    .min(1, 'Au moins une couverture est requise'),
  addIac: z.boolean().optional(),
});

/**
 * Auto pricing entity schema
 */
export const autoPricingSchema = z.object({
  id: z.number().int().positive(),
  cvMin: z.number().int().min(1),
  cvMax: z.number().int().min(1),
  formulaType: autoFormulaTypeSchema,
  price12m: z.number().positive(),
  coverages: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Auto enrollment data schema
 */
export const autoEnrollmentSchema = z.object({
  cvRange: cvRangeSchema.refine(validateCVRange, {
    message: 'Plage de CV invalide',
  }),
  formula: autoFormulaTypeSchema,
  addIac: z.boolean().default(false),
  vehicleRegistration: z
    .string()
    .min(1, "Le numéro d'immatriculation est requis")
    .max(50, "Le numéro d'immatriculation ne peut pas dépasser 50 caractères"),
  vehicleMake: z
    .string()
    .min(1, 'La marque du véhicule est requise')
    .max(100, 'La marque du véhicule ne peut pas dépasser 100 caractères'),
  vehicleModel: z
    .string()
    .min(1, 'Le modèle du véhicule est requis')
    .max(100, 'Le modèle du véhicule ne peut pas dépasser 100 caractères'),
  vehicleYear: z
    .number()
    .int('L\'année doit être un entier')
    .min(1900, 'L\'année doit être supérieure à 1900')
    .max(new Date().getFullYear() + 1, 'L\'année ne peut pas être dans le futur'),
});

/**
 * Validation for Auto pricing query from URL params
 */
export const autoPricingQueryParamsSchema = z.object({
  cvMin: z
    .string()
    .regex(/^\d+$/, 'Le CV minimum doit être un nombre')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(50)),
  cvMax: z
    .string()
    .regex(/^\d+$/, 'Le CV maximum doit être un nombre')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(50)),
});

// ============================================================================
// Type exports
// ============================================================================

export type AutoFormulaType = z.infer<typeof autoFormulaTypeSchema>;
export type AutoPricingQuery = z.infer<typeof autoPricingQuerySchema>;
export type AutoProductSelection = z.infer<typeof autoProductSelectionSchema>;
export type AutoPricing = z.infer<typeof autoPricingSchema>;
export type AutoEnrollment = z.infer<typeof autoEnrollmentSchema>;
export type AutoPricingQueryParams = z.infer<typeof autoPricingQueryParamsSchema>;
