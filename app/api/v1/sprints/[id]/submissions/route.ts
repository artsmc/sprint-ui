/**
 * Sprint Submissions API Route
 *
 * @swagger
 * /api/v1/sprints/{id}/submissions:
 *   get:
 *     tags:
 *       - Sprint Submissions
 *     summary: Get sprint submissions
 *     description: |
 *       Returns all submissions for a sprint.
 *       By default returns only submitted (not draft) submissions.
 *       Use status=all to include draft submissions (requires authentication).
 *     operationId: getSprintSubmissions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sprint ID
 *         example: "sprint123"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [submitted, all]
 *           default: submitted
 *         description: |
 *           Filter by submission status.
 *           - submitted: Only finalized submissions (default)
 *           - all: Include draft submissions (requires auth)
 *     responses:
 *       200:
 *         description: List of submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Submission'
 *       404:
 *         description: Sprint not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * components:
 *   schemas:
 *     Submission:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "submission123"
 *         sprint_id:
 *           type: string
 *           example: "sprint123"
 *         user_id:
 *           type: string
 *           example: "user456"
 *         title:
 *           type: string
 *           example: "My Dashboard Design"
 *         short_description:
 *           type: string
 *           nullable: true
 *           example: "A clean, minimal dashboard for productivity"
 *         main_problem_focused:
 *           type: string
 *           nullable: true
 *         key_constraints:
 *           type: string
 *           nullable: true
 *         figma_url:
 *           type: string
 *           nullable: true
 *           example: "https://figma.com/file/abc123"
 *         status:
 *           type: string
 *           enum: [draft, submitted]
 *           example: "submitted"
 *         submitted_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         created:
 *           type: string
 *           format: date-time
 *         updated:
 *           type: string
 *           format: date-time
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  getSubmissionsBySprint,
  getSubmittedSubmissionsBySprint,
} from '@/lib/api';
import {
  APIErrorHandler,
  APIResponse,
  RequestValidator,
} from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Query schema for status filter
const SprintSubmissionsQuerySchema = z.object({
  status: z.enum(['submitted', 'all']).optional().default('submitted'),
});

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: sprintId } = await params;

    // Validate query parameters
    const query = RequestValidator.validateQuery(
      request,
      SprintSubmissionsQuerySchema
    );

    // Call appropriate service function based on status filter
    const submissions =
      query.status === 'all'
        ? await getSubmissionsBySprint(sprintId)
        : await getSubmittedSubmissionsBySprint(sprintId);

    return APIResponse.success(submissions);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
