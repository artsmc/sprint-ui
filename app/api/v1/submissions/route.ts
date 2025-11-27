/**
 * Submissions API Routes
 *
 * @swagger
 * /api/v1/submissions:
 *   get:
 *     tags:
 *       - Submissions
 *     summary: List submissions
 *     description: |
 *       Returns a paginated list of submissions.
 *       Filter by sprint_id, user_id, or status.
 *     operationId: listSubmissions
 *     parameters:
 *       - in: query
 *         name: sprint_id
 *         schema:
 *           type: string
 *         description: Filter by sprint ID
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, submitted]
 *         description: Filter by submission status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number (1-indexed)
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated list of submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 perPage:
 *                   type: integer
 *                   example: 20
 *                 totalItems:
 *                   type: integer
 *                   example: 50
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Submission'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   post:
 *     tags:
 *       - Submissions
 *     summary: Create a new submission
 *     description: |
 *       Creates a new draft submission for the current user.
 *       Requires authentication.
 *     operationId: createSubmission
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sprint_id
 *               - title
 *             properties:
 *               sprint_id:
 *                 type: string
 *                 description: ID of the sprint to submit to
 *                 example: "sprint123"
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 description: Submission title
 *                 example: "My Dashboard Design"
 *               short_description:
 *                 type: string
 *                 maxLength: 500
 *                 nullable: true
 *                 description: Brief description of the design
 *               main_problem_focused:
 *                 type: string
 *                 maxLength: 5000
 *                 nullable: true
 *                 description: The main problem the design addresses
 *               key_constraints:
 *                 type: string
 *                 maxLength: 5000
 *                 nullable: true
 *                 description: Key constraints considered in the design
 *               figma_url:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *                 description: Link to Figma file
 *                 example: "https://figma.com/file/abc123"
 *     responses:
 *       201:
 *         description: Submission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Submission'
 *       400:
 *         description: Already has submission for this sprint
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
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { NextRequest } from 'next/server';
import pb from '@/lib/pocketbase';
import type { SubmissionWithRelations } from '@/lib/types';
import { Collections } from '@/lib/types';
import { createSubmission } from '@/lib/api';
import {
  CreateSubmissionSchema,
  SubmissionQuerySchema,
} from '@/lib/validation';
import {
  APIErrorHandler,
  APIResponse,
  RequestValidator,
  AuthMiddleware,
} from '@/lib/api-utils';
import { filterEquals, filterAnd } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    // Validate query parameters
    const query = RequestValidator.validateQuery(request, SubmissionQuerySchema);

    // Build filter
    const filters: string[] = [];
    if (query.sprint_id) {
      filters.push(filterEquals('sprint_id', query.sprint_id));
    }
    if (query.user_id) {
      filters.push(filterEquals('user_id', query.user_id));
    }
    if (query.status) {
      filters.push(filterEquals('status', query.status));
    }

    const filter = filters.length > 0 ? filterAnd(filters) : '';

    // Query with pagination
    const result = await pb
      .collection(Collections.SUBMISSIONS)
      .getList<SubmissionWithRelations>(query.page, query.perPage, {
        filter,
        sort: '-created',
        expand: 'user_id,sprint_id',
      });

    return APIResponse.success({
      page: result.page,
      perPage: result.perPage,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      items: result.items,
    });
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await AuthMiddleware.requireAuth(request);

    if (!authResult.success) {
      return APIErrorHandler.unauthorized(authResult.error);
    }

    // Validate request body
    const body = await RequestValidator.validateBody(
      request,
      CreateSubmissionSchema
    );

    // Call service function
    const submission = await createSubmission(body.sprint_id, {
      title: body.title,
      short_description: body.short_description ?? undefined,
      main_problem_focused: body.main_problem_focused ?? undefined,
      key_constraints: body.key_constraints ?? undefined,
      figma_url: body.figma_url ?? undefined,
    });

    return APIResponse.created(submission);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
