/**
 * Token Refresh API Route
 *
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh authentication token
 *     description: |
 *       Refreshes the current authentication token.
 *       Requires a valid (but potentially expired) Bearer token.
 *       Returns a new token and updated user profile.
 *     operationId: refreshToken
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: New JWT token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "abc123xyz"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "designer@example.com"
 *                     name:
 *                       type: string
 *                       example: "Jane Designer"
 *                     role:
 *                       type: string
 *                       enum: [designer, admin]
 *                       example: "designer"
 *                     avatar:
 *                       type: string
 *                       nullable: true
 *                     created:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Token invalid or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "UNAUTHORIZED"
 *                 message: "Token invalid or expired. Please login again."
 *                 status: 401
 */

import { NextRequest } from 'next/server';
import { refreshAuth } from '@/lib/api';
import {
  APIErrorHandler,
  APIResponse,
  AuthMiddleware,
} from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    // Extract token from request (even if expired, we need it for refresh)
    const token = AuthMiddleware.extractToken(request);

    if (!token) {
      return APIErrorHandler.unauthorized(
        'Authentication required. Please provide a Bearer token.'
      );
    }

    // Call service function to refresh
    const authResponse = await refreshAuth();

    // Return new token and user profile
    return APIResponse.success({
      token: authResponse.token,
      user: {
        id: authResponse.record.id,
        email: authResponse.record.email,
        name: authResponse.record.name,
        role: authResponse.record.role,
        avatar: authResponse.record.avatar,
        created: authResponse.record.created,
      },
    });
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
