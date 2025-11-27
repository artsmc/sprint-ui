/**
 * Sprint by ID API Routes
 *
 * @swagger
 * /api/v1/sprints/{id}:
 *   get:
 *     tags:
 *       - Sprints
 *     summary: Get a sprint by ID
 *     description: |
 *       Returns a single sprint by its unique identifier.
 *       Optionally expand related challenge data.
 *     operationId: getSprint
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sprint ID
 *         example: "sprint123"
 *       - in: query
 *         name: expand
 *         schema:
 *           type: string
 *           enum: [challenge, started_by, ended_by, all]
 *           default: challenge
 *         description: Related data to expand
 *     responses:
 *       200:
 *         description: Sprint details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sprint'
 *       404:
 *         description: Sprint not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   patch:
 *     tags:
 *       - Sprints
 *     summary: Update a sprint
 *     description: |
 *       Updates an existing sprint.
 *       Requires authentication (any user).
 *       All fields are optional for partial updates.
 *     operationId: updateSprint
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sprint ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sprint_number:
 *                 type: integer
 *                 minimum: 1
 *               name:
 *                 type: string
 *                 maxLength: 100
 *               challenge_id:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [scheduled, active, voting, retro, completed, cancelled]
 *               start_at:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               end_at:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               voting_end_at:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               retro_day:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *               duration_days:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 30
 *     responses:
 *       200:
 *         description: Sprint updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sprint'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Sprint not found
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
 *       - Sprints
 *     summary: Delete a sprint (Admin only)
 *     description: |
 *       Deletes a sprint permanently.
 *       Requires admin authentication.
 *       Will fail if sprint has related records.
 *     operationId: deleteSprint
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sprint ID
 *     responses:
 *       204:
 *         description: Sprint deleted successfully
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Sprint not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { NextRequest } from 'next/server';
import { getSprint, getSprintWithChallenge, updateSprint, deleteSprint } from '@/lib/api';
import { UpdateSprintSchema, SprintExpandQuerySchema } from '@/lib/validation';
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
      SprintExpandQuerySchema
    );

    // Call appropriate service function based on expand option
    const sprint =
      query.expand === 'challenge' || query.expand === 'all'
        ? await getSprintWithChallenge(id)
        : await getSprint(id);

    return APIResponse.success(sprint);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Require authentication (any user can update sprints)
    const authResult = await AuthMiddleware.requireAuth(request);

    if (!authResult.success) {
      return APIErrorHandler.unauthorized(authResult.error);
    }

    // Validate request body
    const body = await RequestValidator.validateBody(
      request,
      UpdateSprintSchema
    );

    // Call service function
    const sprint = await updateSprint(id, body);

    return APIResponse.success(sprint);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Require admin authentication
    const authResult = await AuthMiddleware.requireAdmin(request);

    if (!authResult.success) {
      if (authResult.error.includes('Admin')) {
        return APIErrorHandler.forbidden(authResult.error);
      }
      return APIErrorHandler.unauthorized(authResult.error);
    }

    // Call service function
    await deleteSprint(id);

    return APIResponse.noContent();
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
