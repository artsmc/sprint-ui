/**
 * Feedback Validation Schemas
 *
 * Zod schemas for validating feedback-related requests.
 */

import { z } from 'zod';

// =============================================================================
// Create Feedback Schema
// =============================================================================

/**
 * Schema for creating new feedback.
 * At least one of works_well, to_improve, or question must be provided.
 */
export const CreateFeedbackSchema = z
  .object({
    works_well: z
      .string()
      .max(5000, 'Works well must be at most 5000 characters')
      .nullable()
      .optional(),
    to_improve: z
      .string()
      .max(5000, 'To improve must be at most 5000 characters')
      .nullable()
      .optional(),
    question: z
      .string()
      .max(2000, 'Question must be at most 2000 characters')
      .nullable()
      .optional(),
    is_anonymous: z.boolean().default(false),
  })
  .refine(
    (data) => data.works_well || data.to_improve || data.question,
    'At least one of works_well, to_improve, or question must be provided'
  );

export type CreateFeedbackInput = z.infer<typeof CreateFeedbackSchema>;

// =============================================================================
// Update Feedback Schema
// =============================================================================

/**
 * Schema for updating existing feedback.
 * All fields are optional for partial updates.
 */
export const UpdateFeedbackSchema = z.object({
  works_well: z
    .string()
    .max(5000, 'Works well must be at most 5000 characters')
    .nullable()
    .optional(),
  to_improve: z
    .string()
    .max(5000, 'To improve must be at most 5000 characters')
    .nullable()
    .optional(),
  question: z
    .string()
    .max(2000, 'Question must be at most 2000 characters')
    .nullable()
    .optional(),
  is_anonymous: z.boolean().optional(),
});

export type UpdateFeedbackInput = z.infer<typeof UpdateFeedbackSchema>;

// =============================================================================
// Feedback Query Schema
// =============================================================================

/**
 * Schema for feedback list query parameters.
 */
export const FeedbackQuerySchema = z.object({
  submission_id: z.string().optional(),
  author_id: z.string().optional(),
  sprint_id: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export type FeedbackQuery = z.infer<typeof FeedbackQuerySchema>;

// =============================================================================
// Feedback Expand Query Schema
// =============================================================================

/**
 * Schema for feedback detail query with expansion options.
 */
export const FeedbackExpandQuerySchema = z.object({
  expand: z.enum(['author', 'submission', 'all']).optional(),
});

export type FeedbackExpandQuery = z.infer<typeof FeedbackExpandQuerySchema>;
