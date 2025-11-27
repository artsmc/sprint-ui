/**
 * Submission Validation Schemas
 *
 * Zod schemas for validating submission-related requests.
 */

import { z } from 'zod';

// =============================================================================
// Submission Status Enum
// =============================================================================

/**
 * Valid submission status values.
 */
export const SubmissionStatusEnum = z.enum(['draft', 'submitted']);

export type SubmissionStatusValue = z.infer<typeof SubmissionStatusEnum>;

// =============================================================================
// Create Submission Schema
// =============================================================================

/**
 * Schema for creating a new submission.
 * Requires authentication.
 */
export const CreateSubmissionSchema = z.object({
  sprint_id: z.string().min(1, 'Sprint ID is required'),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters'),
  short_description: z
    .string()
    .max(500, 'Short description must be at most 500 characters')
    .nullable()
    .optional(),
  main_problem_focused: z
    .string()
    .max(5000, 'Main problem focused must be at most 5000 characters')
    .nullable()
    .optional(),
  key_constraints: z
    .string()
    .max(5000, 'Key constraints must be at most 5000 characters')
    .nullable()
    .optional(),
  figma_url: z
    .string()
    .url('Invalid Figma URL')
    .refine(
      (url) =>
        url.includes('figma.com') ||
        url.includes('figma.design') ||
        url === '',
      'URL must be a valid Figma link'
    )
    .nullable()
    .optional(),
});

export type CreateSubmissionInput = z.infer<typeof CreateSubmissionSchema>;

// =============================================================================
// Update Submission Schema
// =============================================================================

/**
 * Schema for updating an existing submission.
 * All fields are optional for partial updates.
 * Can only update submissions in 'draft' status.
 */
export const UpdateSubmissionSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be at most 200 characters')
    .optional(),
  short_description: z
    .string()
    .max(500, 'Short description must be at most 500 characters')
    .nullable()
    .optional(),
  main_problem_focused: z
    .string()
    .max(5000, 'Main problem focused must be at most 5000 characters')
    .nullable()
    .optional(),
  key_constraints: z
    .string()
    .max(5000, 'Key constraints must be at most 5000 characters')
    .nullable()
    .optional(),
  figma_url: z
    .string()
    .url('Invalid Figma URL')
    .refine(
      (url) =>
        url.includes('figma.com') ||
        url.includes('figma.design') ||
        url === '',
      'URL must be a valid Figma link'
    )
    .nullable()
    .optional(),
});

export type UpdateSubmissionInput = z.infer<typeof UpdateSubmissionSchema>;

// =============================================================================
// Submission Query Schema
// =============================================================================

/**
 * Schema for submission list query parameters.
 */
export const SubmissionQuerySchema = z.object({
  sprint_id: z.string().optional(),
  user_id: z.string().optional(),
  status: SubmissionStatusEnum.optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export type SubmissionQuery = z.infer<typeof SubmissionQuerySchema>;

// =============================================================================
// Submission Expand Query Schema
// =============================================================================

/**
 * Schema for submission detail query with expansion options.
 */
export const SubmissionExpandQuerySchema = z.object({
  expand: z
    .enum(['user', 'sprint', 'assets', 'skills', 'all'])
    .optional()
    .default('assets'),
});

export type SubmissionExpandQuery = z.infer<typeof SubmissionExpandQuerySchema>;
