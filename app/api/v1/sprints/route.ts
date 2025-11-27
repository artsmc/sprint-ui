/**
 * Sprints API Routes
 *
 * @swagger
 * /api/v1/sprints:
 *   get:
 *     tags:
 *       - Sprints
 *     summary: List all sprints
 *     description: |
 *       Returns a paginated list of sprints.
 *       Optionally filter by status.
 *     operationId: listSprints
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, active, voting, retro, completed, cancelled]
 *         description: Filter by sprint status
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
 *         description: Paginated list of sprints
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
 *                     $ref: '#/components/schemas/Sprint'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   post:
 *     tags:
 *       - Sprints
 *     summary: Create a new sprint
 *     description: |
 *       Creates a new biweekly design sprint.
 *       Requires authentication (any user).
 *     operationId: createSprint
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sprint_number
 *               - name
 *               - challenge_id
 *             properties:
 *               sprint_number:
 *                 type: integer
 *                 minimum: 1
 *                 description: Unique sprint number
 *                 example: 5
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 description: Sprint name
 *                 example: "Sprint #5 - Dashboard Design"
 *               challenge_id:
 *                 type: string
 *                 description: ID of the challenge for this sprint
 *                 example: "abc123xyz"
 *               status:
 *                 type: string
 *                 enum: [scheduled, active, voting, retro, completed, cancelled]
 *                 default: scheduled
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
 *                 default: 14
 *     responses:
 *       201:
 *         description: Sprint created successfully
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
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * components:
 *   schemas:
 *     Sprint:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "sprint123"
 *         sprint_number:
 *           type: integer
 *           example: 5
 *         name:
 *           type: string
 *           example: "Sprint #5 - Dashboard Design"
 *         challenge_id:
 *           type: string
 *           example: "abc123xyz"
 *         status:
 *           type: string
 *           enum: [scheduled, active, voting, retro, completed, cancelled]
 *           example: "active"
 *         start_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         end_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         voting_end_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         retro_day:
 *           type: string
 *           format: date
 *           nullable: true
 *         duration_days:
 *           type: integer
 *           example: 14
 *         started_by_id:
 *           type: string
 *           nullable: true
 *         ended_by_id:
 *           type: string
 *           nullable: true
 *         created:
 *           type: string
 *           format: date-time
 *         updated:
 *           type: string
 *           format: date-time
 */

import { NextRequest } from 'next/server';
import { listSprints, getSprintsByStatus, createSprint } from '@/lib/api';
import { SprintQuerySchema, CreateSprintSchema } from '@/lib/validation';
import {
  APIErrorHandler,
  APIResponse,
  RequestValidator,
  AuthMiddleware,
} from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    // Validate query parameters
    const query = RequestValidator.validateQuery(request, SprintQuerySchema);

    // Call appropriate service function based on status filter
    const result = query.status
      ? await getSprintsByStatus(query.status, query.page, query.perPage)
      : await listSprints(query.page, query.perPage);

    // Return paginated response
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
    // Require authentication (any user can create sprints)
    const authResult = await AuthMiddleware.requireAuth(request);

    if (!authResult.success) {
      return APIErrorHandler.unauthorized(authResult.error);
    }

    // Validate request body
    const body = await RequestValidator.validateBody(
      request,
      CreateSprintSchema
    );

    // Call service function
    const sprint = await createSprint({
      sprint_number: body.sprint_number,
      name: body.name,
      challenge_id: body.challenge_id,
      status: body.status,
      start_at: body.start_at,
      end_at: body.end_at,
      voting_end_at: body.voting_end_at,
      retro_day: body.retro_day,
      duration_days: body.duration_days,
    });

    // Return created sprint
    return APIResponse.created(sprint);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
