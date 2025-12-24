/**
 * Sprint Validation Schemas
 *
 * Zod schemas for validating sprint-related requests.
 */

import { z } from 'zod';

// =============================================================================
// Sprint Status Enum
// =============================================================================

/**
 * Valid sprint status values.
 */
export const SprintStatusEnum = z.enum([
  'scheduled',
  'active',
  'voting',
  'retro',
  'completed',
  'cancelled',
]);

export type SprintStatusValue = z.infer<typeof SprintStatusEnum>;

// =============================================================================
// Create Sprint Schema
// =============================================================================

/**
 * Schema for creating a new sprint.
 * Admin only endpoint.
 */
export const CreateSprintSchema = z.object({
  sprint_number: z
    .number()
    .int('Sprint number must be an integer')
    .min(1, 'Sprint number must be at least 1'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  challenge_id: z.string().min(1, 'Challenge ID is required'),
  status: SprintStatusEnum.default('scheduled'),
  start_at: z.string().datetime().nullish(),
  end_at: z.string().datetime().nullish(),
  voting_end_at: z.string().datetime().nullish(),
  retro_day: z.string().date().nullish(),
  duration_days: z
    .number()
    .int()
    .min(1, 'Duration must be at least 1 day')
    .max(30, 'Duration must be at most 30 days')
    .default(14),
});

export type CreateSprintInput = z.infer<typeof CreateSprintSchema>;

// =============================================================================
// Update Sprint Schema
// =============================================================================

/**
 * Schema for updating an existing sprint.
 * All fields are optional for partial updates.
 */
export const UpdateSprintSchema = z.object({
  sprint_number: z
    .number()
    .int('Sprint number must be an integer')
    .min(1, 'Sprint number must be at least 1')
    .optional(),
  name: z
    .string()
    .min(1, 'Name cannot be empty')
    .max(100, 'Name must be at most 100 characters')
    .optional(),
  challenge_id: z.string().min(1, 'Challenge ID cannot be empty').optional(),
  status: SprintStatusEnum.optional(),
  start_at: z.string().datetime().nullish(),
  end_at: z.string().datetime().nullish(),
  voting_end_at: z.string().datetime().nullish(),
  retro_day: z.string().date().nullish(),
  duration_days: z
    .number()
    .int()
    .min(1, 'Duration must be at least 1 day')
    .max(30, 'Duration must be at most 30 days')
    .optional(),
});

export type UpdateSprintInput = z.infer<typeof UpdateSprintSchema>;

// =============================================================================
// Sprint Query Schema
// =============================================================================

/**
 * Schema for sprint list query parameters.
 */
export const SprintQuerySchema = z.object({
  status: SprintStatusEnum.optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export type SprintQuery = z.infer<typeof SprintQuerySchema>;

// =============================================================================
// Sprint Expand Query Schema
// =============================================================================

/**
 * Schema for sprint detail query with expansion options.
 */
export const SprintExpandQuerySchema = z.object({
  expand: z
    .enum(['challenge', 'started_by', 'ended_by', 'all'])
    .optional()
    .default('challenge'),
});

export type SprintExpandQuery = z.infer<typeof SprintExpandQuerySchema>;
