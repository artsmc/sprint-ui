/**
 * User Registration API Route
 *
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user account
 *     description: |
 *       Creates a new user account with the provided email, password, and name.
 *       The password must be at least 8 characters and match the confirmation.
 *     operationId: registerUser
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - passwordConfirm
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "newuser@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: "securepassword123"
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *                 example: "securepassword123"
 *               name:
 *                 type: string
 *                 example: "Jane Designer"
 *     responses:
 *       201:
 *         description: User created successfully
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
 *                   example: "newuser@example.com"
 *                 name:
 *                   type: string
 *                   example: "Jane Designer"
 *                 role:
 *                   type: string
 *                   enum: [designer, admin]
 *                   example: "designer"
 *                 created:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Email already exists
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
 */

import { NextRequest } from 'next/server';
import { register } from '@/lib/api';
import { RegisterSchema } from '@/lib/validation';
import {
  APIErrorHandler,
  APIResponse,
  RequestValidator,
} from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const body = await RequestValidator.validateBody(request, RegisterSchema);

    // Call service function
    const user = await register({
      email: body.email,
      password: body.password,
      passwordConfirm: body.passwordConfirm,
      name: body.name,
    });

    // Return created user (exclude sensitive fields)
    return APIResponse.created({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      created: user.created,
    });
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
