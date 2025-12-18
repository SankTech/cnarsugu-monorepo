import { z } from 'zod';

// ============================================================================
// Multirisk Pro Insurance Schemas
// ============================================================================

/**
 * Business type enum
 */
export const businessTypeSchema = z.enum([
  'BOUTIQUE',
  'RESTAURANT',
  'HOTEL',
  'BAR_CLUB',
]);

/**
 * Coverage item schema
 */
export const coverageItemSchema = z.object({
  description: z.string().min(1, 'La description est requise'),
  capital: z.number().nonnegative('Le capital doit être positif ou zéro'),
  franchise: z.string().min(1, 'La franchise est requise'),
});

/**
 * Coverage chapter schema
 */
export const coverageChapterSchema = z.object({
  name: z.string().min(1, 'Le nom du chapitre est requis'),
  items: z
    .array(coverageItemSchema)
    .min(1, 'Au moins un élément de couverture est requis'),
});

/**
 * Coverage details schema
 */
export const coverageDetailsSchema = z.object({
  chapters: z
    .array(coverageChapterSchema)
    .min(1, 'Au moins un chapitre de couverture est requis'),
});

/**
 * Multirisk package entity schema
 */
export const multirisquePackageSchema = z.object({
  id: z.number().int().positive(),
  packageCode: z
    .string()
    .min(1, 'Le code du package est requis')
    .max(50, 'Le code du package ne peut pas dépasser 50 caractères')
    .regex(
      /^[A-Z0-9_]+$/,
      'Le code du package ne peut contenir que des lettres majuscules, chiffres et underscores'
    ),
  name: z
    .string()
    .min(1, 'Le nom du package est requis')
    .max(255, 'Le nom du package ne peut pas dépasser 255 caractères'),
  businessType: businessTypeSchema,
  priceTtc: z.number().positive('Le prix TTC doit être positif'),
  coverageDetails: coverageDetailsSchema,
  displayOrder: z.number().int().nonnegative(),
  active: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Multirisk product selection schema
 */
export const multirisqueProductSelectionSchema = z.object({
  packageCode: z
    .string()
    .min(1, 'Le code du package est requis')
    .regex(/^[A-Z0-9_]+$/, 'Code de package invalide'),
  name: z.string().min(1, 'Le nom du package est requis'),
  businessType: businessTypeSchema,
  price: z.number().positive('Le prix doit être positif'),
  coverageDetails: coverageDetailsSchema,
});

/**
 * Multirisk enrollment data schema
 */
export const multirisqueEnrollmentSchema = z.object({
  packageCode: z.string().min(1, 'Le code du package est requis'),
  businessType: businessTypeSchema,
  businessName: z
    .string()
    .min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères")
    .max(255, "Le nom de l'entreprise ne peut pas dépasser 255 caractères"),
  businessAddress: z
    .string()
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .max(500, "L'adresse ne peut pas dépasser 500 caractères"),
  businessRegistrationNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 5,
      "Le numéro d'enregistrement doit contenir au moins 5 caractères"
    ),
  estimatedAnnualRevenue: z
    .number()
    .nonnegative("Le chiffre d'affaires estimé doit être positif ou zéro")
    .optional(),
  numberOfEmployees: z
    .number()
    .int("Le nombre d'employés doit être un entier")
    .nonnegative("Le nombre d'employés doit être positif ou zéro")
    .optional(),
});

/**
 * Validation for package code from URL params
 */
export const packageCodeParamSchema = z.object({
  packageCode: z
    .string()
    .min(1)
    .regex(/^[A-Z0-9_]+$/, 'Code de package invalide'),
});

// ============================================================================
// Type exports
// ============================================================================

export type BusinessType = z.infer<typeof businessTypeSchema>;
export type CoverageItem = z.infer<typeof coverageItemSchema>;
export type CoverageChapter = z.infer<typeof coverageChapterSchema>;
export type CoverageDetails = z.infer<typeof coverageDetailsSchema>;
export type MultirisquePackage = z.infer<typeof multirisquePackageSchema>;
export type MultirisqueProductSelection = z.infer<
  typeof multirisqueProductSelectionSchema
>;
export type MultirisqueEnrollment = z.infer<typeof multirisqueEnrollmentSchema>;
export type PackageCodeParam = z.infer<typeof packageCodeParamSchema>;
