/**
 * Feedback by ID API Routes
 *
 * @swagger
 * /api/v1/feedback/{id}:
 *   get:
 *     tags:
 *       - Feedback
 *     summary: Get feedback by ID
 *     description: |
 *       Returns a single feedback entry by its unique identifier.
 *       Anonymous feedback will not include author information.
 *     operationId: getFeedback
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Feedback ID
 *         schema:
 *           type: string
 *         example: "feedback123"
 *     responses:
 *       200:
 *         description: Feedback details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: Feedback not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   patch:
 *     tags:
 *       - Feedback
 *     summary: Update feedback
 *     description: |
 *       Updates an existing feedback entry.
 *       Only the original author can update their feedback.
 *       Requires authentication.
 *     operationId: updateFeedback
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Feedback ID
 *         schema:
 *           type: string
 *         example: "feedback123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               works_well:
 *                 type: string
 *                 maxLength: 5000
 *                 nullable: true
 *                 description: What works well in the design
 *               to_improve:
 *                 type: string
 *                 maxLength: 5000
 *                 nullable: true
 *                 description: Areas for improvement
 *               question:
 *                 type: string
 *                 maxLength: 2000
 *                 nullable: true
 *                 description: Questions for the designer
 *               is_anonymous:
 *                 type: boolean
 *                 description: Whether to hide author identity
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Not authorized to update this feedback
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Feedback not found
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
 *       - Feedback
 *     summary: Delete feedback
 *     description: |
 *       Deletes a feedback entry.
 *       Only the original author can delete their feedback.
 *       Requires authentication.
 *     operationId: deleteFeedback
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Feedback ID
 *         schema:
 *           type: string
 *         example: "feedback123"
 *     responses:
 *       204:
 *         description: Feedback deleted successfully
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Not authorized to delete this feedback
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Feedback not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { NextRequest } from 'next/server';
import {
  getFeedback,
  updateFeedback,
  deleteFeedback,
} from '@/lib/api';
import { UpdateFeedbackSchema } from '@/lib/validation';
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

    const feedback = await getFeedback(id);

    return APIResponse.success(feedback);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Require authentication
    const authResult = await AuthMiddleware.requireAuth(request);

    if (!authResult.success) {
      return APIErrorHandler.unauthorized(authResult.error);
    }

    // Validate request body
    const body = await RequestValidator.validateBody(
      request,
      UpdateFeedbackSchema
    );

    // Update feedback (service handles ownership check)
    const feedback = await updateFeedback(id, {
      works_well: body.works_well,
      to_improve: body.to_improve,
      question: body.question,
      is_anonymous: body.is_anonymous,
    });

    return APIResponse.success(feedback);
  } catch (error) {
    // Handle authorization error
    if (
      error instanceof Error &&
      error.message.includes('Not authorized to update')
    ) {
      return APIErrorHandler.forbidden(error.message);
    }
    return APIErrorHandler.handleError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Require authentication
    const authResult = await AuthMiddleware.requireAuth(request);

    if (!authResult.success) {
      return APIErrorHandler.unauthorized(authResult.error);
    }

    // Delete feedback (service handles ownership check)
    await deleteFeedback(id);

    return APIResponse.noContent();
  } catch (error) {
    // Handle authorization error
    if (
      error instanceof Error &&
      error.message.includes('Not authorized to delete')
    ) {
      return APIErrorHandler.forbidden(error.message);
    }
    return APIErrorHandler.handleError(error);
  }
}
