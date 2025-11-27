/**
 * Current User API Route
 *
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get current user profile
 *     description: |
 *       Returns the profile of the currently authenticated user.
 *       Requires a valid Bearer token in the Authorization header.
 *     operationId: getCurrentUser
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "abc123xyz"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "designer@example.com"
 *                 name:
 *                   type: string
 *                   example: "Jane Designer"
 *                 role:
 *                   type: string
 *                   enum: [designer, admin]
 *                   example: "designer"
 *                 avatar:
 *                   type: string
 *                   nullable: true
 *                   example: "avatar_abc123.jpg"
 *                 created:
 *                   type: string
 *                   format: date-time
 *                 updated:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Authentication required or token invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "UNAUTHORIZED"
 *                 message: "Authentication required. Please provide a Bearer token."
 *                 status: 401
 */

import { NextRequest } from 'next/server';
import {
  APIErrorHandler,
  APIResponse,
  AuthMiddleware,
} from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  // Require authentication
  const authResult = await AuthMiddleware.requireAuth(request);

  if (!authResult.success) {
    return APIErrorHandler.unauthorized(authResult.error);
  }

  // Return user profile (exclude sensitive fields)
  const { user } = authResult.context;

  return APIResponse.success({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    created: user.created,
    updated: user.updated,
  });
}
