/**
 * Current User XP API Route
 *
 * @swagger
 * /api/v1/xp/me:
 *   get:
 *     tags:
 *       - XP
 *     summary: Get current user's XP
 *     description: Returns the current user's total XP and recent XP events.
 *     operationId: getCurrentUserXP
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User XP data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_xp:
 *                   type: integer
 *                 events:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       source_type:
 *                         type: string
 *                       amount:
 *                         type: integer
 *                       created:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "UNAUTHORIZED"
 *                 message: "Authentication required. Please provide a Bearer token."
 *                 status: 401
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { NextRequest } from 'next/server';
import {
  getUserXPTotal,
  getUserXPEvents,
} from '@/lib/api';
import { APIErrorHandler, APIResponse, AuthMiddleware } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const authResult = await AuthMiddleware.requireAuth(request);
    if (!authResult.success) {
      return APIErrorHandler.unauthorized(authResult.error);
    }

    const { user } = authResult.context;

    const [totalXp, events] = await Promise.all([
      getUserXPTotal(user.id),
      getUserXPEvents(user.id, 20), // Last 20 events
    ]);

    return APIResponse.success({
      total_xp: totalXp,
      events,
    });
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
