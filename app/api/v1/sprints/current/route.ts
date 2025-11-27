/**
 * Current Sprint API Route
 *
 * @swagger
 * /api/v1/sprints/current:
 *   get:
 *     tags:
 *       - Sprints
 *     summary: Get the current sprint
 *     description: |
 *       Returns the current sprint in any active phase.
 *       This includes sprints with status: active, voting, or retro.
 *       Returns null if no sprint is in an active phase.
 *     operationId: getCurrentSprint
 *     responses:
 *       200:
 *         description: Current sprint or null
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
 *               status: "voting"
 */

import { getCurrentSprint } from '@/lib/api';
import { APIErrorHandler, APIResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    // Call service function
    const sprint = await getCurrentSprint();

    return APIResponse.success(sprint);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
