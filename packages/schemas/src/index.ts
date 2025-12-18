// ============================================================================
// CNAR Sugu Validation Schemas
// Zod schemas for validating insurance product data across the platform
// ============================================================================

// Common schemas
export * from './common.schemas.js';

// Auto insurance schemas
export * from './auto.schemas.js';

// Moto insurance schemas
export * from './moto.schemas.js';

// Multirisk Pro insurance schemas
export * from './multirisk.schemas.js';

// IAC (Incapacité Accident Corporel) schemas
export * from './iac.schemas.js';

// Subscription schemas
export * from './subscription.schemas.js';

// Payment schemas
export * from './payment.schemas.js';

// ============================================================================
// Validation Utilities
// ============================================================================

import { z } from 'zod';

/**
 * Helper function to safely parse data with a schema
 * Returns parsed data or throws with formatted error messages
 */
export function safeParse<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): z.infer<T> {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));
    
    throw new Error(
      `Validation failed:\n${errors.map((e) => `  - ${e.path}: ${e.message}`).join('\n')}`
    );
  }
  
  return result.data;
}

/**
 * Helper function to validate data and return validation result
 * Returns { success: true, data } or { success: false, errors }
 */
export function validate<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): 
  | { success: true; data: z.infer<T>; errors?: never }
  | { success: false; data?: never; errors: Array<{ path: string; message: string }> } {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));
    
    return { success: false, errors };
  }
  
  return { success: true, data: result.data };
}

/**
 * Helper to create a partial schema (all fields optional)
 * Note: Use schema.partial() directly for object schemas
 */
export function makePartial<T extends z.ZodObject<any>>(
  schema: T
): z.ZodObject<{ [K in keyof T['shape']]: z.ZodOptional<T['shape'][K]> }> {
  return schema.partial() as any;
}

/**
 * Helper to create a required schema (all fields required)
 * Note: Use schema.required() directly for object schemas
 */
export function makeRequired<T extends z.ZodObject<any>>(schema: T): T {
  return schema.required() as T;
}
