import { z } from 'zod';

// ============================================================================
// Common Validation Schemas
// ============================================================================

/**
 * Phone number validation (Guinean format)
 * Accepts formats like: +224XXXXXXXXX, 224XXXXXXXXX, or XXXXXXXXX
 */
export const phoneNumberSchema = z
  .string()
  .min(9, 'Le numéro de téléphone doit contenir au moins 9 chiffres')
  .max(15, 'Le numéro de téléphone ne peut pas dépasser 15 caractères')
  .regex(
    /^(\+?224)?[0-9]{9,12}$/,
    'Format de numéro de téléphone invalide'
  );

/**
 * Name validation (first name, last name)
 */
export const nameSchema = z
  .string()
  .min(2, 'Le nom doit contenir au moins 2 caractères')
  .max(100, 'Le nom ne peut pas dépasser 100 caractères')
  .regex(
    /^[a-zA-ZÀ-ÿ\s'-]+$/,
    'Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets'
  );

/**
 * Email validation
 */
export const emailSchema = z
  .string()
  .email('Adresse email invalide')
  .max(255, "L'email ne peut pas dépasser 255 caractères");

/**
 * Price validation (positive number)
 */
export const priceSchema = z
  .number()
  .positive('Le prix doit être positif')
  .finite('Le prix doit être un nombre valide');

/**
 * Price string validation (for API requests)
 */
export const priceStringSchema = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, 'Format de prix invalide')
  .transform((val) => parseFloat(val));

/**
 * Product type enum
 */
export const productTypeSchema = z.enum([
  'AUTO',
  'MOTO',
  'MULTIRISK_PRO',
  'IAC',
  'LEGACY',
]);

/**
 * Additional info for payment
 */
export const additionalInfosSchema = z.object({
  recipientEmail: emailSchema,
  recipientFirstName: nameSchema,
  recipientLastName: nameSchema,
  destinataire: z.string().min(1, 'Le destinataire est requis'),
});

/**
 * CV Range validation
 */
export const cvRangeSchema = z.object({
  min: z.number().int().min(1, 'Le CV minimum doit être au moins 1'),
  max: z.number().int().min(1, 'Le CV maximum doit être au moins 1'),
  label: z.string().min(1, 'Le label est requis'),
});

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validates that max is greater than or equal to min
 */
export const validateMinMax = <T extends { min: number; max: number }>(
  data: T
): boolean => {
  return data.max >= data.min;
};

/**
 * Validates CV range is within valid bounds
 */
export const validateCVRange = (cvRange: {
  min: number;
  max: number;
}): boolean => {
  return (
    cvRange.min >= 1 &&
    cvRange.max >= cvRange.min &&
    cvRange.max <= 50
  );
};
