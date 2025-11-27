/**
 * Vote Validation Schemas
 *
 * Zod schemas for validating vote-related requests.
 * Enforces rating values between 1-5.
 */

import { z } from 'zod';

// =============================================================================
// Rating Value Schema
// =============================================================================

/**
 * Schema for a single rating value (1-5).
 */
const RatingSchema = z
  .number()
  .int('Rating must be a whole number')
  .min(1, 'Rating must be at least 1')
  .max(5, 'Rating must be at most 5');

// =============================================================================
// Vote Ratings Schema
// =============================================================================

/**
 * Schema for all four rating categories.
 * Each rating must be between 1 and 5.
 */
export const VoteRatingsSchema = z.object({
  rating_clarity: RatingSchema,
  rating_usability: RatingSchema,
  rating_visual_craft: RatingSchema,
  rating_originality: RatingSchema,
});

export type VoteRatings = z.infer<typeof VoteRatingsSchema>;

// =============================================================================
// Create Vote Schema
// =============================================================================

/**
 * Schema for creating a new vote.
 * Requires authentication.
 * Cannot vote on own submission.
 */
export const CreateVoteSchema = VoteRatingsSchema;

export type CreateVoteInput = z.infer<typeof CreateVoteSchema>;

// =============================================================================
// Update Vote Schema
// =============================================================================

/**
 * Schema for updating an existing vote.
 * All ratings are optional for partial updates.
 */
export const UpdateVoteSchema = z.object({
  rating_clarity: RatingSchema.optional(),
  rating_usability: RatingSchema.optional(),
  rating_visual_craft: RatingSchema.optional(),
  rating_originality: RatingSchema.optional(),
});

export type UpdateVoteInput = z.infer<typeof UpdateVoteSchema>;

// =============================================================================
// Vote Query Schema
// =============================================================================

/**
 * Schema for vote list query parameters.
 */
export const VoteQuerySchema = z.object({
  submission_id: z.string().optional(),
  voter_id: z.string().optional(),
  sprint_id: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export type VoteQuery = z.infer<typeof VoteQuerySchema>;
