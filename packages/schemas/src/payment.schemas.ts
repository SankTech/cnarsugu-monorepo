import { z } from 'zod';
import {
  phoneNumberSchema,
  additionalInfosSchema,
  priceStringSchema,
} from './common.schemas.js';

// ============================================================================
// Payment Schemas
// ============================================================================

/**
 * Payment status enum
 */
export const paymentStatusSchema = z.enum([
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
  'REFUNDED',
]);

/**
 * Payment method enum
 */
export const paymentMethodSchema = z.enum([
  'MOBILE_MONEY',
  'CREDIT_CARD',
  'BANK_TRANSFER',
  'CASH',
  'PAYPAL',
]);

/**
 * Service code enum (for mobile money providers)
 */
export const serviceCodeSchema = z.enum([
  'OM', // Orange Money
  'MOMO', // MTN Mobile Money
  'WIZALL', // Wizall Money
  'WAVE', // Wave
]);

/**
 * Create payment request schema (v1)
 */
export const createPaymentSchema = z.object({
  idFromClient: z
    .string()
    .min(1, 'L\'identifiant client est requis')
    .max(255, 'L\'identifiant client ne peut pas dépasser 255 caractères'),
  amount: priceStringSchema,
  recipientNumber: phoneNumberSchema,
  serviceCode: serviceCodeSchema,
  callback: z
    .string()
    .url('L\'URL de callback doit être valide')
    .max(500, 'L\'URL de callback ne peut pas dépasser 500 caractères'),
  additionnalInfos: additionalInfosSchema,
});

/**
 * Create payment request schema (v2 - with IAC support)
 */
export const createPaymentV2Schema = createPaymentSchema.extend({
  baseAmount: priceStringSchema.optional(),
  iacAmount: priceStringSchema.optional(),
  totalAmount: priceStringSchema,
  productType: z.enum(['AUTO', 'MOTO', 'MULTIRISK_PRO', 'IAC', 'LEGACY']).optional(),
  includesIac: z.boolean().optional(),
});

/**
 * Payment calculation schema
 */
export const paymentCalculationSchema = z.object({
  basePrice: z.number().positive('Le prix de base doit être positif'),
  iacPrice: z.number().nonnegative('Le prix IAC doit être positif ou zéro').optional(),
  discountAmount: z.number().nonnegative('La réduction doit être positive ou zéro').optional(),
  taxAmount: z.number().nonnegative('Le montant de la taxe doit être positif ou zéro').optional(),
  totalPrice: z.number().positive('Le prix total doit être positif'),
});

/**
 * Price breakdown schema
 */
export const priceBreakdownSchema = z.object({
  basePrice: z.number().positive(),
  iacPrice: z.number().nonnegative().optional(),
  totalPrice: z.number().positive(),
});

/**
 * Update payment status schema
 */
export const updatePaymentStatusSchema = z.object({
  status: paymentStatusSchema,
  transactionId: z.string().optional(),
  failureReason: z.string().optional(),
});

/**
 * Payment query filters schema
 */
export const paymentQuerySchema = z.object({
  status: paymentStatusSchema.optional(),
  serviceCode: serviceCodeSchema.optional(),
  startDate: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .optional(),
  endDate: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .optional(),
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
});

/**
 * Payment entity schema
 */
export const paymentSchema = z.object({
  id: z.number().int().positive(),
  idFromClient: z.string(),
  status: z.string(),
  additionnalInfos: additionalInfosSchema,
  amount: z.string(),
  callback: z.string(),
  recipientNumber: phoneNumberSchema,
  serviceCode: z.string(),
  createdAt: z.date(),
});

/**
 * Payment webhook schema (for payment provider callbacks)
 */
export const paymentWebhookSchema = z.object({
  transactionId: z.string().min(1, 'L\'identifiant de transaction est requis'),
  status: paymentStatusSchema,
  amount: z.number().positive(),
  currency: z.string().length(3, 'Le code devise doit contenir 3 caractères'),
  timestamp: z.string().datetime(),
  signature: z.string().min(1, 'La signature est requise'),
});

// ============================================================================
// Type exports
// ============================================================================

export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type ServiceCode = z.infer<typeof serviceCodeSchema>;
export type CreatePayment = z.infer<typeof createPaymentSchema>;
export type CreatePaymentV2 = z.infer<typeof createPaymentV2Schema>;
export type PaymentCalculation = z.infer<typeof paymentCalculationSchema>;
export type PriceBreakdown = z.infer<typeof priceBreakdownSchema>;
export type UpdatePaymentStatus = z.infer<typeof updatePaymentStatusSchema>;
export type PaymentQuery = z.infer<typeof paymentQuerySchema>;
export type Payment = z.infer<typeof paymentSchema>;
export type PaymentWebhook = z.infer<typeof paymentWebhookSchema>;
