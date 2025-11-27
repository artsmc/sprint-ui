/**
 * User Logout API Route
 *
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout current user
 *     description: |
 *       Logs out the current user by clearing the auth session.
 *       This is a client-side operation - the server clears the local auth store.
 *     operationId: logoutUser
 *     responses:
 *       204:
 *         description: Logout successful (no content)
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { logout } from '@/lib/api';
import { APIErrorHandler, APIResponse } from '@/lib/api-utils';

export async function POST() {
  try {
    // Call service function
    logout();

    // Return no content
    return APIResponse.noContent();
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
