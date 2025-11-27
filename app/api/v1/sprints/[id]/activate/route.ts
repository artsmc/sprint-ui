/**
 * Activate Sprint API Route
 *
 * @swagger
 * /api/v1/sprints/{id}/activate:
 *   post:
 *     tags:
 *       - Sprints
 *     summary: Activate a sprint
 *     description: |
 *       Activates a scheduled sprint, transitioning it to 'active' status.
 *       Only sprints with status='scheduled' can be activated.
 *       Sets the start_at timestamp to the current time.
 *       Requires authentication (any user).
 *     operationId: activateSprint
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
 *       200:
 *         description: Sprint activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sprint'
 *       400:
 *         description: Sprint cannot be activated (wrong status)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "BAD_REQUEST"
 *                 message: "Cannot activate sprint: current status is 'active', expected 'scheduled'"
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
 */

import { NextRequest } from 'next/server';
import { activateSprint } from '@/lib/api';
import { APIErrorHandler, APIResponse, AuthMiddleware } from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Require authentication (any user can activate sprints)
    const authResult = await AuthMiddleware.requireAuth(request);

    if (!authResult.success) {
      return APIErrorHandler.unauthorized(authResult.error);
    }

    // Call service function with the authenticated user's ID
    const sprint = await activateSprint(id, authResult.context.user.id);

    return APIResponse.success(sprint);
  } catch (error) {
    // Check for status transition error
    if (error instanceof Error && error.message.includes('Cannot activate')) {
      return APIErrorHandler.badRequest(error.message);
    }
    return APIErrorHandler.handleError(error);
  }
}
