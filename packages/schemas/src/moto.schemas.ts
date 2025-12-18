import { z } from 'zod';

// ============================================================================
// Moto Insurance Schemas
// ============================================================================

/**
 * Moto category enum
 */
export const motoCategorySchema = z.enum([
  'DJAKARTA',
  'GROSSE_CYLINDREE',
  'MOTO_TAXI',
]);

/**
 * Moto formula type enum
 */
export const motoFormulaTypeSchema = z.enum(['TIERS', 'ESSENTIELLE']);

/**
 * Moto pricing query schema
 */
export const motoPricingQuerySchema = z.object({
  category: motoCategorySchema,
});

/**
 * Moto product selection schema
 */
export const motoProductSelectionSchema = z.object({
  category: motoCategorySchema,
  formula: motoFormulaTypeSchema,
  price: z.number().positive('Le prix doit être positif'),
  coverages: z
    .array(z.string())
    .min(1, 'Au moins une couverture est requise'),
  includesIac: z.boolean(),
});

/**
 * Moto pricing entity schema
 */
export const motoPricingSchema = z.object({
  id: z.number().int().positive(),
  category: motoCategorySchema,
  formulaType: motoFormulaTypeSchema,
  price12m: z.number().positive(),
  includesIac: z.boolean(),
  coverages: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Moto enrollment data schema
 */
export const motoEnrollmentSchema = z.object({
  category: motoCategorySchema,
  formula: motoFormulaTypeSchema,
  vehicleRegistration: z
    .string()
    .min(1, "Le numéro d'immatriculation est requis")
    .max(50, "Le numéro d'immatriculation ne peut pas dépasser 50 caractères"),
  vehicleMake: z
    .string()
    .min(1, 'La marque de la moto est requise')
    .max(100, 'La marque de la moto ne peut pas dépasser 100 caractères'),
  vehicleModel: z
    .string()
    .min(1, 'Le modèle de la moto est requis')
    .max(100, 'Le modèle de la moto ne peut pas dépasser 100 caractères'),
  vehicleYear: z
    .number()
    .int("L'année doit être un entier")
    .min(1900, "L'année doit être supérieure à 1900")
    .max(
      new Date().getFullYear() + 1,
      "L'année ne peut pas être dans le futur"
    ),
  driverLicenseNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 5,
      'Le numéro de permis doit contenir au moins 5 caractères'
    ),
});

/**
 * Validation for Moto pricing query from URL params
 */
export const motoPricingQueryParamsSchema = z.object({
  category: motoCategorySchema,
});

/**
 * Moto upgrade suggestion validation
 */
export const motoUpgradeSuggestionSchema = z.object({
  available: z.boolean(),
  fromFormula: motoFormulaTypeSchema,
  toFormula: motoFormulaTypeSchema,
  additionalPrice: z.number().nonnegative(),
  benefits: z.array(z.string()),
});

// ============================================================================
// Type exports
// ============================================================================

export type MotoCategory = z.infer<typeof motoCategorySchema>;
export type MotoFormulaType = z.infer<typeof motoFormulaTypeSchema>;
export type MotoPricingQuery = z.infer<typeof motoPricingQuerySchema>;
export type MotoProductSelection = z.infer<typeof motoProductSelectionSchema>;
export type MotoPricing = z.infer<typeof motoPricingSchema>;
export type MotoEnrollment = z.infer<typeof motoEnrollmentSchema>;
export type MotoPricingQueryParams = z.infer<typeof motoPricingQueryParamsSchema>;
export type MotoUpgradeSuggestion = z.infer<typeof motoUpgradeSuggestionSchema>;
