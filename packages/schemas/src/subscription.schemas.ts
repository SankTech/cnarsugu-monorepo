import { z } from 'zod';
import {
  nameSchema,
  phoneNumberSchema,
  productTypeSchema,
  cvRangeSchema,
} from './common.schemas.js';
import { autoFormulaTypeSchema } from './auto.schemas.js';
import { motoCategorySchema, motoFormulaTypeSchema } from './moto.schemas.js';

// ============================================================================
// Subscription Schemas
// ============================================================================

/**
 * Product details schema (flexible for different product types)
 */
export const productDetailsSchema = z.object({
  cvRange: cvRangeSchema.optional(),
  formula: z.string().optional(),
  motoCategory: motoCategorySchema.optional(),
  packageCode: z.string().optional(),
  addIac: z.boolean().optional(),
});

/**
 * Base subscription schema
 */
export const baseSubscriptionSchema = z.object({
  coverage: z.string().min(1, 'La couverture est requise'),
  insurance: z.string().min(1, "L'assurance est requise"),
  name: nameSchema,
  surname: nameSchema,
  phoneNumber: phoneNumberSchema,
  price: z.string().optional(),
  extraData: z.string().optional(),
});

/**
 * Create subscription request schema (v1 - legacy)
 */
export const createSubscriptionSchema = baseSubscriptionSchema.extend({
  paymentId: z.string().optional(),
  files: z.array(z.string()).optional(),
});

/**
 * Create subscription request schema (v2 - with product types)
 */
export const createSubscriptionV2Schema = baseSubscriptionSchema.extend({
  paymentId: z.string().optional(),
  files: z.array(z.string()).optional(),
  productType: productTypeSchema.optional(),
  productDetails: productDetailsSchema.optional(),
  cvRange: z.string().optional(),
  motoCategory: motoCategorySchema.optional(),
});

/**
 * Auto subscription schema
 */
export const autoSubscriptionSchema = baseSubscriptionSchema.extend({
  productType: z.literal('AUTO'),
  productDetails: z.object({
    cvRange: cvRangeSchema,
    formula: autoFormulaTypeSchema,
    addIac: z.boolean().optional(),
  }),
  files: z.array(z.string()).optional(),
});

/**
 * Moto subscription schema
 */
export const motoSubscriptionSchema = baseSubscriptionSchema.extend({
  productType: z.literal('MOTO'),
  productDetails: z.object({
    motoCategory: motoCategorySchema,
    formula: motoFormulaTypeSchema,
  }),
  motoCategory: motoCategorySchema.optional(),
  files: z.array(z.string()).optional(),
});

/**
 * Multirisk subscription schema
 */
export const multiriskSubscriptionSchema = baseSubscriptionSchema.extend({
  productType: z.literal('MULTIRISK_PRO'),
  productDetails: z.object({
    packageCode: z.string().min(1, 'Le code du package est requis'),
  }),
  files: z.array(z.string()).optional(),
});

/**
 * IAC subscription schema
 */
export const iacSubscriptionSchema = baseSubscriptionSchema.extend({
  productType: z.literal('IAC'),
  productDetails: z.object({
    addIac: z.literal(true),
  }),
  files: z.array(z.string()).optional(),
});

/**
 * Update subscription status schema
 */
export const updateSubscriptionStatusSchema = z.object({
  status: z.enum(['PENDING', 'ACTIVE', 'CANCELLED', 'EXPIRED']),
  reason: z.string().optional(),
});

/**
 * Subscription query filters schema
 */
export const subscriptionQuerySchema = z.object({
  productType: productTypeSchema.optional(),
  status: z.string().optional(),
  page: z
    .string()
    .regex(/^\d+$/)
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive().max(100))
    .optional(),
  search: z.string().optional(),
});

/**
 * Subscription entity schema
 */
export const subscriptionSchema = z.object({
  id: z.number().int().positive(),
  name: nameSchema,
  surname: nameSchema,
  phoneNumber: phoneNumberSchema,
  status: z.string(),
  coverage: z.string(),
  insurance: z.string(),
  price: z.string().optional(),
  extraData: z.string().optional(),
  attachments: z.array(z.any()).optional(),
  read: z.boolean(),
  createdAt: z.date(),
  productType: productTypeSchema.optional(),
  productDetails: productDetailsSchema.optional(),
  cvRange: z.string().optional(),
  motoCategory: motoCategorySchema.optional(),
});

// ============================================================================
// Type exports
// ============================================================================

export type ProductDetails = z.infer<typeof productDetailsSchema>;
export type CreateSubscription = z.infer<typeof createSubscriptionSchema>;
export type CreateSubscriptionV2 = z.infer<typeof createSubscriptionV2Schema>;
export type AutoSubscription = z.infer<typeof autoSubscriptionSchema>;
export type MotoSubscription = z.infer<typeof motoSubscriptionSchema>;
export type MultiriskSubscription = z.infer<typeof multiriskSubscriptionSchema>;
export type IACSubscription = z.infer<typeof iacSubscriptionSchema>;
export type UpdateSubscriptionStatus = z.infer<typeof updateSubscriptionStatusSchema>;
export type SubscriptionQuery = z.infer<typeof subscriptionQuerySchema>;
export type Subscription = z.infer<typeof subscriptionSchema>;
