/**
 * Challenges API Routes
 *
 * @swagger
 * /api/v1/challenges:
 *   get:
 *     tags:
 *       - Challenges
 *     summary: List all challenges
 *     description: |
 *       Returns a paginated list of all design challenges.
 *       Challenges are sorted by challenge number by default.
 *     operationId: listChallenges
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number (1-indexed)
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated list of challenges
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 perPage:
 *                   type: integer
 *                   example: 20
 *                 totalItems:
 *                   type: integer
 *                   example: 100
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Challenge'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   post:
 *     tags:
 *       - Challenges
 *     summary: Create a new challenge (Admin only)
 *     description: |
 *       Creates a new design challenge.
 *       Requires admin authentication.
 *     operationId: createChallenge
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - challenge_number
 *               - title
 *               - brief
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
 *                 example: "E-commerce Checkout Flow"
 *               brief:
 *                 type: string
 *                 maxLength: 10000
 *                 description: Challenge brief/description (HTML allowed)
 *                 example: "<p>Design a seamless checkout experience...</p>"
 *     responses:
 *       201:
 *         description: Challenge created successfully
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
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * components:
 *   schemas:
 *     Challenge:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "abc123xyz"
 *         challenge_number:
 *           type: integer
 *           example: 42
 *         title:
 *           type: string
 *           example: "E-commerce Checkout Flow"
 *         brief:
 *           type: string
 *           example: "<p>Design a seamless checkout experience...</p>"
 *         created:
 *           type: string
 *           format: date-time
 *         updated:
 *           type: string
 *           format: date-time
 */

import { NextRequest } from 'next/server';
import { listChallenges, createChallenge } from '@/lib/api';
import { ChallengeListQuerySchema, CreateChallengeSchema } from '@/lib/validation';
import {
  APIErrorHandler,
  APIResponse,
  RequestValidator,
  AuthMiddleware,
} from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    // Validate query parameters
    const query = RequestValidator.validateQuery(
      request,
      ChallengeListQuerySchema
    );

    // Call service function
    const result = await listChallenges(query.page, query.perPage);

    // Return paginated response
    return APIResponse.success({
      page: result.page,
      perPage: result.perPage,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      items: result.items,
    });
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const authResult = await AuthMiddleware.requireAdmin(request);

    if (!authResult.success) {
      // Check if it's an auth error vs forbidden error
      if (authResult.error.includes('Admin')) {
        return APIErrorHandler.forbidden(authResult.error);
      }
      return APIErrorHandler.unauthorized(authResult.error);
    }

    // Validate request body
    const body = await RequestValidator.validateBody(
      request,
      CreateChallengeSchema
    );

    // Call service function
    const challenge = await createChallenge({
      challenge_number: body.challenge_number,
      title: body.title,
      brief: body.brief,
    });

    // Return created challenge
    return APIResponse.created(challenge);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
