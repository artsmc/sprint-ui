/**
 * Submission by ID API Routes
 *
 * @swagger
 * /api/v1/submissions/{id}:
 *   get:
 *     tags:
 *       - Submissions
 *     summary: Get a submission by ID
 *     description: |
 *       Returns a single submission by its unique identifier.
 *       Optionally expand related user, sprint, assets, or skills data.
 *     operationId: getSubmission
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Submission ID
 *         example: "submission123"
 *       - in: query
 *         name: expand
 *         schema:
 *           type: string
 *           enum: [user, sprint, assets, skills, all]
 *           default: assets
 *         description: Related data to expand
 *     responses:
 *       200:
 *         description: Submission details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Submission'
 *       404:
 *         description: Submission not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   patch:
 *     tags:
 *       - Submissions
 *     summary: Update a submission
 *     description: |
 *       Updates an existing submission.
 *       Only the submission owner can update.
 *       Can only update draft submissions (not submitted ones).
 *       Requires authentication.
 *     operationId: updateSubmission
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Submission ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *               short_description:
 *                 type: string
 *                 maxLength: 500
 *                 nullable: true
 *               main_problem_focused:
 *                 type: string
 *                 maxLength: 5000
 *                 nullable: true
 *               key_constraints:
 *                 type: string
 *                 maxLength: 5000
 *                 nullable: true
 *               figma_url:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Submission updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Submission'
 *       400:
 *         description: Cannot update submitted design
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Not the owner of this submission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Submission not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   delete:
 *     tags:
 *       - Submissions
 *     summary: Delete a submission
 *     description: |
 *       Deletes a draft submission.
 *       Only the submission owner can delete.
 *       Can only delete draft submissions (not submitted ones).
 *       Requires authentication.
 *     operationId: deleteSubmission
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Submission ID
 *     responses:
 *       204:
 *         description: Submission deleted successfully
 *       400:
 *         description: Cannot delete submitted design
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Not the owner of this submission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Submission not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { NextRequest } from 'next/server';
import {
  getSubmission,
  getSubmissionWithRelations,
  updateSubmission,
  deleteSubmission,
} from '@/lib/api';
import {
  UpdateSubmissionSchema,
  SubmissionExpandQuerySchema,
} from '@/lib/validation';
import {
  APIErrorHandler,
  APIResponse,
  RequestValidator,
  AuthMiddleware,
} from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Validate query parameters for expand option
    const query = RequestValidator.validateQuery(
      request,
      SubmissionExpandQuerySchema
    );

    // Call appropriate service function based on expand option
    const submission =
      query.expand === 'all' || query.expand === 'sprint' || query.expand === 'user'
        ? await getSubmissionWithRelations(id)
        : await getSubmission(id);

    return APIResponse.success(submission);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Require authentication
    const authResult = await AuthMiddleware.requireAuth(request);

    if (!authResult.success) {
      return APIErrorHandler.unauthorized(authResult.error);
    }

    // Validate request body
    const body = await RequestValidator.validateBody(
      request,
      UpdateSubmissionSchema
    );

    // Call service function (handles ownership and draft status validation)
    // Transform null values to undefined for the service function
    const submission = await updateSubmission(id, {
      title: body.title,
      short_description: body.short_description ?? undefined,
      main_problem_focused: body.main_problem_focused ?? undefined,
      key_constraints: body.key_constraints ?? undefined,
      figma_url: body.figma_url ?? undefined,
    });

    return APIResponse.success(submission);
  } catch (error) {
    // Handle ownership error
    if (
      error instanceof Error &&
      error.message.includes('only update your own')
    ) {
      return APIErrorHandler.forbidden(error.message);
    }
    // Handle submitted design error
    if (
      error instanceof Error &&
      error.message.includes('Cannot update a submitted')
    ) {
      return APIErrorHandler.badRequest(error.message);
    }
    return APIErrorHandler.handleError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Require authentication
    const authResult = await AuthMiddleware.requireAuth(request);

    if (!authResult.success) {
      return APIErrorHandler.unauthorized(authResult.error);
    }

    // Call service function (handles ownership and draft status validation)
    await deleteSubmission(id);

    return APIResponse.noContent();
  } catch (error) {
    // Handle ownership error
    if (
      error instanceof Error &&
      error.message.includes('only delete your own')
    ) {
      return APIErrorHandler.forbidden(error.message);
    }
    // Handle submitted design error
    if (
      error instanceof Error &&
      error.message.includes('Cannot delete a submitted')
    ) {
      return APIErrorHandler.badRequest(error.message);
    }
    return APIErrorHandler.handleError(error);
  }
}
