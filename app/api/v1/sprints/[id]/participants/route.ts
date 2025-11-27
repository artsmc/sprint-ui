/**
 * Sprint Participants API Routes
 *
 * @swagger
 * /api/v1/sprints/{id}/participants:
 *   get:
 *     tags:
 *       - Sprint Participants
 *     summary: Get sprint participants
 *     description: |
 *       Returns all participants in a sprint.
 *       Optionally expand user data for each participant.
 *     operationId: getSprintParticipants
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
 *           enum: [user]
 *         description: Expand user data for each participant
 *     responses:
 *       200:
 *         description: List of participants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SprintParticipant'
 *       404:
 *         description: Sprint not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   post:
 *     tags:
 *       - Sprint Participants
 *     summary: Join a sprint
 *     description: |
 *       Join a sprint as the current authenticated user.
 *       Creates a new participant record linking the user to the sprint.
 *       Requires authentication.
 *     operationId: joinSprint
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sprint ID
 *         example: "sprint123"
 *     responses:
 *       201:
 *         description: Successfully joined sprint
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SprintParticipant'
 *       400:
 *         description: Already a participant in this sprint
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "BAD_REQUEST"
 *                 message: "Already participating in this sprint"
 *                 status: 400
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
 *
 *   delete:
 *     tags:
 *       - Sprint Participants
 *     summary: Leave a sprint
 *     description: |
 *       Leave a sprint as the current authenticated user.
 *       Deletes the participant record linking the user to the sprint.
 *       Requires authentication.
 *     operationId: leaveSprint
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sprint ID
 *         example: "sprint123"
 *     responses:
 *       204:
 *         description: Successfully left sprint
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Not a participant in this sprint
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "NOT_FOUND"
 *                 message: "Not participating in this sprint"
 *                 status: 404
 *
 * components:
 *   schemas:
 *     SprintParticipant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "participant123"
 *         sprint_id:
 *           type: string
 *           example: "sprint123"
 *         user_id:
 *           type: string
 *           example: "user456"
 *         joined_at:
 *           type: string
 *           format: date-time
 *         created:
 *           type: string
 *           format: date-time
 *         updated:
 *           type: string
 *           format: date-time
 *         expand:
 *           type: object
 *           properties:
 *             user_id:
 *               $ref: '#/components/schemas/User'
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  getSprintParticipants,
  getSprintParticipantsWithUsers,
  joinSprint,
  leaveSprint,
} from '@/lib/api';
import {
  APIErrorHandler,
  APIResponse,
  RequestValidator,
  AuthMiddleware,
} from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Query schema for expand parameter
const ParticipantExpandQuerySchema = z.object({
  expand: z.enum(['user']).optional(),
});

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: sprintId } = await params;

    // Validate query parameters for expand option
    const query = RequestValidator.validateQuery(
      request,
      ParticipantExpandQuerySchema
    );

    // Call appropriate service function based on expand option
    const participants =
      query.expand === 'user'
        ? await getSprintParticipantsWithUsers(sprintId)
        : await getSprintParticipants(sprintId);

    return APIResponse.success(participants);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: sprintId } = await params;

    // Require authentication
    const authResult = await AuthMiddleware.requireAuth(request);

    if (!authResult.success) {
      return APIErrorHandler.unauthorized(authResult.error);
    }

    // Call service function (uses authenticated user internally)
    const participant = await joinSprint(sprintId);

    return APIResponse.created(participant);
  } catch (error) {
    // Check for already participating error
    if (
      error instanceof Error &&
      error.message.includes('Already participating')
    ) {
      return APIErrorHandler.badRequest(error.message);
    }
    return APIErrorHandler.handleError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: sprintId } = await params;

    // Require authentication
    const authResult = await AuthMiddleware.requireAuth(request);

    if (!authResult.success) {
      return APIErrorHandler.unauthorized(authResult.error);
    }

    // Call service function (uses authenticated user internally)
    await leaveSprint(sprintId);

    return APIResponse.noContent();
  } catch (error) {
    // Check for not participating error
    if (
      error instanceof Error &&
      error.message.includes('Not participating')
    ) {
      return APIErrorHandler.notFound(error.message);
    }
    return APIErrorHandler.handleError(error);
  }
}
