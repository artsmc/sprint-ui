/**
 * Vote by ID API Routes
 *
 * @swagger
 * /api/v1/votes/{id}:
 *   get:
 *     tags:
 *       - Votes
 *     summary: Get a vote by ID
 *     description: Returns a single vote record by its unique identifier.
 *     operationId: getVote
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vote ID
 *         example: "vote123"
 *     responses:
 *       200:
 *         description: Vote details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vote'
 *       404:
 *         description: Vote not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   patch:
 *     tags:
 *       - Votes
 *     summary: Update a vote
 *     description: |
 *       Updates an existing vote. Only the vote owner can update.
 *       Partial updates are supported - only provide the ratings you want to change.
 *       Requires authentication.
 *     operationId: updateVote
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vote ID
 *         example: "vote123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating_clarity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating for design clarity (1-5)
 *                 example: 4
 *               rating_usability:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating for usability (1-5)
 *                 example: 5
 *               rating_visual_craft:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating for visual craft (1-5)
 *                 example: 4
 *               rating_originality:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating for originality (1-5)
 *                 example: 3
 *     responses:
 *       200:
 *         description: Vote updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vote'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Not the owner of this vote
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Vote not found
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
 *       - Votes
 *     summary: Delete a vote
 *     description: |
 *       Deletes an existing vote. Only the vote owner can delete.
 *       Requires authentication.
 *     operationId: deleteVote
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vote ID
 *         example: "vote123"
 *     responses:
 *       204:
 *         description: Vote deleted successfully
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Not the owner of this vote
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Vote not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { NextRequest } from 'next/server';
import { getVote, updateVote, deleteVote } from '@/lib/api';
import { UpdateVoteSchema } from '@/lib/validation';
import {
  APIErrorHandler,
  APIResponse,
  RequestValidator,
  AuthMiddleware,
} from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/v1/votes/[id]
 * Get a vote by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const vote = await getVote(id);

    return APIResponse.success(vote);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}

/**
 * PATCH /api/v1/votes/[id]
 * Update a vote (owner only)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Require authentication
    const authResult = await AuthMiddleware.requireAuth(request);

    if (!authResult.success) {
      return APIErrorHandler.unauthorized(authResult.error);
    }

    // Get the vote to check ownership
    const existingVote = await getVote(id);

    // Verify ownership (only vote owner can update)
    if (!AuthMiddleware.requireOwnership(authResult.context, existingVote.voter_id)) {
      return APIErrorHandler.forbidden('You can only update your own votes');
    }

    // Validate request body
    const ratings = await RequestValidator.validateBody(request, UpdateVoteSchema);

    // Check if there are any fields to update
    if (Object.keys(ratings).length === 0) {
      return APIErrorHandler.badRequest('No valid fields provided for update');
    }

    // Update the vote
    const updatedVote = await updateVote(id, ratings);

    return APIResponse.success(updatedVote);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}

/**
 * DELETE /api/v1/votes/[id]
 * Delete a vote (owner only)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Require authentication
    const authResult = await AuthMiddleware.requireAuth(request);

    if (!authResult.success) {
      return APIErrorHandler.unauthorized(authResult.error);
    }

    // Get the vote to check ownership
    const existingVote = await getVote(id);

    // Verify ownership (only vote owner can delete)
    if (!AuthMiddleware.requireOwnership(authResult.context, existingVote.voter_id)) {
      return APIErrorHandler.forbidden('You can only delete your own votes');
    }

    // Delete the vote
    await deleteVote(id);

    return APIResponse.noContent();
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
