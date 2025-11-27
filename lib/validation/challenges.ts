/**
 * Challenge Validation Schemas
 *
 * Zod schemas for validating challenge-related requests.
 */

import { z } from 'zod';

// =============================================================================
// Create Challenge Schema
// =============================================================================

/**
 * Schema for creating a new challenge.
 * Admin only endpoint.
 */
export const CreateChallengeSchema = z.object({
  challenge_number: z
    .number()
    .int('Challenge number must be an integer')
    .min(1, 'Challenge number must be at least 1'),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters'),
  brief: z
    .string()
    .min(1, 'Brief is required')
    .max(10000, 'Brief must be at most 10000 characters'),
});

export type CreateChallengeInput = z.infer<typeof CreateChallengeSchema>;

// =============================================================================
// Update Challenge Schema
// =============================================================================

/**
 * Schema for updating an existing challenge.
 * All fields are optional for partial updates.
 */
export const UpdateChallengeSchema = z.object({
  challenge_number: z
    .number()
    .int('Challenge number must be an integer')
    .min(1, 'Challenge number must be at least 1')
    .optional(),
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be at most 200 characters')
    .optional(),
  brief: z
    .string()
    .min(1, 'Brief cannot be empty')
    .max(10000, 'Brief must be at most 10000 characters')
    .optional(),
});

export type UpdateChallengeInput = z.infer<typeof UpdateChallengeSchema>;

// =============================================================================
// Search Challenge Query Schema
// =============================================================================

/**
 * Schema for challenge search query parameters.
 */
export const SearchChallengeQuerySchema = z.object({
  q: z
    .string()
    .min(1, 'Search query is required')
    .max(100, 'Search query must be at most 100 characters'),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export type SearchChallengeQuery = z.infer<typeof SearchChallengeQuerySchema>;

// =============================================================================
// Challenge List Query Schema
// =============================================================================

/**
 * Schema for challenge list query parameters.
 */
export const ChallengeListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export type ChallengeListQuery = z.infer<typeof ChallengeListQuerySchema>;
