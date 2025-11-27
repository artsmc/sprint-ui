/**
 * User Login API Route
 *
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login with email and password
 *     description: |
 *       Authenticates a user with email and password.
 *       Returns a JWT token and user profile on success.
 *     operationId: loginUser
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "designer@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securepassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
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
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "UNAUTHORIZED"
 *                 message: "Invalid email or password"
 *                 status: 401
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { NextRequest } from 'next/server';
import { login } from '@/lib/api';
import { LoginSchema } from '@/lib/validation';
import {
  APIErrorHandler,
  APIResponse,
  RequestValidator,
} from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const body = await RequestValidator.validateBody(request, LoginSchema);

    // Call service function
    const authResponse = await login({
      email: body.email,
      password: body.password,
    });

    // Return token and user profile
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
