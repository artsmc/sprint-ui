/**
 * XP Leaderboard API Route
 *
 * @swagger
 * /api/v1/xp/leaderboard:
 *   get:
 *     tags:
 *       - XP
 *     summary: Get XP leaderboard
 *     description: |
 *       Returns the XP leaderboard ranked by total XP.
 *       If sprint_id is provided, returns sprint-specific leaderboard.
 *       Otherwise returns global leaderboard.
 *     operationId: getXPLeaderboard
 *     parameters:
 *       - name: sprint_id
 *         in: query
 *         description: Filter by sprint ID for sprint-specific leaderboard
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         description: Maximum number of entries (default 10)
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: XP leaderboard
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: string
 *                   user_name:
 *                     type: string
 *                   user_avatar:
 *                     type: string
 *                   total_xp:
 *                     type: integer
 *                   rank:
 *                     type: integer
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { NextRequest } from 'next/server';
import {
  getXPLeaderboard,
  getSprintXPLeaderboard,
} from '@/lib/api';
import { APIErrorHandler, APIResponse } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sprintId = searchParams.get('sprint_id');
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    let leaderboard;
    if (sprintId) {
      leaderboard = await getSprintXPLeaderboard(sprintId, limit);
    } else {
      leaderboard = await getXPLeaderboard(limit);
    }

    return APIResponse.success(leaderboard);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
