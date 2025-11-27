/**
 * Challenge by ID API Routes
 *
 * @swagger
 * /api/v1/challenges/{id}:
 *   get:
 *     tags:
 *       - Challenges
 *     summary: Get a challenge by ID
 *     description: Returns a single challenge by its unique identifier.
 *     operationId: getChallenge
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Challenge ID
 *         example: "abc123xyz"
 *     responses:
 *       200:
 *         description: Challenge details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Challenge'
 *       404:
 *         description: Challenge not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "NOT_FOUND"
 *                 message: "Challenge not found"
 *                 status: 404
 *
 *   patch:
 *     tags:
 *       - Challenges
 *     summary: Update a challenge (Admin only)
 *     description: |
 *       Updates an existing challenge.
 *       Requires admin authentication.
 *       All fields are optional for partial updates.
 *     operationId: updateChallenge
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Challenge ID
 *         example: "abc123xyz"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               challenge_number:
 *                 type: integer
 *                 minimum: 1
 *                 description: Unique challenge number
 *                 example: 42
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 description: Challenge title
 *                 example: "Updated Title"
 *               brief:
 *                 type: string
 *                 maxLength: 10000
 *                 description: Challenge brief/description
 *                 example: "<p>Updated brief...</p>"
 *     responses:
 *       200:
 *         description: Challenge updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Challenge'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Challenge not found
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
 *
 *   delete:
 *     tags:
 *       - Challenges
 *     summary: Delete a challenge (Admin only)
 *     description: |
 *       Deletes a challenge permanently.
 *       Requires admin authentication.
 *     operationId: deleteChallenge
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Challenge ID
 *         example: "abc123xyz"
 *     responses:
 *       204:
 *         description: Challenge deleted successfully
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Challenge not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { NextRequest } from 'next/server';
import { getChallenge, updateChallenge, deleteChallenge } from '@/lib/api';
import { UpdateChallengeSchema } from '@/lib/validation';
import {
  APIErrorHandler,
  APIResponse,
  RequestValidator,
  AuthMiddleware,
} from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Call service function
    const challenge = await getChallenge(id);

    return APIResponse.success(challenge);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Require admin authentication
    const authResult = await AuthMiddleware.requireAdmin(request);

    if (!authResult.success) {
      if (authResult.error.includes('Admin')) {
        return APIErrorHandler.forbidden(authResult.error);
      }
      return APIErrorHandler.unauthorized(authResult.error);
    }

    // Validate request body
    const body = await RequestValidator.validateBody(
      request,
      UpdateChallengeSchema
    );

    // Call service function
    const challenge = await updateChallenge(id, body);

    return APIResponse.success(challenge);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Require admin authentication
    const authResult = await AuthMiddleware.requireAdmin(request);

    if (!authResult.success) {
      if (authResult.error.includes('Admin')) {
        return APIErrorHandler.forbidden(authResult.error);
      }
      return APIErrorHandler.unauthorized(authResult.error);
    }

    // Call service function
    await deleteChallenge(id);

    return APIResponse.noContent();
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
