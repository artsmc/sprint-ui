/**
 * Active Sprint API Route
 *
 * @swagger
 * /api/v1/sprints/active:
 *   get:
 *     tags:
 *       - Sprints
 *     summary: Get the active sprint
 *     description: |
 *       Returns the currently active sprint.
 *       Only sprints with status='active' are returned.
 *       Returns null if no sprint is currently active.
 *     operationId: getActiveSprint
 *     responses:
 *       200:
 *         description: Active sprint or null
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Sprint'
 *                 - type: 'null'
 *             example:
 *               id: "sprint123"
 *               sprint_number: 5
 *               name: "Sprint #5 - Dashboard Design"
 *               status: "active"
 */

import { getActiveSprint } from '@/lib/api';
import { APIErrorHandler, APIResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    // Call service function
    const sprint = await getActiveSprint();

    return APIResponse.success(sprint);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
